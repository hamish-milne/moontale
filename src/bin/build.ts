/// <reference lib="es2021" />
import {build, BuildOptions, OnLoadResult, Plugin} from 'esbuild';
import {pnpPlugin} from '@yarnpkg/esbuild-plugin-pnp';
import {replace} from 'esbuild-plugin-replace';

import PostHTML from 'posthtml';
import {NodeTag, parser} from 'posthtml-parser';
import htmlnano from 'htmlnano';
import { copyFileSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import posthtmlInlineAssets from 'posthtml-inline-assets';
import postcss from 'postcss';
import cssnano from 'cssnano';
import path from 'path';

function nullLoader(filter: RegExp): Plugin {
    return {
        name: 'nullLoader',
        setup(build) {
            build.onLoad({ filter }, _ => {
                return {
                    contents: '',
                    loader: 'js'
                }
            });
        },
    }
}

const sourceMapPrefix = process.argv[2]?.toString()
const fixSourceMapUrl: Plugin = {
    name: 'fixSourceMapUrl',
    setup(build) {
        build.onEnd(result => {
            if (!sourceMapPrefix) {
                return;
            }
            result.outputFiles = result.outputFiles?.map(file => {
                if (file.path.endsWith(".js")) {
                    const newText = file.text.replaceAll(/^(\/\/# sourceMappingURL=)(.*)$/gm, (_, p1, p2) => {
                        if (!p2.startsWith(sourceMapPrefix)) {
                            return `${p1}${sourceMapPrefix}${p2}`;
                        } else {
                            return `${p1}${p2}`;
                        }
                    });
                    return {
                        path: file.path,
                        contents: Buffer.from(newText, 'utf8'),
                        text: newText
                    };
                } else {
                    return file;
                }
            });
        });
    }
}

function flattenJson(obj: object, prefix: string, excludeKeys: string[]): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (excludeKeys.includes(key)) {
            continue;
        }
        if (typeof value === 'object') {
            Object.assign(result, flattenJson(value, `${prefix}${key}.`, excludeKeys));
        } else {
            result[`${prefix}${key}`] = JSON.stringify(value);
        }
    }
    return result;
}

const common: BuildOptions = {
    minify: true,
    target: 'es2015',
    sourcemap: 'linked',
    write: false,
}

// Remove all 'use strict' statements from the code, and add it at the top level with 'banner'.
const removeUseStrict = {
    '"use strict"': '',
    "'use strict'": '',
}

function moduleOptions(defines: Record<string, string>): BuildOptions { return {
    ...common,
    plugins: [
        nullLoader(/mdurl/),
        // Force CodeMirror modes to use the 'plain browser env', rather than
        //   importing a new CodeMirror instance.
        replace({
            include: /codemirror.*\.js$/,
            delimiters: ['', ''],
            'typeof exports == "object"': 'false',
            'typeof define == "function"': 'false',
            'typeof module == "object"': 'false',
            'define.amd': 'false',
            ...removeUseStrict,
        }),
        replace({
            include: /\.js$/,
            delimiters: ['', ''],
            ...removeUseStrict,
        }),
        pnpPlugin({
            async onLoad(args) {
                const contents = readFileSync(args.path);
                const result: OnLoadResult = {
                    contents: contents,
                    loader: 'default',
                    resolveDir: path.dirname(args.path),
                };
                if (args.path.endsWith(".css")) {
                    result.contents = Buffer.from((await postcss([cssnano()]).process(contents, { from: args.path })).css, 'utf8');
                }
                return result;
            }
        }),
        fixSourceMapUrl,
    ],
    external: [
        '../../lib/codemirror',
        '../meta',
        '../xml/xml',
    ],
    format: 'iife',
    bundle: true,
    define: {
        // Excludes nodejs-specific stuff from Fengari
        "process.env.FENGARICONF": "undefined",
        "process": "undefined",
        ...defines
    },
    loader: {
        '.css': 'text',
        '.lua': 'text',
        '.svg': 'dataurl',
        '.png': 'dataurl',
    },
    banner: {
        js: '"use strict";',
    },
} };

async function buildJs(options: BuildOptions): Promise<string> {
    const result = await build(options);
    let text: string;
    for (const file of result.outputFiles ?? []) {
        writeFileSync(file.path, file.contents);
        if (file.path.endsWith(".js")) {
            text = file.text;
        }
    }
    return text!;
}

async function buildHtml(input: string): Promise<string> {
    const result = await PostHTML([
        posthtmlInlineAssets({
            errors: 'warn',
            transforms: {
                image: {
                    resolve(node: NodeTag) {
                        return node.tag === 'img' && node.attrs && node.attrs.src && require.resolve(node.attrs.src as string);
                    },
                    transform(node: NodeTag, args: { from: string, buffer: Buffer, mime: string }) {
                        if (!node.attrs) {
                            return;
                        }
                        const svgRoot = parser(args.buffer.toString('utf8'))[0] as NodeTag;
                        node.tag = 'svg';
                        Object.assign(node.attrs, svgRoot.attrs);
                        delete node.attrs.src;
                        node.content = svgRoot.content as any[];
                    }
                }
            }
        }),
        htmlnano({
            minifyCss: true,
            minifyJs: false,
            minifySvg: false,
            collapseWhitespace: 'aggressive'
        }),
    ]).process(readFileSync(input, 'utf8'));
    return result.html;
}

async function doBuild() {
    const pkg = (await import("../../package.json")).default;
    const iconName = pkg.icon.split(/\//).pop()!;
    copyFileSync(pkg.icon, `./build/${iconName}`);
    pkg.icon = iconName;
    const packageDefines = flattenJson(pkg, "PACKAGE.", ["dependencies", "devDependencies"]);
    const hydrate_raw = await buildJs({
        ...moduleOptions(packageDefines),
        entryPoints: ['./src/format/hydrate.ts'],
        outfile: './build/hydrate.js',
        globalName: 'DUMMY_GLOBAL_NAME',
    });
    // NOTE: To ensure sourcemaps work correctly, these two strings should be the same length:
    const hydrate = hydrate_raw.replace('var DUMMY_GLOBAL_NAME', 'this.editorExtensions');
    await buildJs({
        ...moduleOptions(packageDefines),
        entryPoints: ['./src/player/index.ts'],
        outfile: './build/player.js',
    });
    const sourceHtml = await buildHtml('./src/player/index.html');
    await buildJs({
        ...common,
        define: {
            ...packageDefines,
            'HYDRATE': JSON.stringify(hydrate),
            'SOURCE': JSON.stringify(sourceHtml),
        },
        entryPoints: ['./src/format/format.js'],
        outfile: './build/format.js',
        sourcemap: false,
    });
    for (const path of ['./build/player.js', './build/hydrate.js']) {
        unlinkSync(path);
    }
}

doBuild();
