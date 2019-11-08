
// A useful function to have in any parser - checks if any of the characters in a string are the given character.
function isAnyOf(characters, character) {
    return (characters.split("").filter(c => c == character).length > 0);
}

// A marker object for keeping track of the position in a string that the parser is looking at.
// Can also be extended to track line numbers and line positions.
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
        var c = inputText.charAt(marker.position);

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

        return null;
   }

    // Determine if there is a decimal number at the current position.
    parseDecimalNumber(inputText, marker) {
        var t = "";
        var start = marker.position;

        var ndp = 0; // The number of decimal points. Only one is allowed.

        // Loop over the characters in the string after the current position.
        while (marker.position < inputText.length) {
            // Get the character at the current position.
            var c = inputText.charAt(marker.position);

            if (isAnyOf("0123456789", c)) {
                // If the current character is any of the digits 0-9, add it to the temporary string.
                t += c;
                marker.position += 1;
            }
            else if (c == ".") {
                if (ndp == 0) {
                    // If the current character is a decimal point, and no decimal points have been seen so far, add it to the temporary string.
                    t += c;
                    marker.position += 1;
                    // Increase the decimal point counter by 1.
                    ndp++;
                }
                else {
                    // If the current character is a decimal point, but one decimal point has already been seen, then break out of the loop.
                    break;
                }
            }
            else {
                // If the current character is not 0-9 or a decimal point, break out of the loop.
                break;
            }
        }

        var end = marker.position;

        if (t == "") {
            // If no decimal was seen, return nothing.
            return null;
        }
        else {
            // If a decimal was seen, return details about it.
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

    // Determine if there is an integer at the current position.
    parseInteger(inputText, marker) {
        var t = "";
        var start = marker.position;

        // Loop over the characters in the string after the current position.
        while (marker.position < inputText.length) {
            // Get the character at the current position.
            var c = inputText.charAt(marker.position);

            if (isAnyOf("0123456789", c)) {
                // This is an unsigned integer, so it can only consist of the digits 0-9 and nothing else.
                t += c;
                marker.position += 1;
            }
            else {
                // If it isn't any of those characters, then it isn't an integer, so don't look any further.
                break;
            }
        }

        var end = marker.position;
        var n = 0; // The number of leading zeros.
        var m = 0; // The number of significant figures.
        var p = 0; // A counter for any zeros that may or may not be significant digits.

        // Loop over the digits to find the number of leading zeros and the number of significant figures.
        for (var i = 0; i < t.length; i++) {
            // Get the character at the current position.
            var c = t.charAt(i);

            if (c == "0" && m == 0) {
                // If the character is zero, and no significant digits have been seen so far, then it must be a leading zero.
                n++;
            }
            else if (c != "0") {
                // If the character is not zero, then it must be a significant digit.
                // Add any zeros that appeared before the current character (as those must now also be significant digits).
                m += p;
                // Reset the counter.
                p = 0;
                // Add one to the s.f. counter for the current digit.
                m++;

            }
            else if (c == "0" && m > 0) {
                // Any zero that is seen after the first significant digit may also be a significant digit, so add to this counter.
                p++;
            }
        }

        if (t == "") {
            // If no integer was seen, return nothing.
            return null;
        }
        else {
            // If an integer was seen, return details about it.
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

    // Determine if there is any white space at the current position.
    parseWhiteSpace(inputText, marker) {
        var t = "";
        var start = marker.position;

        // Look through the string until the end of the string.
        while (marker.position < inputText.length) {
            // Get the character at the current position.
            var c = inputText.charAt(marker.position);

            if (isAnyOf(" \t\n", c)) {
                // If the current character is white space, add it to the buffer variable.
                t += c;
                marker.position += 1;
            }
            else {
                // If it's not white space, break.
                break;
            }
        }

        var end = marker.position;

        if (t == "") {
            // If there was no white space, return nothing.
            return null;
        }
        else {
            // If there was white space, return an object giving the properties of the white space.
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

// Handles the actual on-page events and the validation messages.
class Validator {
    constructor() {
        this.inputs = [];

        // Create an instance of ResponseParser.
        this.rp = new ResponseParser();

        // None of these keys can add a character into a single-line text input, so we don't need to check any of them on the keydown event.
        this.controlKeys = [
            "ShiftLeft",
            "ShiftRight",
            "Backspace",
            "Enter",
            "Tab",
            "CapsLock",
            "MetaLeft",
            "MetaRight",
            "AltLeft",
            "AltRight",
            "ControlLeft",
            "ControlRight",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Escape"];
    }

    // Gets what the new value of a text input would be if a keydown event were allowed to proceed.
    getNewInputValueOnKeyDown(input, e) {
        var length = input.value.length;

        if (input.selectionStart == length && input.selectionEnd == length) {
            return input.value + e.key;
        }
        else {
            return input.value.slice(0, input.selectionStart) + e.key + input.value.slice(input.selectionEnd, length);
        }
    }

    // Inputs that are to be checked by the validator can be added using this function.
    addInput(input, inputType, validationMessageElement, submitButton) {
        this.inputs.push([input, inputType, validationMessageElement, submitButton]);

        var that = this;

        // A check is performed whenever the user tries to type another character into the input.
        input.onkeydown = function (e) {
            // If the key that's pressed is one of the control keys, ignore the event.
            if (that.controlKeys.filter(ck => e.code == ck).length == 0) {
                // Get what the new value of the input will be.
                var t = that.getNewInputValueOnKeyDown(input, e);
                // Parse the value to see what it is.
                var parseResult = that.rp.getParseResult(t);

                console.log(t);
                console.log(parseResult);

                validationMessageElement.innerText = "";

                if (parseResult === null) {
                    e.preventDefault();
                    return;
                }

                  // If the user is supposed to type an integer, but they haven't typed either an integer or just a sign, then prevent them from entering this character.
                if (inputType == "integer" && (parseResult.type != "signedInteger" && parseResult.type != "sign")) {
                    e.preventDefault();
                }
            }
        }

        // A second check has to be performed on submit.
        submitButton.onmousedown = function (e) {
            // Get the value of the input.
            var t = input.value;
            // Parse the value to see what it is.
            var parseResult = that.rp.getParseResult(t);

            console.log(t);
            console.log(parseResult);

            validationMessageElement.innerText = "";

            if (parseResult === null) {
                return;
            }

            // If the answer is supposed to be an integer, but it's not, then give a validation message.
            if (inputType == "integer" && parseResult.type != "signedInteger") {
                validationMessageElement.innerText = "Your answer must be a whole number.";
            }

            // If the answer is supposed to be a decimal, but it's not, then give a validation message.
            if (inputType == "decimalNumber" && (parseResult.type != "signedInteger" && parseResult.type != "signedDecimalNumber")) {
                validationMessageElement.innerText = "Your answer must be a decimal number or a whole number.";
            }
        }
    }
}

var validator = new Validator();

window.addEventListener("load", function () {
    var i1 = document.getElementById("input1");
    var o1 = document.getElementById("validationMessage1");
    var sb1 = document.getElementById("submitButton1");

    var i2 = document.getElementById("input2");
    var o2 = document.getElementById("validationMessage2");
    var sb2 = document.getElementById("submitButton2");

    validator.addInput(i1, "integer", o1, sb1);
    validator.addInput(i2, "decimalNumber", o2, sb2);
});