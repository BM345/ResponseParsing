var assert = require("assert");
var rp = require("../responseparsing");

var parser = new rp.ResponseParser();

describe("isEqualTo", function () {
    [
        ["x", "x"],
        [" x", "x"]
    ].forEach(a => {
                it (`should see that '${a[0]}' and '${a[1]}' are equal`, function(){
                      assert.equal(parser.getParseResult(a[0]).isEqualTo(parser.getParseResult(a[1])), true);
                 });
    });
});