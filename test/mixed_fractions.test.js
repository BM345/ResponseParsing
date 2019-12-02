import assert from "assert";
import * as rp from "../src/responseparsing.js";

var parser = new rp.ResponseParser();

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
        it(`should see that '${a[0]}' and '${a[1]}' ARE${(a[2] == false) ? " NOT" : ""} equal`, function () {
            var r1 = parser.getParseResult(a[0]);
            var r2 = parser.getParseResult(a[1]);

            assert.equal(r1.isEqualTo(r2), a[2]);
        });
    });
});