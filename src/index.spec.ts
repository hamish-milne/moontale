import { strictEqual } from "assert";
import fs from "fs"
import { parse, render } from "./index"

describe('Parser', function() {
    it('parses the test file', function() {
        const src = fs.readFileSync(`${__dirname}/test.md`, 'utf8')
        const tokens = parse(src)
        console.log(tokens)
        console.log(render(src))
    })
})