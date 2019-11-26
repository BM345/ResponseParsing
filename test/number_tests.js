var assert = require("assert");
var rp = require("../responseparsing");

var parser = new rp.ResponseParser();

describe("parseNumber", function () {
    [
        ["123", 3],
        ["1234", 4],
        ["12345", 5],
    ].forEach(a => {
        it(`should see that there are ${a[1]} s.f. in '${a[0]}'`, function () {
            assert.equal(parser.parseNumber(a[0], new rp.Marker()).minimumNumberOfSignificantFigures, a[1]);
        });
    });
});





















