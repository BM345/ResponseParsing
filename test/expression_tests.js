var assert = require("assert");
var rp = require("../responseparsing");

var parser = new rp.ResponseParser();

describe("RPNode.isEqualTo", function () {
    [
        ["x", "x"],
        [" x", "x"],
        ["   x", "x"],
        ["x ", "x"],
        ["x   ", "x"],
        [" x ", "x"],
        ["   x   ", "x"],
        ["123", "123"],
        ["   123   ", "123"],
        ["1/2","1/2"],
        [" 1/2","1/2"],
        ["   1/2","1/2"],
        ["1 /2","1/2"],
        ["   1   /2","1/2"],
        ["   1   /   2","1/2"],
        ["   1   /   2   ","1/2"],
        [" 1 / 2 ","1/2"],
        ["123/456","123/456"],
        [" 123 / 456 ","123/456"],
        ["   123   /   456   ","123/456"],
        ["a+b", "a+b"],
        ["a + b", "a+b"],
        [" a + b ", "a+b"],
        ["   a + b   ", "a+b"],
       ].forEach(a => {
                it (`should see that '${a[0]}' and '${a[1]}' are equal`, function(){
                      assert.equal(parser.getParseResult(a[0]).isEqualTo(parser.getParseResult(a[1])), true);
                 });
    });
});