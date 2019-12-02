import assert from "assert";
import * as rp from "../src/responseparsing.js";

var parser = new rp.ResponseParser();

describe("Parsing Fractions", function () {

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
        it(`should see that '${a[0]}' and '${a[1]}' ARE${(a[2] == false) ? " NOT" : ""} equal`, function () {
            var r1 = parser.getParseResult(a[0]);
            var r2 = parser.getParseResult(a[1]);

            assert.equal(r1.isEqualTo(r2), a[2]);
        });
    });

});