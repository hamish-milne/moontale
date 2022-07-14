import { Editor } from "codemirror"
import { makeLinter } from "./linter"

describe("Linter", () => {
    it("can be created", () => {
        makeLinter('', () => [])(`{$
            
            foo = 5
            x(foo.bar())
        ]

            $}`, undefined, {} as Editor)
    })
})