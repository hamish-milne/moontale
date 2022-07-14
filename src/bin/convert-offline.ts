import { storyToLua } from "../common/convert";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { readFileSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";

(() => {
  yargs(hideBin(process.argv))
    .command("$0 <input> <output>", "Convert a Twine:Moontale story to Lua", {
      builder: (yargs) =>
        yargs
          .positional("input", {
            desc: "The story to convert (HTML)",
          })
          .positional("output", {
            desc: "The output file (Lua)",
          }),
      handler: function (argv) {
        const input = new JSDOM(readFileSync(String(argv.input), "utf8"));
        const output = storyToLua(
          input.window.document.getElementById("storyData")!.children[0]
        );
        writeFileSync(String(argv.output), output);
      },
    })
    .parseSync();
})();
