import assert from "assert";
import * as rp from "../src/responseparsing.js";

var parser = new rp.ResponseParser();

describe("Parsing Vectors", function () {

    describe("Whether or not it can correctly identify vectors", function () {
        [
            ["3i", true],
            ["+3i", true],
            ["-3i", true],
            ["3.3i", true],
            ["+3.3i", true],
            ["-3.3i", true],
            ["+   3.3   i", true],
            ["-   3.3   i", true],
            ["3j", true],
            ["3k", true],
            ["i", true],
            ["j", true],
            ["k", true],
            ["+i", true],
            ["-i", true],
            ["+j", true],
            ["-j", true],
            ["+k", true],
            ["-k", true],
            ["3i+3j", true],
            ["3i   +   3j", true],
            ["   3   i   +   3   j   ", true],
            ["3i-3j", true],
            ["   3   i   -   3   j   ", true],
            ["3i+4j+5k", true],
            ["3i-4j-5k", true],
            ["-3i+4j+5k", true],
            ["-3i-4j-5k", true],
            ["   3   i   +   4   j   +   5   k   ", true],
            ["3i+j+k", true],
            ["i+4j+k", true],
            ["i+j+5k", true],
            ["i+i", true],
            ["i+i+i", true],
            ["j+j", true],
            ["j+j+j", true],
            ["k+k", true],
            ["k+k+k", true],
            ["i+2i+3i", true],
            ["i+2i+3i+j+2j+3j+k+2k+3k", true],
            ["ii", false],
            ["+ii", false],
            ["-ii", false],
            ["3ii", false],
            ["3.3ii", false],
            ["i i", false],
            ["3 i i", false],
            ["3.3 i i", false],
            ["ij", false],
            ["ijk", false],
            ["jj", false],
            ["ji", false],
            ["jk", false],
            ["jki", false],
            ["kk", false],
            ["ki", false],
            ["kj", false],
            ["kij", false],
            ["a", false],
            ["b", false],
            ["c", false],
            ["3a", false],
            ["3b", false],
            ["3c", false],
            ["+a", false],
            ["-a", false],
            ["3i+3ij", false],
            ["3i+4j+5kk", false],
        ].forEach(a => {
            if (a[1] == true) {
                it(`should see that '${a[0]}' IS a vector`, function () {
                    assert.equal(parser.getParseResult(a[0]).type, "vector");
                });
            }
            else {
                it(`should see that '${a[0]}' IS NOT a vector`, function () {
                    assert.notEqual(parser.getParseResult(a[0]).type, "vector");
                });
            }
        });
    });

});