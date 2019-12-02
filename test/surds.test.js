import assert from "assert";
import * as rp from "../src/responseparsing.js";

var parser = new rp.ResponseParser();

describe("Parsing Surds", function () {

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
        var r1 = parser.getParseResult(a[0]);

        if (a[1] == true) {
            it(`should see that '${a[0]}' IS a surd`, function () {
                assert.equal(r1.type, "surd");
            });

            it(`should see that the coefficient of '${a[0]}' is '${a[2]}'`, function () {
                assert.equal(r1.coefficient.text, a[2]);
            });

            it(`should see that the radicand of '${a[0]}' is '${a[3]}'`, function () {
                assert.equal(r1.radical.radicand.text, a[3]);
            });
        }
        else {
            it(`should see that '${a[0]}' IS NOT a surd`, function () {
                assert.notEqual(r1.type, "surd");
            });
        }
    });

});