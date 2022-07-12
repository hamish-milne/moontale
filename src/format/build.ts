import {build, Plugin} from 'esbuild';
import {pnpPlugin} from '@yarnpkg/esbuild-plugin-pnp';
import {replace} from 'esbuild-plugin-replace';

import PostHTML from 'posthtml';
import {NodeTag, parser} from 'posthtml-parser';
import htmlnano from 'htmlnano';
import { readFileSync } from 'fs';
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

async function buildOne(entry: string, output: string | undefined) {
    const result = await build({
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
        minify: true,
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

async function buildFormat(entry: string, output: string, placeholders: Record<string, string>) {
    await build({
        plugins: [
            replace(placeholders),
        ],
        entryPoints: [entry],
        outfile: output,
        bundle: false,
        minify: true,
        format: undefined
    });
}

async function doBuild() {
    const hydrate = await buildOne('./src/format/hydrate.ts', undefined);
    const legacy = (await buildOne('./src/hydrate_legacy.ts', undefined));
    await buildOne('./src/index.ts', './dist/player.js');
    const sourceHtml = await buildHtml('./src/index.html');
    await buildFormat('./src/format/format.js', './dist/format.js', {
        'HYDRATE': JSON.stringify(hydrate),
        'HYDRATE_LEGACY': `()=>{${legacy}}`,
        'SOURCE': JSON.stringify(sourceHtml)
    })
}

doBuild();