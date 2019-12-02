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

    describe("Whether or not it can see if two complex numbers are the same", function () {
        [
            ["1", "1", true],
            ["+1", "+1", true],
            ["-1", "-1", true],
            ["   1   ", "1", true],
            ["   +   1   ", "+1", true],
            ["   -   1   ", "-1", true],
            ["1+1", "1+1", true],
            ["1-1", "1-1", true],
            ["+1+1", "+1+1", true],
            ["-1-1", "-1-1", true],
            ["i", "i", true],
            ["   i   ", "i", true],
            ["+i", "+i", true],
            ["-i", "-i", true],
            ["   +   i   ", "+i", true],
            ["   -   i   ", "-i", true],
            ["3i", "3i", true],
            ["   3   i   ", "3i", true],
            ["3.3i", "3.3i", true],
            ["   3.3   i", "3.3i", true],
            ["i+i", "i+i", true],
            ["i-i", "i-i", true],
            ["+i+i", "+i+i", true],
            ["-i-i", "-i-i", true],
            ["2i+2", "2i+2", true],
            ["2i+2+3", "2i+2+3", true],
            ["i+1", "1+i", false],
            ["i+2", "2+i", false],
            ["2i+1", "1+2i", false],
            ["2i+i", "3i", false],
            ["2i+2+3", "2i+5", false],
        ].forEach(a => {
            if (a[2] == true) {
                it(`should see that '${a[0]}' and '${a[1]}' ARE the same complex number`, function () {
                    var r1 = parser.getParseResult(a[0]);
                    var r2 = parser.getParseResult(a[1]);

                    assert.equal(r1.isEqualTo(r2), true);
                });
            }
            else {
                it(`should see that '${a[0]}' and '${a[1]}' ARE NOT the same complex number`, function () {
                    var r1 = parser.getParseResult(a[0]);
                    var r2 = parser.getParseResult(a[1]);

                    assert.equal(r1.isEqualTo(r2), false);
                });
            }
        });
    });

});