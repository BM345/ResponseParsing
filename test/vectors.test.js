import assert from "assert";
import * as rp from "../src/responseparsing.js";

var parser = new rp.ResponseParser();

parser.simplifier.settings.lookForVectors = true;
parser.simplifier.settings.changeIJKToUnitVectors = false;
parser.simplifier.settings.lookForComplexNumbers = false;

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
                    var r1 = parser.getParseResult(a[0]);

                    assert.equal(r1.type, "vector");
                });
            }
            else {
                it(`should see that '${a[0]}' IS NOT a vector`, function () {
                    var r1 = parser.getParseResult(a[0]);

                    assert.notEqual(r1.type, "vector");
                });
            }
        });
    });

    describe("Whether or not it can see if two vectors are the same", function () {
        [
            ["i", "i", true],
            ["   i   ", "i", true],
            ["j", "j", true],
            ["k", "k", true],
            ["3i", "3i", true],
            ["   3   i   ", "3i", true],
            ["3.3i", "3.3i", true],
            ["i+j", "i+j", true],
            ["   i   +   j   ", "i+j", true],
            ["3i+j", "3i+j", true],
            ["3i+4j", "3i+4j", true],
            ["i+j+k", "i+j+k", true],
            ["3i+4j+5k", "3i+4j+5k", true],
            ["i+3i+j+4j+k+5k", "i+3i+j+4j+k+5k", true],
            ["i+j", "j+i", false],
            ["2i+i", "i+2i", false],
            ["2i+i", "3i", false],
            ["1i", "i", false],
            ["-2i", "2i", false],
            ["-i", "i", false],
        ].forEach(a => {
            if (a[2] == true) {
                it(`should see that '${a[0]}' and '${a[1]}' ARE the same vector`, function () {
                    var r1 = parser.getParseResult(a[0]);
                    var r2 = parser.getParseResult(a[1]);

                    assert.equal(r1.isEqualTo(r2), true);
                });
            }
            else {
                it(`should see that '${a[0]}' and '${a[1]}' ARE NOT the same vector`, function () {
                    var r1 = parser.getParseResult(a[0]);
                    var r2 = parser.getParseResult(a[1]);

                    assert.equal(r1.isEqualTo(r2), false);
                });
            }
        });
    });

    describe("Whether the ASCIIMath output is correct", function () {
        [
            ["i", "i"],
            ["   i   ", "i"],
            ["+i", "+i"],
            ["-i", "-i"],
            ["3i", "3*i"],
            ["3.3i", "3.3*i"],
            ["   3   i   ", "3*i"],
            ["   3.3   i   ", "3.3*i"],
            ["i+j", "i+j"],
            ["i-j", "i-j"],
            ["+i+j", "+i+j"],
            ["-i-j", "-i-j"],
            ["3i+3j", "3*i+3*j"],
            ["3i+j", "3*i+j"],
            ["i+3j", "i+3*j"],
            ["3i-3j", "3*i-3*j"],
            ["-3i-3j", "-3*i-3*j"],
            ["i+j+k", "i+j+k"],
            ["   i   +   j   +   k   ", "i+j+k"],
            ["3i+4j+5k", "3*i+4*j+5*k"],
            ["   3   i   +   4   j   +   5   k   ", "3*i+4*j+5*k"],
        ].forEach(a => {
            it(`should see that the ASCIIMath output for '${a[0]}' is '${a[1]}'`, function () {
                var r1 = parser.getParseResult(a[0]);

                assert.equal(r1.asciiMath, a[1]);
            });
        });
    });

    describe("Whether the LaTeX output is correct", function () {
        [
            ["i", "i"],
            ["   i   ", "i"],
            ["+i", "+i"],
            ["-i", "-i"],
            ["3i", "3i"],
            ["3.3i", "3.3i"],
            ["   3   i   ", "3i"],
            ["   3.3   i   ", "3.3i"],
            ["i+j", "i+j"],
            ["i-j", "i-j"],
            ["+i+j", "+i+j"],
            ["-i-j", "-i-j"],
            ["3i+3j", "3i+3j"],
            ["3i+j", "3i+j"],
            ["i+3j", "i+3j"],
            ["3i-3j", "3i-3j"],
            ["-3i-3j", "-3i-3j"],
            ["i+j+k", "i+j+k"],
            ["   i   +   j   +   k   ", "i+j+k"],
            ["3i+4j+5k", "3i+4j+5k"],
            ["   3   i   +   4   j   +   5   k   ", "3i+4j+5k"],
        ].forEach(a => {
            it(`should see that the LaTeX output for '${a[0]}' is '${a[1]}'`, function () {
                var r1 = parser.getParseResult(a[0]);

                assert.equal(r1.latex, a[1]);
            });
        });
    });

});