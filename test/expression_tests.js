import assert from "assert";
import * as rp from "../src/responseparsing.js";

var parser = new rp.ResponseParser();

describe("RPNode.isEqualTo", function () {

    describe("Numbers", function () {
        [
            ["123", "123", true],
            ["   123   ", "123", true],
            ["456", "123", false],
            ["   456   ", "123", false],
            ["123.0", "123", false],
            ["123.", "123", false],
            ["0123", "123", false],
        ].forEach(a => {
            it(`should see that '${a[0]}' and '${a[1]}' are${(a[2] == false) ? " not" : ""} equal`, function () {
                assert.equal(parser.getParseResult(a[0]).isEqualTo(parser.getParseResult(a[1])), a[2]);
            });
        });
    });

    describe("Additions and Summations", function () {
        [
            ["a+a", "binaryOperation", "addition"],
            ["a+a+a", "summation", "", 3, ["a", "a", "a"]],
            ["a+a+a+a", "summation", "", 4, ["a", "a", "a", "a"]],
            ["a+a+a+a+a", "summation", "", 5, ["a", "a", "a", "a", "a"]],
            ["a+a+a+a+a+a", "summation", "", 6, ["a", "a", "a", "a", "a", "a"]],
            ["a+b+c", "summation", "", 3, ["a", "b", "c"]],
            ["c+b+a", "summation", "", 3, ["c", "b", "a"]],
            ["m+b+g+w+t", "summation", "",  5, ["m", "b", "g", "w", "t"]],
        ].forEach(a => {
            var n = parser.getParseResult(a[0]);

            it(`should see that '${a[0]}' has the type '${a[1]}' and the subtype '${a[2]}'`, function () {
                assert.equal(n.type, a[1]);
                assert.equal(n.subtype, a[2]);
            });

            if (a[1] == "summation") {
                it(`should see that the operands of '${a[0]}' are ${a[4].map(b => "'" + b + "'").join(", ")}`, function () {
                    assert.equal(n.operands.length, a[3]);
                    for (var i = 0; i < n.operands.length; i++) {
                        assert.equal(n.operands[i].value, a[4][i]);
                    }
                });
            }
        });
    });

    describe("Expressions", function () {
        [
            ["a+b", "a+b", true],
            ["a + b", "a+b", true],
            [" a + b ", "a+b", true],
            ["   a + b   ", "a+b", true],
            ["b+a", "a+b", false],
            ["a-b", "a+b", false],
            ["a*b", "a+b", false],
            ["a/b", "a+b", false],
            ["a^b", "a+b", false],
            ["a+2", "a+b", false],
            ["2+a", "a+b", false],
            ["ab", "a+b", false],
            ["a+c", "a+b", false],
            ["c+b", "a+b", false],
            ["a+2/3", "a+2/3", true],
            ["a + 2 / 3", "a+2/3", true],
        ].forEach(a => {
            it(`should see that '${a[0]}' and '${a[1]}' are${(a[2] == false) ? " not" : ""} equal`, function () {
                assert.equal(parser.getParseResult(a[0]).isEqualTo(parser.getParseResult(a[1])), a[2]);
            });
        });
    });

});