
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

    copy() {
        var marker = new Marker();

        marker.position = this.position;

        return marker;
    }
}

class ParserSettings {
    constructor() {
        this.removeLeadingZerosFromSimplifiedForms = false;
        this.addLeadingZeroToDecimalsForSimplifiedForms = true;
    }
}

// Handles the process of scanning through a string to see what types of mathematical expression are in it.
// At the moment, this could just be done using regular expressions.
// However, regular expressions couldn't be used for more complicated mathematical expressions, which is why this design pattern is used.
// This design pattern can also return lots of other interesting information about what the user types, such as number of significant figures.
class ResponseParser {

    constructor() {
        this.settings = new ParserSettings();
    }

    // The top-level parse function (for now).
    getParseResult(inputText) {
        var m1 = new Marker();

        var expression = this.parseExpression(inputText, m1);

        if (expression !== null && m1.position == inputText.length) {
            expression.setDepth();
            return expression;
        }

        // If nothing is found, return nothing.
        return null;
    }

    // A useful function for checking if any of a set of words appears at the given position in a string.
    anyAt(words, inputText, marker) {
        for (var i = 0; i < words.length; i++) {
            var w = words[i];

            if (inputText.substring(marker.position, marker.position + w.length) == w) {
                return w;
            }
        }

        return false;
    }

    parseExpression(inputText, marker) {

        var operandStack = [];
        var operatorStack = [];

        while (marker.position < inputText.length) {

            var node = this.parseMixedFraction(inputText, marker.copy());

            if (node === null) { node = this.parseFraction(inputText, marker.copy()); }
            if (node === null) { node = this.parseSquareRoot(inputText, marker.copy()); }
            if (node === null) { node = this.parseNumber(inputText, marker.copy()); }
            if (node === null) { node = this.parseBinomialOperator(inputText, marker.copy()); }
            if (node === null) { node = this.parseIdentifier(inputText, marker.copy()); }
            if (node === null) { break; }

            if (node.type == "binomialOperator") {

                for (var i = operatorStack.length - 1; i >= 0; i--) {
                    if (operatorStack[i].precedence >= node.precedence) {
                        if (operandStack.length >= 2 && operatorStack[i].text == "+") {
                            var additionNode = new RPAdditionNode();

                            additionNode.operand2 = operandStack.pop();
                            additionNode.operand1 = operandStack.pop();

                            operandStack.push(additionNode);
                        }
                    }
                }
                operatorStack.push(node);
            }
            else {
                operandStack.push(node);
            }
        }

        for (var i = operatorStack.length - 1; i >= 0; i--) {

            if (operandStack.length >= 2 && operatorStack[i].text == "+") {
                var additionNode = new RPAdditionNode();

                additionNode.operand2 = operandStack.pop();
                additionNode.operand1 = operandStack.pop();

                operandStack.push(additionNode);
            }
        }

        if (operandStack.length == 1) {
            return operandStack[0];
        }
        else {
            return null;
        }
    }

    parseBinomialOperator(inputText, marker) {
        var start = marker.position;

        var c = inputText.charAt(marker.position);

        if (!isAnyOf("+-*/^", c)) {
            return;
        }

        marker.position++;

        var end = marker.position;

        var node = new RPOperatorNode();

        node.text = c;
        node.latex = (c == "*") ? "\\times" : c;
        node.asciiMath = c;
        node.start = start;
        node.end = end;

        return node;
    }

    parseIdentifier(inputText, marker) {
        var start = marker.position;

        var c = inputText.charAt(marker.position);

        if (!isAnyOf("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", c)) {
            return;
        }

        marker.position++;

        var end = marker.position;

        var node = new RPIdentifierNode();

        node.text = c;
        node.latex = c;
        node.asciiMath = c;
        node.start = start;
        node.end = end;

        return node;
    }

    // Determine if there is a square root at the current position.
    parseSquareRoot(inputText, marker) {
        var start = marker.position;

        // We want to allow several possible ways of allowing inputting square roots, so that the student doesn't have to remember a particular syntax in order to write a square root.
        var functionNames = ["sqrt", "squareroot", "root"];

        // See if any of the allowed function names are at the current position.
        var name = this.anyAt(functionNames, inputText, marker);

        // If not, then there is no square root here, so return nothing.
        if (name === false) {
            return null;
        }

        // If there is, then move the marker along by the length of the name.
        marker.position += name.length;

        // Allow optional white space here.
        var ws1 = this.parseWhiteSpace(inputText, marker);

        // In this linear syntax, square roots must have brackets to show what the square root applies to.
        if (inputText.charAt(marker.position) != "(") {
            return null;
        }

        marker.position += 1;

        // Allow optional white space here.
        var ws2 = this.parseWhiteSpace(inputText, marker);
        // Only numbers are allowed within square roots at the moment.
        var number = this.parseNumber(inputText, marker);
        // Allow optional white space here.
        var ws3 = this.parseWhiteSpace(inputText, marker);

        // Expect closing bracket.
        if (inputText.charAt(marker.position) != ")") {
            return null;
        }

        marker.position += 1;

        var end = marker.position;

        var t1 = name;
        var t2 = (ws1 !== null) ? ws1.text : "";
        var t3 = "(";
        var t4 = (ws2 !== null) ? ws2.text : "";
        var t5 = number.text;
        var t6 = (ws3 !== null) ? ws3.text : "";
        var t7 = ")";

        var node = new RPRadicalNode();

        node.text = t1 + t2 + t3 + t4 + t5 + t6 + t7;
        node.latex = "\\sqrt{" + number.latex + "}";
        node.asciiMath = "sqrt(" + number.asciiMath + ")";
        node.start = start;
        node.end = end;
        node.radix = 2;
        node.radixIsImplicit = true;
        node.radicand = number;

        return node;
    }

    parseMixedFraction(inputText, marker) {
        var start = marker.position;

        var wholePart = this.parseNumber(inputText, marker);
        if (wholePart === null) { return null; }

        var whiteSpace = this.parseWhiteSpace(inputText, marker);
        if (whiteSpace === null) { return null; }

        var fractionPart = this.parseFraction(inputText, marker);
        if (fractionPart === null) { return null; }

        var end = marker.position;

        var node = new RPMixedFractionNode();

        node.text = wholePart.text + whiteSpace.text + fractionPart.text;
        node.latex = wholePart.latex + " " + fractionPart.latex;
        node.asciiMath = wholePart.asciiMath + " " + fractionPart.asciiMath;
        node.start = start;
        node.end = end;
        node.wholePart = wholePart;
        node.fractionPart = fractionPart;

        return node;
    }

    // Determine if there is a fraction at the current position.
    parseFraction(inputText, marker) {
        var start = marker.position;

        // First see if there is a number for the numerator.
        var numerator = this.parseNumber(inputText, marker);

        // If there is no numerator, there is no fraction, so return nothing.
        if (numerator === null) {
            return null;
        }

        // Check for white space - white space is allowed here.
        var whiteSpace1 = this.parseWhiteSpace(inputText, marker);

        // Get the character at the current position.
        var c = inputText.charAt(marker.position);

        // If the current character isn't a forward slash, then it isn't a fraction.
        if (c !== "/") {
            return null;
        }

        marker.position += 1;

        // Check for more white space again.
        var whiteSpace2 = this.parseWhiteSpace(inputText, marker);
        // Look for a denominator.
        var denominator = this.parseNumber(inputText, marker);
        var end = marker.position;

        // If there was no denominator, then it is a fraction, but not a complete one.
        var isComplete = (denominator === null) ? false : true;

        var t1 = numerator.text;
        var t2 = (whiteSpace1 === null) ? "" : whiteSpace1.text;
        var t3 = "/";
        var t4 = (whiteSpace2 === null) ? "" : whiteSpace2.text;
        var t5 = (denominator === null) ? "" : denominator.text;

        // The simplest form of the fraction is just the simplest form of the numerator and the denominator with a solidus in between.
        var t6 = numerator.simplestForm;
        var t7 = "/";
        var t8 = (denominator === null) ? "" : denominator.simplestForm;

        var node = new RPFractionNode();

        node.text = t1 + t2 + t3 + t4 + t5;
        node.latex = "\\frac{" + numerator.latex + "}{" + denominator.latex + "}";
        node.asciiMath = "frac " + numerator.asciiMath + " " + denominator.asciiMath;
        node.start = start;
        node.end = end;
        node.isComplete = isComplete;
        node.numerator = numerator;
        node.denominator = denominator;

        return node;
    }

    // Determine if there is a number (either an integer or a decimal) at the current position.
    parseNumber(inputText, marker) {
        var t = "";
        var start = marker.position;

        var integralPart = "";
        var decimalPart = "";

        var ts = "";
        var sign = "positive";
        var signIsExplicit = false;

        // The number may start with a plus or a minus sign.
        // Get the character at the current position.
        var d = inputText.charAt(marker.position);

        // Check if the character is either a plus or a minus sign.
        // If it is, record this, and then move the marker on by 1.
        if (d == "+") {
            ts = "+";
            signIsExplicit = true;
            marker.position++;
        }
        else if (d == "-") {
            ts = "-";
            sign = "negative";
            signIsExplicit = true;
            marker.position++;
        }

        // Set-up some counter variables - this is often the best way to get information like the number of significant figures that a number has.
        var nlz = 0; // The number of leading zeros.
        var ntz = 0; // The number of trailing zeros.
        var nsf = 0; // The number of significant figures.
        var ndp = 0; // The number of decimal places.

        var p = 0; // A counter for any zeros that may or may not be significant digits.
        var q = 0; // A counter for the number of decimal points seen so far.

        // Loop over the characters in the string.
        while (marker.position < inputText.length) {
            // Get the character at the current position.
            var c = inputText.charAt(marker.position);

            if (isAnyOf("0123456789", c)) {
                // If the current character is any of 0123456789, then it's a number character, so add it to the substring.
                t += c;
                marker.position++;

                // If the decimal point has been seen, add the character to the decimal part.
                // Otherwise, add the character to the integral part.
                // Also, each digit seen after the decimal point should increase the decimal places counter.
                if (q == 0) {
                    integralPart += c;
                } else {
                    decimalPart += c;
                    ndp++;
                }

                if (c == "0" && nsf == 0 && q == 0) {
                    // If the current digit is 0, and no non-zero digits have been seen so far, or the decimal point, then it's a leading zero.
                    nlz++;
                }
                else if (c != "0") {
                    // If the current digit is not a 0, then it's a significant digit, so increase the significant digits counter by 1.
                    // Also, any zeros that have been seen since the last non-zero significant digit are also significant digits.
                    nsf += p;
                    p = 0;
                    nsf++;
                }
                else if (c == "0" && nsf > 0) {
                    // If the current digit is 0, and 1 or more significant digits have been seen so far, then this zero may be a significant digit, so increase this counter by one.
                    p++;
                }
            }
            else if (c == ".") {
                if (q == 0) {
                    // If the current character is a full-stop, it's a decimal point, so increase the decimal points counter by 1.
                    t += c;
                    marker.position++;

                    decimalPart += c;

                    q++;
                }
                else {
                    // If a second decimal point is seen, break the loop.
                    break;
                }
            }
            else {
                // If the character isn't in 0123456789., then break the loop.
                break;
            }
        }

        var allZero = (nsf == 0 && t.length > 0) ? true : false; // Whether or not all of the digits given were zero.

        if (allZero) {
            sign = "zero";
        }

        var minimumNSF = 0;
        var maximumNSF = 0;

        if (allZero) {
            // If all of the digits in the given number are zero, can only assume that the final zero is a significant digit.

            minimumNSF = 1;
            maximumNSF = 1;
            if (q > 0) {
                ntz = ndp;
            }
        }
        else {
            // Otherwise at least one non-zero digit has been given.
            if (q > 0) {
                // For a decimal number, all of the digits to the end of the decimal part are significant digits, even if they're zeros.
                minimumNSF = nsf + p;
                maximumNSF = nsf + p;

                // The number of trailing zeros is equal to the counter p.
                ntz = p;
            }
            else {
                // For an integer, any zeros at the end of the number may or may not be significant digits, so set the minimum and maximum to be different.
                minimumNSF = nsf;
                maximumNSF = nsf + p;
            }
        }

        var end = marker.position;

        // If there was a decimal point, then the number was a decimal.
        var subtype = (q == 0) ? "integer" : "decimalNumber";

        // Remove any leading zeros for the simplest form of the number.
        // Except if the number is a decimal, in which case there should be one leading zero.
        var t1 = "";

        if (integralPart == "" && (decimalPart == "" || decimalPart == ".")) {
            // If essentially nothing has been written, write nothing for the integral part.
            t1 = "";
        }
        else if (integralPart == "") {
            // If the number is just something like .123, then it should be written 0.123
            if (this.settings.addLeadingZeroToDecimalsForSimplifiedForms) {
                t1 = "0";
            }
            else {
                t1 = "";
            }
        }
        else {
            // Otherwise just remove the leading zeros.
            if (this.settings.removeLeadingZerosFromSimplifiedForms) {
                t1 = integralPart.slice(nlz);
                if (this.settings.addLeadingZeroToDecimalsForSimplifiedForms) {
                    t1 = (t1 == "") ? "0" : t1;
                }
            }
            else {
                t1 = integralPart;
            }
        }

        // If the decimal part consists of just a decimal point and no digits, remove the decimal point for the simplest form.
        var t2 = (decimalPart == ".") ? "" : decimalPart;
        var simplestForm = (allZero) ? t1 + t2 : ts + t1 + t2;

        if (ts + t == "") {
            // If no number was seen, return nothing.
            return null;
        }
        else {
            // If a number was seen, return information about it.
            var node = new RPNumberNode();

            node.subtype = subtype;
            node.text = ts + t;
            node.integralPart = integralPart;
            node.decimalPart = decimalPart;
            node.latex = simplestForm;
            node.asciiMath = simplestForm;
            node.start = start;
            node.end = end;
            node.sign = sign;
            node.signIsExplicit = signIsExplicit;
            node.numberOfLeadingZeros = nlz;
            node.numberOfTrailingZeros = ntz;
            node.minimumNumberOfSignificantFigures = minimumNSF;
            node.maximumNumberOfSignificantFigures = maximumNSF;
            node.numberOfDecimalPlaces = ndp;

            return node;
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
                "latex": t,
                "asciiMath": t,
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
    addInput(input, inputType, katexOutput, validationMessageElement, submitButton) {
        this.inputs.push([input, inputType, katexOutput, validationMessageElement, submitButton]);

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

                if (parseResult === null) {
                    e.preventDefault();
                    return;
                }

                if (inputType == "integer" && (parseResult.type != "number" || parseResult.subtype != "integer")) {
                    e.preventDefault();
                }

                if (inputType == "decimalNumber" && parseResult.type != "number") {
                    e.preventDefault();
                }

                if (inputType == "fraction" && (parseResult.type != "fraction" && parseResult.type != "number")) {
                    e.preventDefault();
                }

                if (parseResult !== null) {
                    katex.render(parseResult.latex, katexOutput);
                }
                else {
                    katex.render("", katexOutput);
                }
            }
        }

        input.onkeyup = function (e) {

            validationMessageElement.innerText = "";

            var parseResult = that.rp.getParseResult(input.value);

            if (parseResult !== null) {
                katex.render(parseResult.latex, katexOutput);
            }
            else {
                katex.render("", katexOutput);
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

            // If the answer is supposed to be an integer, but it's not, then give a validation message.
            if (inputType == "integer" && (parseResult === null || (parseResult.type != "number" && parseResult.subtype == "integer"))) {
                validationMessageElement.innerText = "Your answer must be a whole number.";
            }

            // If the answer is supposed to be a decimal, but it's not, then give a validation message.
            if (inputType == "decimalNumber" && (parseResult === null || parseResult.type != "number")) {
                validationMessageElement.innerText = "Your answer must be a decimal number or a whole number.";
            }
        }
    }
}