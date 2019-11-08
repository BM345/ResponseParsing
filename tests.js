

function assertEqual(expected, actual) {
    if (actual !== expected) {
        throw new Error("Assertion failed. Expected " + expected.toString() + "; got " + actual.toString());
    }
}

if (true) {

    var rp = new ResponseParser();

    assertEqual("123", rp.parseInteger("123", new Marker()).text);
    assertEqual(null, rp.parseInteger(" 123", new Marker()));
    assertEqual(null, rp.parseInteger("+123", new Marker()));
    assertEqual(null, rp.parseInteger("-123", new Marker()));
    assertEqual("123", rp.parseInteger("123.", new Marker()).text);
    assertEqual("123", rp.parseInteger("123.0", new Marker()).text);

}