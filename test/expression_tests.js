var assert = require("assert");
var rp = require("../responseparsing");

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
        ].forEach(a => {
            it(`should see that '${a[0]}' and '${a[1]}' are${(a[2] == false) ? " not" : ""} equal`, function () {
                assert.equal(parser.getParseResult(a[0]).isEqualTo(parser.getParseResult(a[1])), a[2]);
            });
        });
    });

});