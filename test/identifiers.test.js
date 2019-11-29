import assert from "assert";
import * as rp from "../src/responseparsing.js";

var parser = new rp.ResponseParser();

describe("Parsing Identifiers", function () {

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
        it(`should see that '${a[0]}' and '${a[1]}' ARE${(a[2] == false) ? " NOT" : ""} equal`, function () {
            var r1 = parser.getParseResult(a[0]);
            var r2 = parser.getParseResult(a[1]);

            assert.equal(r1.isEqualTo(r2), a[2]);
        });
    });

});