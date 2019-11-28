import assert from "assert";
import * as rp from "../src/responseparsing.js";

var parser = new rp.ResponseParser();

describe("RPNode.isEqualTo", function () {

    describe("Identifiers", function () {
        [
            ["x", "x", true],
            [" x", "x", true],
            ["   x", "x", true],
            ["x ", "x", true],
            ["x   ", "x", true],
            [" x ", "x", true],
            ["   x   ", "x", true],
            ["x", "y", false],
            ["   x   ", "y", false],
            ["xy", "y", false],
            ["xy", "yx", false],
        ].forEach(a => {
            it(`should see that '${a[0]}' and '${a[1]}' are${(a[2] == false) ? " not" : ""} equal`, function () {
                assert.equal(parser.getParseResult(a[0]).isEqualTo(parser.getParseResult(a[1])), a[2]);
            });
        });
    });

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

    describe("Fractions", function () {
        [
            ["1/2", "1/2", true],
            [" 1/2", "1/2", true],
            ["   1/2", "1/2", true],
            ["1 /2", "1/2", true],
            ["   1   /2", "1/2", true],
            ["   1   /   2", "1/2", true],
            ["   1   /   2   ", "1/2", true],
            [" 1 / 2 ", "1/2", true],
            ["123/456", "123/456", true],
            [" 123 / 456 ", "123/456", true],
            ["   123   /   456   ", "123/456", true],
            ["1/2", "1/3", false],
            ["1/3", "2/3", false],
            ["2/4", "3/5", false],
            ["1./2", "1/2", false],
            ["1/2.", "1/2", false],
            ["1./2.", "1/2", false],
            ["01/2", "1/2", false],
            ["001/2", "1/2", false],
            ["1.0/2", "1/2", false],
            ["1/2.0", "1/2", false],
            ["1.0/2.0", "1/2", false],
        ].forEach(a => {
            it(`should see that '${a[0]}' and '${a[1]}' are${(a[2] == false) ? " not" : ""} equal`, function () {
                assert.equal(parser.getParseResult(a[0]).isEqualTo(parser.getParseResult(a[1])), a[2]);
            });
        });
    });

    describe("Mixed Fractions", function () {
        [
            ["1 2/3", "1 2/3", true],
            [" 1 2/3 ", "1 2/3", true],
            ["   1   2/3   ", "1 2/3", true],
            ["   1   2   /   3   ", "1 2/3", true],
            ["12/3", "1 2/3", false],
            ["1 1/3", "1 2/3", false],
            ["2 2/3", "1 2/3", false],
            ["1 2/4", "1 2/3", false],
            ["1 2./3", "1 2/3", false],
            ["1 2.0/3", "1 2/3", false],
            ["1 2/3.", "1 2/3", false],
            ["1 2/3.0", "1 2/3", false],
        ].forEach(a => {
            it(`should see that '${a[0]}' and '${a[1]}' are${(a[2] == false) ? " not" : ""} equal`, function () {
                assert.equal(parser.getParseResult(a[0]).isEqualTo(parser.getParseResult(a[1])), a[2]);
            });
        });
    });

    describe("Surds", function () {
        [
            ["2 sqrt 2", true, "2", "2"],
            ["2sqrt2", true, "2", "2"],
            ["2 sqrt2", true, "2", "2"],
            ["2sqrt 2", true, "2", "2"],
            ["2 sqrt(2)", true, "2", "2"],
            ["2 sqrt (2)", true, "2", "2"],
            ["2 sqrt ( 2 )", true, "2", "2"],
            ["2 sqrt ((2))", true, "2", "2"],
            ["2 sqrt (((2)))", true, "2", "2"],
            ["2 sqrt ((((2))))", true, "2", "2"],
            ["2 sqrt ( ( ( ( 2 ) ) ) )", true, "2", "2"],
            ["3 sqrt 2", true, "3", "2"],
            ["4 sqrt 2", true, "4", "2"],
            ["12 sqrt 34", true, "12", "34"],
            ["12.34 sqrt 56.78", true, "12.34", "56.78"],
            ["-2 sqrt -2", true, "-2", "-2"],
            ["+2 sqrt +2", true, "+2", "+2"],
            ["2 root 2", true, "2", "2"],
            ["2 squareroot 2", true, "2", "2"],
            ["2 sqr 3", false],
            ["2 sqrt * 3", false],
        ].forEach(a => {
            var n = parser.getParseResult(a[0]);

            if (a[1] == true) {
                it(`should see that '${a[0]}' is a surd`, function () {
                    assert.equal(n.type, "surd");
                });

                it(`should see that the coefficient of '${a[0]}' is '${a[2]}'`, function () {
                    assert.equal(n.coefficient.text, a[2]);
                });

                it(`should see that the radicand of '${a[0]}' is '${a[3]}'`, function () {
                    assert.equal(n.radical.radicand.text, a[3]);
                });
            }
            else {
                it(`should see that '${a[0]}' is not a surd`, function () {
                    assert.notEqual(n.type, "surd");
                });
            }
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