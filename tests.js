
// Because sometimes it's just quicker and easier to run the tests in the browser.

function assertEqual(expected, actual) {
    if (actual !== expected) {
        throw new Error("Assertion failed. Expected '" + expected.toString() + "'; got '" + actual.toString()) + "'";
    }
}

var n = 1;

function assertEqualTest(expected, actual, testName) {
    try {
        assertEqual(expected, actual);
    }
    catch (e) {
        console.log("%c" + e.toString(), "color: #ff0000;");
    }

    n++;
}

if (true) {

    var rp = new ResponseParser();

    var number = rp.parseNumber("123", new Marker());

    assertEqualTest("integer", number.subtype);
    assertEqualTest("123", number.integralPart);
    assertEqualTest("", number.decimalPart);
    assertEqualTest("123", number.simplestForm);
    assertEqualTest("positive", number.sign);
    assertEqualTest(false, number.signIsExplicit);
    assertEqualTest(0, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(3, number.minimumNumberOfSignificantFigures);
    assertEqualTest(3, number.maximumNumberOfSignificantFigures);
    assertEqualTest(0, number.numberOfDecimalPlaces);

    number = rp.parseNumber("+123", new Marker());

    assertEqualTest("integer", number.subtype);
    assertEqualTest("123", number.integralPart);
    assertEqualTest("", number.decimalPart);
    assertEqualTest("+123", number.simplestForm);
    assertEqualTest("positive", number.sign);
    assertEqualTest(true, number.signIsExplicit);
    assertEqualTest(0, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(3, number.minimumNumberOfSignificantFigures);
    assertEqualTest(3, number.maximumNumberOfSignificantFigures);
    assertEqualTest(0, number.numberOfDecimalPlaces);

    number = rp.parseNumber("-123", new Marker());

    assertEqualTest("integer", number.subtype);
    assertEqualTest("123", number.integralPart);
    assertEqualTest("", number.decimalPart);
    assertEqualTest("-123", number.simplestForm);
    assertEqualTest("negative", number.sign);
    assertEqualTest(true, number.signIsExplicit);
    assertEqualTest(0, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(3, number.minimumNumberOfSignificantFigures);
    assertEqualTest(3, number.maximumNumberOfSignificantFigures);
    assertEqualTest(0, number.numberOfDecimalPlaces);

    number = rp.parseNumber("-00123", new Marker());

    assertEqualTest("integer", number.subtype);
    assertEqualTest("00123", number.integralPart);
    assertEqualTest("", number.decimalPart);
    assertEqualTest("-123", number.simplestForm);
    assertEqualTest("negative", number.sign);
    assertEqualTest(true, number.signIsExplicit);
    assertEqualTest(2, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(3, number.minimumNumberOfSignificantFigures);
    assertEqualTest(3, number.maximumNumberOfSignificantFigures);
    assertEqualTest(0, number.numberOfDecimalPlaces);

    number = rp.parseNumber("-0012300", new Marker());

    assertEqualTest("integer", number.subtype);
    assertEqualTest("0012300", number.integralPart);
    assertEqualTest("", number.decimalPart);
    assertEqualTest("-12300", number.simplestForm);
    assertEqualTest("negative", number.sign);
    assertEqualTest(true, number.signIsExplicit);
    assertEqualTest(2, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(3, number.minimumNumberOfSignificantFigures);
    assertEqualTest(5, number.maximumNumberOfSignificantFigures);
    assertEqualTest(0, number.numberOfDecimalPlaces);

    number = rp.parseNumber("-0012300456", new Marker());

    assertEqualTest("integer", number.subtype);
    assertEqualTest("0012300456", number.integralPart);
    assertEqualTest("", number.decimalPart);
    assertEqualTest("-12300456", number.simplestForm);
    assertEqualTest("negative", number.sign);
    assertEqualTest(true, number.signIsExplicit);
    assertEqualTest(2, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(8, number.minimumNumberOfSignificantFigures);
    assertEqualTest(8, number.maximumNumberOfSignificantFigures);
    assertEqualTest(0, number.numberOfDecimalPlaces);

    number = rp.parseNumber("12.345", new Marker());

    assertEqualTest("decimalNumber", number.subtype);
    assertEqualTest("12", number.integralPart);
    assertEqualTest(".345", number.decimalPart);
    assertEqualTest("12.345", number.simplestForm);
    assertEqualTest("positive", number.sign);
    assertEqualTest(false, number.signIsExplicit);
    assertEqualTest(0, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(5, number.minimumNumberOfSignificantFigures);
    assertEqualTest(5, number.maximumNumberOfSignificantFigures);
    assertEqualTest(3, number.numberOfDecimalPlaces);

    number = rp.parseNumber("0.123", new Marker());

    assertEqualTest("decimalNumber", number.subtype);
    assertEqualTest("0", number.integralPart);
    assertEqualTest(".123", number.decimalPart);
    assertEqualTest("0.123", number.simplestForm);
    assertEqualTest("positive", number.sign);
    assertEqualTest(false, number.signIsExplicit);
    assertEqualTest(1, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(3, number.minimumNumberOfSignificantFigures);
    assertEqualTest(3, number.maximumNumberOfSignificantFigures);
    assertEqualTest(3, number.numberOfDecimalPlaces);

    number = rp.parseNumber(".123", new Marker());

    assertEqualTest("decimalNumber", number.subtype);
    assertEqualTest("", number.integralPart);
    assertEqualTest(".123", number.decimalPart);
    assertEqualTest("0.123", number.simplestForm);
    assertEqualTest("positive", number.sign);
    assertEqualTest(false, number.signIsExplicit);
    assertEqualTest(0, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(3, number.minimumNumberOfSignificantFigures);
    assertEqualTest(3, number.maximumNumberOfSignificantFigures);
    assertEqualTest(3, number.numberOfDecimalPlaces);

    number = rp.parseNumber("-.12300", new Marker());

    assertEqualTest("decimalNumber", number.subtype);
    assertEqualTest("", number.integralPart);
    assertEqualTest(".12300", number.decimalPart);
    assertEqualTest("-0.12300", number.simplestForm);
    assertEqualTest("negative", number.sign);
    assertEqualTest(true, number.signIsExplicit);
    assertEqualTest(0, number.numberOfLeadingZeros);
    assertEqualTest(2, number.numberOfTrailingZeros);
    assertEqualTest(5, number.minimumNumberOfSignificantFigures);
    assertEqualTest(5, number.maximumNumberOfSignificantFigures);
    assertEqualTest(5, number.numberOfDecimalPlaces);

    number = rp.parseNumber("-.0012300456", new Marker());

    assertEqualTest("decimalNumber", number.subtype);
    assertEqualTest("", number.integralPart);
    assertEqualTest(".0012300456", number.decimalPart);
    assertEqualTest("-0.0012300456", number.simplestForm);
    assertEqualTest("negative", number.sign);
    assertEqualTest(true, number.signIsExplicit);
    assertEqualTest(0, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(8, number.minimumNumberOfSignificantFigures);
    assertEqualTest(8, number.maximumNumberOfSignificantFigures);
    assertEqualTest(10, number.numberOfDecimalPlaces);

    number = rp.parseNumber("123.", new Marker());

    assertEqualTest("decimalNumber", number.subtype);
    assertEqualTest("123", number.integralPart);
    assertEqualTest(".", number.decimalPart);
    assertEqualTest("123", number.simplestForm);
    assertEqualTest("positive", number.sign);
    assertEqualTest(false, number.signIsExplicit);
    assertEqualTest(0, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(3, number.minimumNumberOfSignificantFigures);
    assertEqualTest(3, number.maximumNumberOfSignificantFigures);
    assertEqualTest(0, number.numberOfDecimalPlaces);

    number = rp.parseNumber("000.123", new Marker());

    assertEqualTest("decimalNumber", number.subtype);
    assertEqualTest("000", number.integralPart);
    assertEqualTest(".123", number.decimalPart);
    assertEqualTest("0.123", number.simplestForm);
    assertEqualTest("positive", number.sign);
    assertEqualTest(false, number.signIsExplicit);
    assertEqualTest(3, number.numberOfLeadingZeros);
    assertEqualTest(0, number.numberOfTrailingZeros);
    assertEqualTest(3, number.minimumNumberOfSignificantFigures);
    assertEqualTest(3, number.maximumNumberOfSignificantFigures);
    assertEqualTest(3, number.numberOfDecimalPlaces);

    console.log("Ran", n, "tests.");
}