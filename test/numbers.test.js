import assert from "assert";
import * as rp from "../src/responseparsing.js";

var parser = new rp.ResponseParser();

parser.simplifier.settings.lookForVectors = false;
parser.simplifier.settings.lookForComplexNumbers = false;

describe("Parsing Numbers", function () {

    [
        ["123", "integer", "123", "", "positive", false, 0, 0, 3, 3, 0],
        ["+123", "integer", "123", "", "positive", true, 0, 0, 3, 3, 0],
        ["-123", "integer", "123", "", "negative", true, 0, 0, 3, 3, 0],
        ["-00123", "integer", "00123", "", "negative", true, 2, 0, 3, 3, 0],
        ["-0012300", "integer", "0012300", "", "negative", true, 2, 0, 3, 5, 0],
        ["-0012300456", "integer", "0012300456", "", "negative", true, 2, 0, 8, 8, 0],
        ["12.345", "decimalNumber", "12", ".345", "positive", false, 0, 0, 5, 5, 3],
        ["+12.345", "decimalNumber", "12", ".345", "positive", true, 0, 0, 5, 5, 3],
        ["-12.345", "decimalNumber", "12", ".345", "negative", true, 0, 0, 5, 5, 3],
        ["0.123", "decimalNumber", "0", ".123", "positive", false, 1, 0, 3, 3, 3],
        [".123", "decimalNumber", "", ".123", "positive", false, 0, 0, 3, 3, 3],
        ["-.12300", "decimalNumber", "", ".12300", "negative", true, 0, 2, 5, 5, 5],
        ["-.0012300456", "decimalNumber", "", ".0012300456", "negative", true, 0, 0, 8, 8, 10],
        ["123.", "decimalNumber", "123", ".", "positive", false, 0, 0, 3, 3, 0],
        ["000.123", "decimalNumber", "000", ".123", "positive", false, 3, 0, 3, 3, 3],
        ["0", "integer", "0", "", "zero", false, 1, 0, 1, 1, 0],
        ["000", "integer", "000", "", "zero", false, 3, 0, 1, 1, 0],
        ["0.0", "decimalNumber", "0", ".0", "zero", false, 1, 1, 1, 1, 1],
        ["0.0000", "decimalNumber", "0", ".0000", "zero", false, 1, 4, 1, 1, 4],
        ["000.0", "decimalNumber", "000", ".0", "zero", false, 3, 1, 1, 1, 1],
        ["000.0000", "decimalNumber", "000", ".0000", "zero", false, 3, 4, 1, 1, 4],
        ["+0", "integer", "0", "", "zero", true, 1, 0, 1, 1, 0],
        ["-0", "integer", "0", "", "zero", true, 1, 0, 1, 1, 0]
    ].forEach(a => {
        var n = parser.parseNumber(a[0], new rp.Marker());

        describe(a[0], function () {
            it(`should see that '${a[0]}' has the type 'number'`, function () {
                assert.equal(n.type, "number");
            });

            it(`should see that '${a[0]}' has the subtype '${a[1]}'`, function () {
                assert.equal(n.subtype, a[1]);
            });

            it(`should see that the integral part of '${a[0]}' is '${a[2]}'`, function () {
                assert.equal(n.integralPart, a[2]);
            });

            it(`should see that the decimal part of '${a[0]}' is '${a[3]}'`, function () {
                assert.equal(n.decimalPart, a[3]);
            });

            it(`should see that the sign of '${a[0]}' is '${a[4]}'`, function () {
                assert.equal(n.sign, a[4]);
            });

            it(`should see that '${a[0]}' has an ${(a[5] == true) ? "explicit" : "implicit"} sign`, function () {
                assert.equal(n.signIsExplicit, a[5]);
            });

            it(`should see that '${a[0]}' has ${a[6]} leading zeros`, function () {
                assert.equal(n.numberOfLeadingZeros, a[6]);
            });

            it(`should see that '${a[0]}' has ${a[7]} trailing zeros`, function () {
                assert.equal(n.numberOfTrailingZeros, a[7]);
            });

            it(`should see that there are a minimum of ${a[8]} s.f. in '${a[0]}'`, function () {
                assert.equal(n.minimumNumberOfSignificantFigures, a[8]);
            });

            it(`should see that there are a maximum of ${a[9]} s.f. in '${a[0]}'`, function () {
                assert.equal(n.maximumNumberOfSignificantFigures, a[9]);
            });

            it(`should see that '${a[0]}' has ${a[10]} decimal places`, function () {
                assert.equal(n.numberOfDecimalPlaces, a[10]);
            });
        });
    });

    describe("As nodes", function () {
        [
            ["123", "123", true],
            ["   123   ", "123", true],
            ["456", "123", false],
            ["   456   ", "123", false],
            ["123.0", "123", false],
            ["123.", "123", false],
            ["0123", "123", false],
        ].forEach(a => {
            it(`should see that '${a[0]}' and '${a[1]}' ARE${(a[2] == false) ? " NOT" : ""} equal`, function () {
                var r1 = parser.getParseResult(a[0]);
                var r2 = parser.getParseResult(a[1]);

                assert.equal(r1.isEqualTo(r2), a[2]);
            });
        });
    });

});





















