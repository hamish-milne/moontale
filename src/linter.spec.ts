import { Editor } from "codemirror"
import { lint } from "./linter"

describe("Linter", () => {
    it("foo", () => {
        lint(`{$
            
            foo = 5
            x(foo.bar())
        ]

            $}`, undefined, {} as Editor)
    })
})