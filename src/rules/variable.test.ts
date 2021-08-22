import rewire from "rewire"
const variable = rewire("./variable")
const isLetter = variable.__get__("isLetter")
const propertyExpression = variable.__get__("propertyExpression")
const callExpression = variable.__get__("callExpression")
const lambdaExpression = variable.__get__("lambdaExpression")
// @ponicode
describe("isLetter", () => {
    test("0", () => {
        let callFunction: any = () => {
            isLetter(200)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            isLetter(500)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            isLetter(404)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            isLetter(429)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            isLetter(400)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            isLetter(-Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("propertyExpression", () => {
    test("0", () => {
        let callFunction: any = () => {
            propertyExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            propertyExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            propertyExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            propertyExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            propertyExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            propertyExpression(undefined, [])
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("callExpression", () => {
    test("0", () => {
        let callFunction: any = () => {
            callExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"], -100, -100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            callExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"], 1, 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            callExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"], 1, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            callExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"], 0, 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            callExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos"], 0, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            callExpression(undefined, [], NaN, NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("lambdaExpression", () => {
    test("0", () => {
        let callFunction: any = () => {
            lambdaExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            lambdaExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            lambdaExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            lambdaExpression(undefined, ["/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos", "/PDFData/rothfuss/data/UCF101/prepared_videos"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            lambdaExpression(undefined, [])
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("variable.default", () => {
    test("0", () => {
        let callFunction: any = () => {
            variable.default(undefined, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            variable.default(undefined, true)
        }
    
        expect(callFunction).not.toThrow()
    })
})
