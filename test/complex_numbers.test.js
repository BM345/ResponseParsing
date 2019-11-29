import assert from "assert";
import * as rp from "../src/responseparsing.js";

var parser = new rp.ResponseParser();

parser.simplifier.settings.lookForVectors = false;
parser.simplifier.settings.lookForComplexNumbers = true;

describe("Parsing Complex Numbers", function () {

    describe("Whether or not it can correctly identify complex numbers", function () {
        [
            ["1", true],
            ["   1   ", true],
            ["+1", true],
            ["   +   1   ", true],
            ["-1", true],
            ["   -   1   ", true],
            ["2", true],
            ["3", true],
            ["123", true],
            ["   123   ", true],
            ["1+1", true],
            ["+1+1", true],
            ["1-1", true],
            ["-1-1", true],
            ["1+1+1+1+1", true],
            ["1-1-1-1-1", true],
            ["i", true],
            ["   i   ", true],
            ["+i", true],
            ["   +   i   ", true],
            ["-i", true],
            ["   -   i   ", true],
            ["3i", true],
            ["   3   i   ", true],
            ["3.3i", true],
            ["+3i", true],
            ["-3i", true],
            ["i+i", true],
            ["i-i", true],
            ["+i+i", true],
            ["-i-i", true],
            ["2i+2i", true],
            ["2.2i+2.2i", true],
            ["i+1", true],
            ["i+3", true],
            ["1i+1", true],
            ["3i+1", true],
            ["3i+3", true],
            ["2i+2+3i+3", true],
            ["ii", false],
            ["3ii", false],
            ["iii", false],
            ["3iii", false],
            ["+ii", false],
            ["-ii", false],
            ["a", false],
            ["3a", false],
            ["3.3a", false],
            ["3+3a", false],
            ["3+3b", false],
            ["3+3i+3a", false],
        ].forEach(a => {
            if (a[1] == true) {
                it(`should see that '${a[0]}' IS a complex number`, function () {
                    var r1 = parser.getParseResult(a[0]);

                    assert.equal(r1.type, "complexNumber");
                });
            }
            else {
                it(`should see that '${a[0]}' IS NOT a complex number`, function () {
                    var r1 = parser.getParseResult(a[0]);

                    assert.notEqual(r1.type, "complexNumber");
                });
            }
        });
    });

});