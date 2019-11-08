
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

// Handles the process of scanning through a string to see what types of mathematical expression are in it.
// At the moment, this could just be done using regular expressions.
// However, regular expressions couldn't be used for more complicated mathematical expressions, which is why this design pattern is used.
// This design pattern can also return lots of other interesting information about what the user types, such as number of significant figures.
class ResponseParser {

    // The top-level parse function (for now).
    getParseResult(inputText) {
        var m1 = new Marker();
        var m2 = new Marker();

        var fraction = this.parseFraction(inputText, m1);
        var number = this.parseNumber(inputText, m2);

        // If there is any of those things, return it (as long as there isn't anything else in the string).
        if (fraction !== null && m1.position == inputText.length) {
            return fraction;
        }
        else if (number !== null && m2.position == inputText.length) {
            return number;
        }

        // If nothing is found, return nothing.
        return null;
    }

    parseFraction(inputText, marker) {
        var start = marker.position;

        var numerator = this.parseNumber(inputText, marker);

        if (numerator === null) {
            return null;
        }

        var whiteSpace1 = this.parseWhiteSpace(inputText, marker);

        var c = inputText.charAt(marker.position);

        if (c !== "/") {
            return null;
        }

        marker.position += 1;

        var whiteSpace2 = this.parseWhiteSpace(inputText, marker);
        var denominator = this.parseNumber(inputText, marker);
        var end = marker.position;

        var isComplete = (denominator === null) ? false : true;

        var t1 = numerator.text;
        var t2 = (whiteSpace1 === null) ? "" : whiteSpace1.text;
        var t3 = "/";
        var t4 = (whiteSpace2 === null) ? "" : whiteSpace2.text;
        var t5 = (denominator === null) ? "" : denominator.text;

        var t6 = numerator.simplestForm;
        var t7 = "/";
        var t8 = (denominator === null) ? "" : denominator.simplestForm;

        return {
            "type": "fraction",
            "text": t1 + t2 + t3 + t4 + t5,
            "simplestForm": t6 + t7 + t8,
            "start": start,
            "end": end,
            "length": end - start,
            "isComplete": isComplete,
            "numerator": numerator,
            "denominator": denominator
        }
    }

    parseNumber(inputText, marker) {
        var t = "";
        var start = marker.position;

            var integralPart ="";
              var decimalPart = "";
            
            var ts= "";
        var sign = "positive";
        var signIsExplicit = false;

        var d = inputText.charAt(marker.position);

        if (d == "+") {
           ts= "+";
            signIsExplicit = true;
            marker.position++;
        }
        else if (d == "-") {
           ts= "-";
            sign = "negative";
            signIsExplicit = true;
            marker.position++;
        }

        var nlz = 0; // The number of leading zeros.
        var ntz = 0; // The number of trailing zeros.
        var nsf = 0; // The number of significant figures.
        var ndp = 0; // The number of decimal places.

        var p = 0; // A counter for any zeros that may or may not be significant digits.
        var q = 0; // A counter for the number of decimal points seen so far.

        while (marker.position < inputText.length) {
            var c = inputText.charAt(marker.position);

            if (isAnyOf("0123456789", c)) {
                t += c;
                marker.position++;

                if (q == 0) {
                                  integralPart += c;
                } else{
                      decimalPart += c;
                    ndp++;
                }

                if (c == "0" && nsf == 0 && q == 0) {
                    nlz++;
                }
                else if (c != "0") {
                    nsf += p;
                    p = 0;
                    nsf++;
                }
                else if (c == "0" && nsf > 0) {
                    p++;
                }
            }
            else if (c == ".") {
                if (q == 0) {
                    t += c;
                    marker.position++;

                    decimalPart += c;

                    q++;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }

        if (q > 0) {
            nsf += p;
            ntz = p;
            p = 0;
        }

        var end = marker.position;

                                 var subtype = (q == 0)? "integer": "decimalNumber";
                                 
                                    var t1 = (integralPart.length == "")?"0": integralPart.slice(nlz);
                                      var t2 = (decimalPart == ".")? "": decimalPart;
                                    var simplestForm = ts + t1 + t2;
                                 
                                 if (t == "") {
            return null;
        }
        else {
            return {
                "type":  "number",
                "subtype": subtype,
                "text": ts + t,
                     "integralPart": integralPart,
                     "decimalPart": decimalPart,
                "simplestForm":   simplestForm,
                "start": start,
                "end": end,
                "length": end - start,
                "sign": sign,
                "signIsExplicit": signIsExplicit,
                "numberOfLeadingZeros": nlz,
                "numberOfTrailingZeros": ntz,
                "minimumNumberOfSignificantFigures": nsf,
                "maximumNumberOfSignificantFigures": nsf,
                "numberOfDecimalPlaces": ndp
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

                if (inputType == "integer" && (parseResult.type != "number" && parseResult.subtype == "integer")) {
                    e.preventDefault();
                }

                if (inputType == "decimalNumber" && parseResult.type != "number") {
                    e.preventDefault();
                }

                if (inputType == "fraction" && parseResult.type != "fraction") {
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
            if (inputType == "integer" && (parseResult.type != "number" && parseResult.subtype == "integer")) {
                validationMessageElement.innerText = "Your answer must be a whole number.";
            }

            // If the answer is supposed to be a decimal, but it's not, then give a validation message.
            if (inputType == "decimalNumber" && parseResult.type != "number") {
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

    var i3 = document.getElementById("input3");
    var o3 = document.getElementById("validationMessage3");
    var sb3 = document.getElementById("submitButton3");

    validator.addInput(i1, "integer", o1, sb1);
    validator.addInput(i2, "decimalNumber", o2, sb2);
    validator.addInput(i3, "fraction", o3, sb3);
});