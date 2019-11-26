(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  

     var nodes = require("./rpnodes.js");

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
        this.simplifier = new nodes.Simplifier();
    }

    // The top-level parse function (for now).
    getParseResult(inputText) {
        var m1 = new Marker();

        var expression = this.parseExpression(inputText, m1);

        if (expression !== null && m1.position == inputText.length) {
            expression = this.simplifier.simplifyNode(expression);
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
        var lastNode;

        while (marker.position < inputText.length) {

            var node = this.parseBinomialOperator(inputText, marker.copy());;

            if (node === null) { node = this.parseBracketedExpression(inputText, marker.copy()) }
            if (node === null) { node = this.parseFactorial(inputText, marker.copy()) }
            if (node === null) { node = this.parseMixedFraction(inputText, marker.copy()) }
            if (node === null) { node = this.parseFraction(inputText, marker.copy()); }
            if (node === null) { node = this.parseNamedFunction(inputText, marker.copy()); }
            if (node === null) { node = this.parseSquareRoot(inputText, marker.copy()); }
            if (node === null) { node = this.parseNumber(inputText, marker.copy()); }
            if (node === null) { node = this.parseIdentifier(inputText, marker.copy()); }
            if (node === null) { node = this.parseWhiteSpace(inputText, marker.copy()); }
            if (node === null) { break; }

            if (node.type == "operator" || node.type == "namedFunction") {
                this._applyOperators(operandStack, operatorStack, node);

                operatorStack.push(node);
            }
            else if (node.type == "whiteSpace") {
            }
            else {
                if (lastNode !== undefined && lastNode.type != "operator" && lastNode.type != "namedFunction") {
                    var implicitTimes = new nodes.RPOperatorNode();

                    implicitTimes._text = "*";
                    implicitTimes.isImplicit = true;

                    operatorStack.push(implicitTimes);
                }

                operandStack.push(node);
            }

            marker.position += node.length;

            if (node.type != "whiteSpace") {
                lastNode = node;
            }
        }

        this._applyOperators(operandStack, operatorStack, null);

        if (operandStack.length == 1) {
            return operandStack[0];
        }

        return null;
    }

    _applyOperators(operandStack, operatorStack, nextOperator) {
        for (var i = operatorStack.length - 1; i >= 0; i--) {
            if (nextOperator === null || operatorStack[i].precedence >= nextOperator.precedence) {
                if (operandStack.length >= 1) {
                    var operator = operatorStack.pop();

                    var node;
                    if (operandStack.length >= 2 && operator.type == "operator") {

                        if (operator.text == "+") { node = new nodes.RPAdditionNode(); }
                        if (operator.text == "-") { node = new nodes.RPSubtractionNode(); }
                        if (operator.text == "*") { node = new nodes.RPMultiplicationNode(); }
                        if (operator.text == "/") { node = new nodes.RPDivisionNode(); }
                        if (operator.text == "^") { node = new nodes.RPExponentiationNode(); }

                        node.operand2 = operandStack.pop();
                        node.operand1 = operandStack.pop();

                        if (operator.text == "*" && operator.isImplicit) {
                            node.isImplicit = true;
                            node._text = node.operand1.text + node.operand2.text;
                        }
                        else {
                            node._text = node.operand1.text + operator.text + node.operand2.text;
                        }

                        operandStack.push(node);
                    }
                    else if (operandStack.length >= 1 && operator.type == "operator") {
                        if (operator.text == "!") { node = new nodes.RPFactorialNode(); }

                        var operand = operandStack.pop();

                        node.operand = operand;
                        node._text = operand.text + operator.text;

                        operandStack.push(node);
                    }
                    else if (operandStack.length >= 1 && operator.type == "namedFunction") {
                        node = operator;
                        var operand = operandStack.pop();

                        node.parameters.push(operand);
                        node._text += operand.text;

                        operandStack.push(node);
                    }
                }
            }
            else {
                break;
            }
        }
    }

    parseFactorial(inputText, marker) {
        var start = marker.position;

        if (inputText.charAt(marker.position) != "!") { return null; }

        marker.position++;

        var end = marker.position;

        var node = new nodes.RPOperatorNode();

        node.start = start;
        node.end = end;
        node._text = "!";

        node.value = "!";

        return node;
    }

    parseBracketedExpression(inputText, marker) {
        var start = marker.position;

        if (inputText.charAt(marker.position) != "(") { return null; }

        marker.position++;

        var n = 1;
        var t = "";

        while (marker.position < inputText.length && n > 0) {
            var c = inputText.charAt(marker.position);
            t += c;

            if (c == "(") {
                n++;
            }
            else if (c == ")") {
                n--;
            }

            marker.position++;
        }

        var end = marker.position;

        var node = new nodes.RPBracketedExpressionNode();

        node.start = start;
        node.end = end;
        node._text = t;

        if (end - start >= 2) {
            var innerText = inputText.substring(start + 1, end - 1);
            var innerExpression = this.parseExpression(innerText, new Marker());

            node.innerExpression = innerExpression;
        }

        return node;
    }

    parseNamedFunction(inputText, marker) {
        var start = marker.position;

        var matchString = ""
        var match = null;

        nodes.namedFunctions.forEach(nf => {
            nf.allowedWritings.map(a => a).sort((a, b) => { return b.length - a.length }).forEach(w => {
                if (inputText.substr(marker.position, w.length) == w) {
                    match = nf;
                    matchString = w;
                    marker.position += w.length;
                }
            });
        });

        if (match === null) { return null; }

        var end = marker.position;

        var node = new nodes.RPNamedFunctionNode();

        node.value = match;

        node.start = start;
        node.end = end;
        node._text = matchString;

        return node;
    }

    parseBinomialOperator(inputText, marker) {
        var start = marker.position;

        var c = inputText.charAt(marker.position);

        if (!isAnyOf("+-*/^", c)) {
            return null;
        }

        marker.position++;

        var end = marker.position;

        var node = new nodes.RPOperatorNode();

        node.start = start;
        node.end = end;
        node._text = c;
        node.value = c;

        return node;
    }

    parseIdentifier(inputText, marker) {
        var start = marker.position;

        var c = inputText.charAt(marker.position);

        if (!isAnyOf("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", c)) {
            return null;
        }

        marker.position++;

        var end = marker.position;

        var node = new nodes.RPIdentifierNode();

        node.start = start;
        node.end = end;
        node._text = c;
        node.value = c;

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

        var node = new nodes.RPRadicalNode();

        node.start = start;
        node.end = end;
        node._text = inputText.slice(start, end);

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

        var node = new nodes.RPMixedFractionNode();

        node.start = start;
        node.end = end;
        node._text = inputText.slice(start, end);

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

        var node = new nodes.RPFractionNode();

        node.start = start;
        node.end = end;
        node._text = inputText.slice(start, end);

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
            var node = new nodes.RPNumberNode();

            node.subtype = subtype;

            node.integralPart = integralPart;
            node.decimalPart = decimalPart;

            node.start = start;
            node.end = end;
            node._text = ts + t;
            node.value = simplestForm;

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

            var node = new nodes.RPWhiteSpaceNode();

            node.start = start;
            node.end = end;
            node._text = t;
            node.value = " ";

            node._latex = t;
            node._asciiMath = t;

            return node;
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

module.exports.Marker = Marker;
module.exports.ResponseParser = ResponseParser;

},{"./rpnodes.js":2}],2:[function(require,module,exports){

class RPNode {
    constructor(type = "") {
        this.supernode = null;
        this.depth = 0;

        this.type = type;
        this.subtype = "";

        this._title = "Node";

        this.start = 0;
        this.end = 0;
        this._text = "";

        this._latex = "";
        this._asciiMath = "";
        this._mathML = "";
    }

    get title() { return this._title; }

    get length() { return this.end - this.start; }
    get text() { return this._text; }

    get latex() { return this._latex; }
    get asciiMath() { return this._asciiMath; }
    get mathML() { return this._mathML; }

    get subnodes() { return []; }

    setDepth(depth = 0) {
        this.depth = depth;

        var that = this;

        this.subnodes.forEach(n => {
            n.supernode = that;
            n.setDepth(depth + 1);
        });
    }
}

class RPWhiteSpaceNode extends RPNode {
    constructor() {
        super("whiteSpace");

        this.value = "";
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.value === this.value);
    }
}

class RPNumberNode extends RPNode {
    constructor() {
        super("number");

        this._title = "Number";

        this.value = "";
        this.integralPart = "";
        this.decimalPart = "";
        this.sign = "";
        this.signIsExplicit = false;
        this.numberOfLeadingZeros = 0;
        this.numberOfTrailingZeros = 0;
        this.minimumNumberOfSignificantFigures = 0;
        this.maximumNumberOfSignificantFigures = 0;
        this.numberOfDecimalPlaces = 0;
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.value === this.value);
    }

    get title() {
        return (this.subtype == "integer") ? "Integer" : "Decimal Number";
    }

    get latex() {
        return this.value;
    }

    get asciiMath() {
        return this.value;
    }

    get mathML() {
        return "<mn>" + this.value + "</mn>";
    }
}

class RPFractionNode extends RPNode {
    constructor() {
        super("fraction");

        this._title = "Fraction";

        this.numerator = null;
        this.denominator = null;
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.numerator.isEqualTo(this.numerator) && object.denominator.isEqualTo(this.denominator));
    }

    get subnodes() {
        return [this.numerator, this.denominator];
    }

    get latex() {
        return "\\frac{" + this.numerator.latex + "}{" + this.denominator.latex + "}";
    }

    get asciiMath() {
        return "frac " + this.numerator.asciiMath + " " + this.denominator.asciiMath;
    }

    get mathML() {
        return "<mfrac>" + this.numerator.mathML + this.denominator.mathML + "</mfrac>";
    }
}

class RPMixedFractionNode extends RPNode {
    constructor() {
        super("mixedFraction");

        this._title = "Mixed Fraction";

        this.wholePart = null;
        this.fractionPart = null;
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.wholePart.isEqualTo(this.wholePart) && object.fractionPart.isEqualTo(this.fractionPart));
    }

    get subnodes() {
        return [this.wholePart, this.fractionPart];
    }

    get latex() {
        return this.wholePart.latex + " " + this.fractionPart.latex;
    }

    get asciiMath() {
        return this.wholePart.asciiMath + " " + this.fractionPart.asciiMath;
    }

    get mathML() {
        return this.wholePart.mathML + this.fractionPart.mathML;
    }
}

class RPRadicalNode extends RPNode {
    constructor() {
        super("radical");

        this.radix = 2;
        this.radixIsImplicit = true;
        this.radicand = null;
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.radix === this.radix && object.radicand.isEqualTo(this.radicand));
    }

    get subnodes() {
        return [this.radicand];
    }

    get title() {
        return (this.radix == 2) ? "Square Root" : ((this.radix == 3) ? "Cube Root" : "Radical");
    }

    get latex() {
        return "\\sqrt{" + this.radicand.latex + "}";
    }

    get asciiMath() {
        return "sqrt(" + this.radicand.asciiMath + ")";
    }

    get mathML() {
        if (this.radix == 2) {
            return "<msqrt>" + this.radicand.mathML + "</msqrt>";
        }
        else {
            return "<mroot>" + this.radicand.mathML + "<mn>" + this.radix + "</mn></mroot>";
        }
    }
}

class RPIdentifierNode extends RPNode {
    constructor() {
        super("identifier");

        this.value = "";

        this._title = "Identifier";
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.value === this.value);
    }

    get latex() {
        return this.value;
    }

    get asciiMath() {
        return this.value;
    }

    get mathML() {
        return "<mi>" + this.value + "</mi>";
    }
}

class RPOperatorNode extends RPNode {
    constructor() {
        super("operator");

        this.value = "";

        this._title = "Operator";

        this.isImplicit = false;
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.value === this.value);
    }

    get precedence() {
        return "+-*/^!=".indexOf(this.value);
    }

    get latex() {
        return (this.value == "*") ? "\\times" : this.value;
    }

    get asciiMath() {
        return this.value;
    }

    get mathML() {
        return "<mo>" + this.value + "</mo>";
    }
}

class RPUnaryOperationNode extends RPNode {
    constructor() {
        super("unaryOperation");

        this.operand = null;

        this.operator = null;
    }

    get subnodes() {
        return [this.operand];
    }
}

class RPFactorialNode extends RPUnaryOperationNode {
    constructor() {
        super();

        this.subtype = "factorial";

        this._title = "Factorial";
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.operand.isEqualTo(this.operand));
    }

    get latex() {
        return this.operand.latex + "!";
    }

    get asciiMath() {
        return this.operand.asciiMath + "!";
    }
}

class RPBinaryOperationNode extends RPNode {
    constructor() {
        super("binaryOperation");

        this.operand1 = null;
        this.operand2 = null;

        this.operator = null;

        this._title = "BinaryOperation";
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.operand1.isEqualTo(this.operand1) && object.operand2.isEqualTo(this.operand2));
    }

    get subnodes() {
        return [this.operand1, this.operand2];
    }
}

class RPAdditionNode extends RPBinaryOperationNode {
    constructor() {
        super();

        this.subtype = "addition";

        this._title = "Addition";
    }

    get latex() {
        return this.operand1.latex + "+" + this.operand2.latex;
    }

    get asciiMath() {
        return this.operand1.asciiMath + "+" + this.operand2.asciiMath;
    }
}

class RPSubtractionNode extends RPBinaryOperationNode {
    constructor() {
        super();

        this.subtype = "subtraction";

        this._title = "Subtraction";
    }

    get latex() {
        return this.operand1.latex + "-" + this.operand2.latex;
    }

    get asciiMath() {
        return this.operand1.asciiMath + "-" + this.operand2.asciiMath;
    }
}

class RPMultiplicationNode extends RPBinaryOperationNode {
    constructor() {
        super();

        this.subtype = "multiplication";
        this.isImplicit = false;

        this._title = "Multiplication";
    }

    get title() {
        return (this.isImplicit) ? "Multiplication" : "Multiplication";
    }

    get latex() {
        if (this.isImplicit) {
            return this.operand1.latex + this.operand2.latex;
        }
        else {
            return this.operand1.latex + " \\times " + this.operand2.latex;
        }
    }

    get asciiMath() {
        if (this.isImplicit) {
            return this.operand1.asciiMath + this.operand2.asciiMath;
        }
        else {
            return this.operand1.asciiMath + "*" + this.operand2.asciiMath;
        }
    }
}

class RPDivisionNode extends RPBinaryOperationNode {
    constructor() {
        super();

        this.subtype = "division";

        this._title = "Division";
    }

    get latex() {
        return this.operand1.latex + "/" + this.operand2.latex;
    }

    get asciiMath() {
        return this.operand1.asciiMath + "/" + this.operand2.asciiMath;
    }
}

class RPExponentiationNode extends RPBinaryOperationNode {
    constructor() {
        super();

        this.subtype = "exponentiation";

        this._title = "Exponentiation";
    }

    get latex() {
        return this.operand1.latex + "^{" + this.operand2.latex + "}";
    }

    get asciiMath() {
        return this.operand1.asciiMath + "^" + this.operand2.asciiMath;
    }
}

class RPNamedFunction {
    constructor(name = "", allowedWritings = [], latex = "", asciiMath = "", mathML = "") {
        this.name = name;
        this.allowedWritings = allowedWritings;
        this.latex = latex;
        this.asciiMath = asciiMath;
        this.mathML = mathML;
    }
}

var namedFunctions = [
    new RPNamedFunction("Sine", ["sin", "sine"], "\\sin", "sin"),
    new RPNamedFunction("Cosine", ["cos", "cosine"], "\\cos", "cos"),
    new RPNamedFunction("Tangent", ["tan", "tangent"], "\\tan", "tan"),
    new RPNamedFunction("Arcsine", ["asin", "arcsin", "arcsine"], "\\arcsin", "arcsin"),
    new RPNamedFunction("Arccosine", ["acos", "arccos", "arccosine"], "\\arccos", "arccos"),
    new RPNamedFunction("Arctangent", ["atan", "arctan", "arctangent"], "\\arctan", "arctan"),
];

class RPNamedFunctionNode extends RPNode {
    constructor() {
        super("namedFunction");

        this.value = null;
        this.parameters = [];

        this.precedence = 6;
    }

    get title() {
        return (this.value === null) ? "Named Function" : this.value.name + " Function";
    }

    get subnodes() {
        return this.parameters;
    }

    get latex() {
        return this.value.latex + " " + this.parameters.map(p => p.latex).join(", ");
    }

    get asciiMath() {
        return this.value.asciiMath + " " + this.parameters.map(p => p.asciiMath).join(", ");
    }
}

class RPBracketedExpressionNode extends RPNode {
    constructor() {
        super("bracketedExpression");

        this.bracketType = "()";
        this.innerExpression = null;

        this._title = "Bracketed Expression";
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype  && object.bracketType == this.bracketType && object.innerExpression.isEqualTo(this.innerExpression));
    }

    get subnodes() {
        return [this.innerExpression];
    }

    get text() {
        return "(" + this.innerExpression.text + ")";
    }

    get latex() {
        return "\\left(" + this.innerExpression.latex + "\\right)";
    }

    get asciiMath() {
        return "(" + this.innerExpression.asciiMath + ")";
    }
}

class RPSurdNode extends RPNode {
    constructor() {
        super("surd");

        this.coefficient = null;
        this.radical = null;

        this._title = "Surd";
    }

    get subnodes() {
        return [this.coefficient, this.radical];
    }

    get latex() {
        return this.coefficient.latex + " " + this.radical.latex;
    }

    get asciiMath() {
        return this.coefficient.asciiMath + " " + this.radical.asciiMath;
    }
}

class RPSummationNode extends RPNode {
    constructor() {
        super("summation");

        this.operands = [];

        this._title = "Summation";
    }

    get subnodes() {
        return this.operands;
    }

    get latex() {
        return this.operands.map(o => o.latex).join("+");
    }

    get asciiMath() {
        return this.operands.map(o => o.asciiMath).join("+");
    }
}

class Simplifier {
    constructor() { }

    simplifyNode(node) {

        node = this.replaceWithSurd(node);
        node = this.replaceWithSummation(node);
        node = this.replaceWithSummation(node);

        return node;
    }

    replaceWithSummation(node) {
        if (node.subtype == "addition" && (node.operand1.subtype == "addition" || node.operand2.subtype == "addition")) {
            var summation = new RPSummationNode();

            if (node.operand1.subtype == "addition") {
                summation.operands.push(node.operand1.operand1);
                summation.operands.push(node.operand1.operand2);
            }
            else {
                summation.operands.push(node.operand1);
            }

            if (node.operand2.subtype == "addition") {
                summation.operands.push(node.operand2.operand1);
                summation.operands.push(node.operand2.operand2);
            }
            else {
                summation.operands.push(node.operand2);
            }

            return summation;
        }
        else if (node.type == "summation") {
            var summation = new RPSummationNode();

            node.operands.forEach(o => {
                if (o.subtype == "addition") {
                    summation.operands.push(o.operand1);
                    summation.operands.push(o.operand2);
                }
                else {
                    summation.operands.push(o);
                }
            });

            return summation;
        }

        return node;
    }

    replaceWithSurd(node) {
        if (node.type == "binaryOperation"
            && node.subtype == "multiplication"
            && node.operand1.type == "number"
            && node.operand2.type == "radical"
            && node.operand2.radicand.type == "number") {
            var surd = new RPSurdNode();

            surd.coefficient = node.operand1;
            surd.radical = node.operand2;

            return surd;
        }

        return node;
    }
}

module.exports.RPNode = RPNode;
module.exports.RPWhiteSpaceNode = RPWhiteSpaceNode;
module.exports.RPNumberNode = RPNumberNode;
module.exports.RPFractionNode = RPFractionNode;
module.exports.RPMixedFractionNode = RPMixedFractionNode;
module.exports.RPRadicalNode = RPRadicalNode;
module.exports.RPIdentifierNode = RPIdentifierNode;
module.exports.RPOperatorNode = RPOperatorNode;
module.exports.RPUnaryOperationNode = RPUnaryOperationNode;
module.exports.RPFactorialNode = RPFactorialNode;
module.exports.RPBinaryOperationNode = RPBinaryOperationNode;
module.exports.RPAdditionNode = RPAdditionNode;
module.exports.RPSubtractionNode = RPSubtractionNode;
module.exports.RPMultiplicationNode = RPMultiplicationNode;
module.exports.RPDivisionNode = RPDivisionNode;
module.exports.RPExponentiationNode = RPExponentiationNode;
module.exports.RPNamedFunction = RPNamedFunction;
module.exports.namedFunctions = namedFunctions;
module.exports.RPNamedFunctionNode = RPNamedFunctionNode;
module.exports.RPBracketedExpressionNode = RPBracketedExpressionNode;
module.exports.RPSurdNode = RPSurdNode;
module.exports.RPSummationNode = RPSummationNode;
module.exports.Simplifier = Simplifier;







},{}]},{},[2,1]);