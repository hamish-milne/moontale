import {build, BuildOptions, Plugin} from 'esbuild';
import {pnpPlugin} from '@yarnpkg/esbuild-plugin-pnp';
import {replace} from 'esbuild-plugin-replace';

import PostHTML from 'posthtml';
import {NodeTag, parser} from 'posthtml-parser';
import htmlnano from 'htmlnano';
import { copyFileSync, readFileSync } from 'fs';
import posthtmlInlineAssets from 'posthtml-inline-assets';

function nullLoader(filter: RegExp): Plugin {
    return {
        name: 'nullLoader',
        setup(build) {
            build.onLoad({ filter }, _ => {
                return {
                    contents: '',
                    loader: 'js'
                }
            })
        },
    }
}

const hasSourceMaps = false;
const common: Partial<BuildOptions> = {
    minifyWhitespace: false,
    minifyIdentifiers: false,
    minifySyntax: true,
    target: 'es2015',
}

async function buildModule(entry: string, format: 'cjs' | 'iife', output: string) {
    const result = await build({
        ...common,
        plugins: [
            nullLoader(/mdurl/),
            replace({
                include: /\.js$/,
                // Force CodeMirror modes to use the 'plain browser env', rather than
                //   importing a new CodeMirror instance.
                // NOTE: This is terrible! It basically hacks around CodeMirror's own hack.
                // NOTE: This might break other things!!!
                'typeof exports': 'undefined',
                'typeof define': 'undefined',
                'typeof module': 'undefined',
            }),
            pnpPlugin(),
        ],
        external: [
            '../../lib/codemirror',
            '../meta',
            '../xml/xml',
        ],
        entryPoints: [entry],
        outfile: output,
        bundle: true,
        sourcemap: output ? 'linked' : false,
        format: format,
        write: output ? true : false,
        define: {
            // Excludes nodejs-specific stuff from Fengari
            "process.env.FENGARICONF": "undefined",
            "process": "undefined",
        },
        loader: {
            ['.css']: 'text',
            ['.lua']: 'text'
        },
    });
    return output ? '' : result.outputFiles[0].text;
}

async function buildHtml(input: string): Promise<string> {
    const result = await PostHTML([
        posthtmlInlineAssets({
            errors: 'warn',
            transforms: {
                image: {
                    resolve(node: NodeTag) {
                        return node.tag === 'img' && node.attrs.src && require.resolve(node.attrs.src as string);
                    },
                    transform(node: NodeTag, args: { from: string, buffer: Buffer, mime: string }) {
                        const svgRoot = parser(args.buffer.toString('utf8'))[0] as NodeTag;
                        node.tag = 'svg';
                        Object.assign(node.attrs, svgRoot.attrs);
                        node.attrs.src = undefined;
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

async function buildFormat(entry: string, output: string | undefined, placeholders: Record<string, string>) {
    const result = await build({
        ...common,
        plugins: [
            replace(placeholders),
        ],
        entryPoints: [entry],
        outfile: output,
        write: output ? true : false,
        bundle: false,
        format: undefined,
        sourcemap: output ? 'linked' : (hasSourceMaps ? 'inline' : undefined),
    });
    return output ? '' : result.outputFiles[0].text;
}

async function doBuild() {
    const Package = (await import("../../package.json")).default;
    const iconName = Package.icon.split(/\//).pop();
    copyFileSync(Package.icon, `./build/${iconName}`);
    Package.icon = iconName;
    const mode_factory = await buildModule('./src/format/codemirror_mode_factory.cjs', 'cjs', undefined);
    const hydrate = await buildFormat('./src/format/hydrate.js', undefined, {
        'MODE_FACTORY': mode_factory,
        'PACKAGE': JSON.stringify(Package),
    })
    await buildModule('./src/player/index.ts', 'iife', './dist/player.js');
    const sourceHtml = await buildHtml('./src/player/index.html');
    await buildFormat('./src/format/format.js', './build/format.js', {
        'HYDRATE': JSON.stringify(hydrate),
        'SOURCE': JSON.stringify(sourceHtml),
        'PACKAGE': JSON.stringify(Package),
    })
}

doBuild();