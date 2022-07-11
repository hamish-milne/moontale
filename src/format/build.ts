import {build, Plugin} from 'esbuild';
import {pnpPlugin} from '@yarnpkg/esbuild-plugin-pnp';
import {replace} from 'esbuild-plugin-replace';

import PostHTML from 'posthtml';
import {NodeTag, parser} from 'posthtml-parser';
import htmlnano from 'htmlnano';
import { readFileSync } from 'fs';

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

async function buildOne(entry: string) {
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
        bundle: true,
        minify: true,
        write: false,
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
    return result.outputFiles[0].text;
}

async function buildHtml(input: string, scriptContent: string): Promise<string> {
    const result = await PostHTML([
        tree => tree.walk(node => {
            if (node.tag === "script") {
                node.content = [scriptContent];
            }
            if (node.tag === 'img' && typeof node.attrs === 'object' && typeof node.attrs.src === 'string') {
                const svgRoot = parser(readFileSync(require.resolve(node.attrs.src)).toString())[0] as NodeTag;
                node.tag = 'svg';
                Object.assign(node.attrs, svgRoot.attrs);
                node.attrs.src = undefined;
                node.content = svgRoot.content as any[];
            }
            return node;
        }),
        htmlnano({
            minifyCss: false,
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
    const hydrate = await buildOne('./src/format/hydrate.ts');
    const legacy = (await buildOne('./src/hydrate_legacy.ts'));
    const runtime = await buildOne('./src/index.ts');
    const sourceHtml = await buildHtml('./src/index.html', runtime);
    await buildFormat('./src/format/format.js', './dist/format.js', {
        'HYDRATE': JSON.stringify(hydrate),
        'HYDRATE_LEGACY': `()=>{${legacy}}`,
        'SOURCE': JSON.stringify(sourceHtml)
    })
}

doBuild();