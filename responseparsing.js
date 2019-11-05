
function isAnyOf(characters, character) {
    return (characters.split("").filter(c => c == character).length > 0);
}


class Marker {
    constructor() {
        this.position = 0;
    }
}

class ResponseParser {

    getParseResult(inputText) {
        var m1 = new Marker();
        var m2 = new Marker();
        var m3 = new Marker();

        var signedInteger = this.parseSignedInteger(inputText, m1);
        var signedDecimalNumber = this.parseSignedDecimalNumber(inputText, m2);
        var sign = this.parseSign(inputText, m3);

        if (signedInteger !== null && m1.position == inputText.length) {
            return signedInteger;
        }
        else if (signedDecimalNumber !== null && m2.position == inputText.length) {
            return signedDecimalNumber;
        }
        else if (sign !== null && m3.position == inputText.length) {
            return sign;
        }
        else {
            return null;
        }
    }

    parseSignedDecimalNumber(inputText, marker) {
        var sign = this.parseSign(inputText, marker);
        var decimalNumber = this.parseDecimalNumber(inputText, marker);

        if (decimalNumber === null) {
            if (sign !== null) {
                marker.position -= sign.length;
            }

            return null;
        }
        else {
            if (sign === null) {
                return {
                    "type": "signedDecimalNumber",
                    "text": decimalNumber.text,
                    "start": decimalNumber.start,
                    "end": decimalNumber.end,
                    "length": decimalNumber.length,
                    "numberOfLeadingZeros": decimalNumber.numberOfLeadingZeros,
                    "minimumNumberOfSignificantFigures": decimalNumber.minimumNumberOfSignificantFigures,
                    "maximumNumberOfSignificantFigures": decimalNumber.maximumNumberOfSignificantFigures,
                    "sign": "positive",
                    "signIsExplicit": false
                };
            }
            else {
                var s = (sign.name == "plus") ? "positive" : "negative";

                return {
                    "type": "signedDecimalNumber",
                    "text": sign.text + decimalNumber.text,
                    "start": sign.start,
                    "end": decimalNumber.end,
                    "length": sign.length + decimalNumber.length,
                    "numberOfLeadingZeros": decimalNumber.numberOfLeadingZeros,
                    "minimumNumberOfSignificantFigures": decimalNumber.minimumNumberOfSignificantFigures,
                    "maximumNumberOfSignificantFigures": decimalNumber.maximumNumberOfSignificantFigures,
                    "sign": s,
                    "signIsExplicit": true
                };
            }
        }
    }

    parseSignedInteger(inputText, marker) {
        var sign = this.parseSign(inputText, marker);
        var integer = this.parseInteger(inputText, marker);

        if (integer === null) {
            if (sign !== null) {
                marker.position -= sign.length;
            }

            return null;
        }
        else {
            if (sign === null) {
                return {
                    "type": "signedInteger",
                    "text": integer.text,
                    "start": integer.start,
                    "end": integer.end,
                    "length": integer.length,
                    "numberOfLeadingZeros": integer.numberOfLeadingZeros,
                    "minimumNumberOfSignificantFigures": integer.minimumNumberOfSignificantFigures,
                    "maximumNumberOfSignificantFigures": integer.maximumNumberOfSignificantFigures,
                    "sign": "positive",
                    "signIsExplicit": false
                };
            }
            else {
                var s = (sign.name == "plus") ? "positive" : "negative";

                return {
                    "type": "signedInteger",
                    "text": sign.text + integer.text,
                    "start": sign.start,
                    "end": integer.end,
                    "length": sign.length + integer.length,
                    "numberOfLeadingZeros": integer.numberOfLeadingZeros,
                    "minimumNumberOfSignificantFigures": integer.minimumNumberOfSignificantFigures,
                    "maximumNumberOfSignificantFigures": integer.maximumNumberOfSignificantFigures,
                    "sign": s,
                    "signIsExplicit": true
                };
            }
        }
    }

    parseSign(inputText, marker) {
        var c = inputText.substr(marker.position, 1);

        if (c == "+") {
            marker.position += 1;

            return {
                "type": "sign",
                "name": "plus",
                "text": c,
                "start": marker.position - 1,
                "end": marker.position,
                "length": 1,
            }
        }
        else if (c == "-") {
            marker.position += 1;

            return {
                "type": "sign",
                "name": "minus",
                "text": c,
                "start": marker.position - 1,
                "end": marker.position,
                "length": 1,
            }
        }
        else {
            return null;
        }
    }

    parseDecimalNumber(inputText, marker) {
        var t = "";
        var start = marker.position;

        var ndp = 0;

        while (marker.position < inputText.length) {
            var c = inputText.substr(marker.position, 1);

            if (isAnyOf("0123456789", c)) {
                t += c;
                marker.position += 1;
            }
            else if (c == ".") {
                if (ndp == 0) {
                    t += c;
                    marker.position += 1;
                    ndp++;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }

        var end = marker.position;

        if (t == "") {
            return null;
        }
        else {
            return {
                "type": "decimalNumber",
                "text": t,
                "start": start,
                "end": end,
                "length": t.length,
                "numberOfLeadingZeros": null,
                "minimumNumberOfSignificantFigures": null,
                "maximumNumberOfSignificantFigures": null
            };
        }
    }

    parseInteger(inputText, marker) {
        var t = "";
        var start = marker.position;

        while (marker.position < inputText.length) {
            var c = inputText.substr(marker.position, 1);

            if (isAnyOf("0123456789", c)) {
                t += c;
                marker.position += 1;
            }
            else {
                break;
            }
        }

        var end = marker.position;
        var n = 0;
        var m = 0;
        var p = 0;

        for (var i = 0; i < t.length; i++) {
            var c = t.substr(i, 1);

            if (c == "0" && m == 0) {
                n++;
            }
            else if (c != "0") {
                m += p;
                p = 0;
                m++;

            }
            else if (c == "0" && m > 0) {
                p++;
            }
        }

        if (t == "") {
            return null;
        }
        else {
            return {
                "type": "integer",
                "text": t,
                "start": start,
                "end": end,
                "length": t.length,
                "numberOfLeadingZeros": n,
                "minimumNumberOfSignificantFigures": m,
                "maximumNumberOfSignificantFigures": m + p
            };
        }
    }

    parseWhiteSpace(inputText, marker) {
        var t = "";
        var start = marker.position;

        while (marker.position < inputText.length) {
            var c = inputText.substr(marker.position, 1);

            if (isAnyOf(" \t\n", c)) {
                t += c;
                marker.position += 1;
            }
            else {
                break;
            }
        }

        var end = marker.position;

        if (t == "") {
            return null;
        }
        else {
            return {
                "type": "whiteSpace",
                "text": t,
                "start": start,
                "end": end,
                "length": t.length,
                "compressedWhiteSpace": " "
            };
        }
    }
}

class Validator {
    constructor() {
        this.inputs = [];

        this.rp = new ResponseParser();
    }

    addInput(input, inputType, validationMessageElement) {
        this.inputs.push([input, inputType, validationMessageElement]);

        var that = this;

        input.onkeydown = function (e) {
            if (e.code != "Backspace") {
                var t = input.value + e.key;
                var parseResult = that.rp.getParseResult(t);

                console.log(t);
                console.log(parseResult);

                if (parseResult === null) {
                    e.preventDefault();
                    return;
                }

                if (inputType == "integer" && (parseResult.type != "signedInteger" && parseResult.type != "sign")) {
                    e.preventDefault();
                }
            }
        }
    }
}

var validator = new Validator();

window.addEventListener("load", function () {
    var i1 = document.getElementById("input1");
    var o1 = document.getElementById("validationMessage1");

    var i2 = document.getElementById("input2");
    var o2 = document.getElementById("validationMessage1");

    validator.addInput(i1, "integer", o1);
    validator.addInput(i2, "decimalNumber", o2);
});