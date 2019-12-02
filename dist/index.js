/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./src/rpnodes.js

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
    set subnodes(value) { }

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

    set subnodes(value) {
        this.numerator = value[0];
        this.denominator = value[1];
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

    set subnodes(value) {
        this.wholePart = value[0];
        this.fractionPart = value[1];
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

    set subnodes(value) {
        this.radicand = value[0];
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

class RPGreekLetter {
    constructor(name, asciiMath, latex) {
        this.name = name;
        this.asciiMath = asciiMath;
        this.latex = latex;
    }
}

const greekLetters = [
    new RPGreekLetter("alpha", "alpha", "\\alpha"),
    new RPGreekLetter("beta", "beta", "\\beta"),
    new RPGreekLetter("gamma", "gamma", "\\gamma"),
    new RPGreekLetter("delta", "delta", "\\delta"),
    new RPGreekLetter("epsilon", "epsilon", "\\epsilon"),
    new RPGreekLetter("zeta", "zeta", "\\zeta"),
    new RPGreekLetter("eta", "eta", "\\eta"),
    new RPGreekLetter("theta", "theta", "\\theta"),
    new RPGreekLetter("iota", "iota", "\\iota"),
    new RPGreekLetter("kappa", "kappa", "\\kappa"),
    new RPGreekLetter("lambda", "lambda", "\\lambda"),
    new RPGreekLetter("mu", "mu", "\\mu"),
    new RPGreekLetter("nu", "nu", "\\nu"),
    new RPGreekLetter("xi", "xi", "\\xi"),
    new RPGreekLetter("omicron", "omicron", "\\omicron"),
    new RPGreekLetter("pi", "pi", "\\pi"),
    new RPGreekLetter("rho", "rho", "\\rho"),
    new RPGreekLetter("sigma", "sigma", "\\sigma"),
    new RPGreekLetter("tau", "tau", "\\tau"),
    new RPGreekLetter("upsilon", "upsilon", "\\upsilon"),
    new RPGreekLetter("phi", "phi", "\\phi"),
    new RPGreekLetter("chi", "chi", "\\chi"),
    new RPGreekLetter("psi", "psi", "\\psi"),
    new RPGreekLetter("omega", "omega", "\\omega"),
    new RPGreekLetter("capitalAlpha", "", "A"),
    new RPGreekLetter("capitalBeta", "", "B"),
    new RPGreekLetter("capitalGamma", "Gamma", "\\Gamma"),
    new RPGreekLetter("capitalDelta", "Delta", "\\Delta"),
    new RPGreekLetter("capitalEpsilon", "", "E"),
    new RPGreekLetter("capitalZeta", "", "Z"),
    new RPGreekLetter("capitalEta", "", "H"),
    new RPGreekLetter("capitalTheta", "Theta", "\\Theta"),
    new RPGreekLetter("capitalIota", "", "I"),
    new RPGreekLetter("capitalKappa", "", "K"),
    new RPGreekLetter("capitalLambda", "Lambda", "\\Lambda"),
    new RPGreekLetter("capitalMu", "", "M"),
    new RPGreekLetter("capitalNu", "", "N"),
    new RPGreekLetter("capitalXi", "Xi", "\\Xi"),
    new RPGreekLetter("capitalOmicron", "", "O"),
    new RPGreekLetter("capitalPi", "Pi", "\\Pi"),
    new RPGreekLetter("capitalRho", "", "P"),
    new RPGreekLetter("capitalSigma", "Sigma", "\\Sigma"),
    new RPGreekLetter("capitalTau", "", "T"),
    new RPGreekLetter("capitalUpsilon", "", "Y"),
    new RPGreekLetter("capitalPhi", "Phi", "\\Phi"),
    new RPGreekLetter("capitalChi", "", "X"),
    new RPGreekLetter("capitalPsi", "Psi", "\\Psi"),
    new RPGreekLetter("capitalOmega", "Omega", "\\Omega")
];

class RPGreekLetterNode extends RPIdentifierNode {
    constructor() {
        super();

        this.subtype = "greek";
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.value.name === this.value.name);
    }

    get latex() {
        return this.value.latex;
    }

    get asciiMath() {
        return this.value.asciiMath;
    }

    get mathML() {
        return "<mi></mi>";
    }
}

class RPUnitVectorNode extends RPIdentifierNode {
    constructor() {
        super();

        this.type = "unitVector";

        this._title = "Unit Vector";
    }

    get latex() {
        return "\\textbf{" + this.value + "}";
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

        this._title = "Unary Operation";
    }

    get subnodes() {
        return [this.operand];
    }

    set subnodes(value) {
        this.operand = value[0];
    }
}

class RPSignNode extends RPUnaryOperationNode {
    constructor() {
        super();

        this.subtype = "sign";
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.value === this.value);
    }

    get title() {
        return (this.operator.value == "-") ? "Negation" : "Sign";
    }

    get text() {
        return this.operator.text + this.operand.text;
    }

    get latex() {
        return this.operator.latex + this.operand.latex;
    }

    get asciiMath() {
        return this.operator.asciiMath + this.operand.asciiMath;
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

    set subnodes(value) {
        this.operand1 = value[0];
        this.operand2 = value[1];
    }
}

class RPAdditionNode extends RPBinaryOperationNode {
    constructor() {
        super();

        this.subtype = "addition";

        this._title = "Addition";
    }

    get latex() {
        if (this.operand2.subtype == "sign") {
            return this.operand1.latex + this.operand2.latex;
        }
        else {
            return this.operand1.latex + "+" + this.operand2.latex;
        }
    }

    get asciiMath() {
        if (this.operand2.subtype == "sign") {
            return this.operand1.asciiMath + this.operand2.asciiMath;
        }
        else {
            return this.operand1.asciiMath + "+" + this.operand2.asciiMath;
        }
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
        return this.operand1.asciiMath + "*" + this.operand2.asciiMath;
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

    set subnodes(value) {
        this.parameters = value;
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
        return (object.type === this.type && object.subtype === this.subtype && object.bracketType == this.bracketType && object.innerExpression.isEqualTo(this.innerExpression));
    }

    get subnodes() {
        return [this.innerExpression];
    }

    set subnodes(value) {
        this.innerExpression = value[0];
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

    set subnodes(value) {
        this.coefficient = value[0];
        this.radical = value[1];
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

    isEqualTo(object) {
        if (object.type !== this.type || object.subtype !== this.subtype || object.operands.length !== this.operands.length) {
            return false;
        }

        var allOperandsAreEqual = true;

        for (var i = 0; i < this.operands.length; i++) {
            if (!object.operands[i].isEqualTo(this.operands[i])) {
                allOperandsAreEqual = false;
            }
        }

        return allOperandsAreEqual;
    }

    get subnodes() {
        return this.operands;
    }

    set subnodes(value) {
        this.operands = value;
    }

    get latex() {
        var l = "";

        for (var i = 0; i < this.operands.length; i++) {
            if (i == 0 || this.operands[i].subtype == "sign") {
                l += this.operands[i].latex;
            }
            else {
                l += "+" + this.operands[i].latex;
            }
        }

        return l;
    }

    get asciiMath() {
        var a = "";

        for (var i = 0; i < this.operands.length; i++) {
            if (i == 0 || this.operands[i].subtype == "sign") {
                a += this.operands[i].asciiMath;
            }
            else {
                a += "+" + this.operands[i].asciiMath;
            }
        }

        return a;
    }
}

class RPVectorNode extends RPSummationNode {
    constructor() {
        super();

        this.type = "vector";

        this._title = "Vector";
    }
}

class RPComplexNumberNode extends RPSummationNode {
    constructor() {
        super();

        this.type = "complexNumber";

        this._title = "Complex Number";
    }
}

class RPProductNode extends RPNode {
    constructor() {
        super("product");

        this.operands = [];

        this._title = "Product";
    }

    get subnodes() {
        return this.operands;
    }

    set subnodes(value) {
        this.operands = value;
    }

    get latex() {
        return this.operands.map(o => o.latex).join(" \\times ");
    }

    get asciiMath() {
        return this.operands.map(o => o.asciiMath).join("*");
    }
}

class SimplifierSettings {
    constructor() {
        this.lookForVectors = true;
        this.lookForComplexNumbers = false;
    }
}

class Simplifier {
    constructor() {
        this.settings = new SimplifierSettings();
    }

    simplifyNode(node, d = 0) {

        node.subnodes = this.simplifyNodes(node.subnodes, d + 1);

        if (this.settings.lookForVectors) {
            node = this.replaceWithUnitVectors(node);
        }

        node = this.replaceWithSurd(node);
        node = this.replaceSubtractions(node);
        node = this.replaceWithSummation(node);

        if (d == 0) {
            if (this.settings.lookForVectors) {
                node = this.replaceWithVectors(node);
            }
            else if (this.settings.lookForComplexNumbers) {
                node = this.replaceWithComplexNumbers(node);
            }
        }

        node = this.replaceWithProduct(node);
        node = this.simplifyUnaryOperator(node);
        node = this.removeNestedBrackets(node);

        return node;
    }

    simplifyNodes(nodes, d = 0) {
        return nodes.map(n => this.simplifyNode(n, d));
    }

    replaceSubtractions(node) {
        if (node.subtype == "subtraction") {
            var addition = new RPAdditionNode();
            var s = new RPSignNode();
            var o = new RPOperatorNode();

            o.value = "-";

            s.operator = o;
            s.operand = node.operand2;

            addition.operand1 = node.operand1;
            addition.operand2 = s;

            return addition;
        }

        return node;
    }

    isIJKVectorComponent(node) {
        var isUnsignedComponent = (m) => {
            var isUnitVector = (n) => { return ((n.type == "identifier" || n.type == "unitVector") && (n.value == "i" || n.value == "j" || n.value == "k")); }

            if (isUnitVector(m)) { return true; }
            if (m.subtype == "multiplication" && m.operand1.type == "number" && isUnitVector(m.operand2)) { return true; }

            return false;
        }

        if (isUnsignedComponent(node)) { return true; }
        if (node.subtype == "sign" && isUnsignedComponent(node.operand)) { return true; }

        return false;
    }

    replaceWithVectors(node) {
        if ((node.subtype == "addition" || node.type == "summation") && node.subnodes.filter(n => (!this.isIJKVectorComponent(n) && n.type != "vector")).length == 0) {
            var vector = new RPVectorNode();

            node.subnodes.forEach(n => {
                if (this.isIJKVectorComponent(n)) {
                    vector.subnodes.push(n);
                }
                else if (n.type == "vector") {
                    vector.subnodes = vector.subnodes.concat(n.subnodes);
                }
            });

            return vector;
        }
        else if (this.isIJKVectorComponent(node)) {
            var vector = new RPVectorNode();

            vector.subnodes.push(node);

            return vector;
        }

        return node;
    }

    replaceWithUnitVectors(node) {
        if (node.type == "identifier" && (node.value == "i" || node.value == "j" || node.value == "k")) {
            var unitVector = new RPUnitVectorNode();

            unitVector.value = node.value;

            return unitVector;
        }

        return node;
    }

    isComplexNumberTerm(node) {
        var isUnsignedTerm = (m) => {
            var isImaginaryConstant = (n) => { return (n.type == "identifier" && n.value == "i"); }

            if (isImaginaryConstant(m)) { return true; }
            if (m.subtype == "multiplication" && m.operand1.type == "number" && isImaginaryConstant(m.operand2)) { return true; }

            return false;
        }

        if (isUnsignedTerm(node)) { return true; }
        if (node.subtype == "sign" && isUnsignedTerm(node.operand)) { return true; }
        if (node.type == "number") { return true; }
        if (node.subtype == "sign" && node.operand.type == "number") { return true; }

        return false;
    }

    replaceWithComplexNumbers(node) {
        if ((node.subtype == "addition" || node.type == "summation") && node.subnodes.filter(n => (!this.isComplexNumberTerm(n) && n.type != "complexNumber")).length == 0) {
            var complexNumber = new RPComplexNumberNode();

            node.subnodes.forEach(n => {
                if (this.isComplexNumberTerm(n)) {
                    complexNumber.subnodes.push(n);
                }
                else if (n.type == "complexNumber") {
                    complexNumber.subnodes = complexNumber.subnodes.concat(n.subnodes);
                }
            });

            return complexNumber;
        }
        else if (this.isComplexNumberTerm(node)) {
            var complexNumber = new RPComplexNumberNode();

            complexNumber.subnodes.push(node);

            return complexNumber;
        }

        return node;
    }

    replaceWithSummation(node) {
        var isAdditionOrSummationNode = (node.subtype == "addition" || node.type == "summation");
        var hasAdditionOrSummationSubnodes = (node.subnodes.filter(n => n.subtype == "addition" || n.type == "summation").length > 0);

        if (isAdditionOrSummationNode && hasAdditionOrSummationSubnodes) {
            var summation = new RPSummationNode();

            node.subnodes.forEach(n => {
                if (n.subtype == "addition" || n.type == "summation") {
                    summation.operands = summation.operands.concat(n.subnodes);
                }
                else {
                    summation.operands.push(n);
                }
            });

            return summation;
        }

        return node;
    }

    replaceWithProduct(node) {
        var isMultiplicationOrProductNode = (node.subtype == "multiplication" || node.type == "product");
        var hasMultiplicationOrProductSubnodes = (node.subnodes.filter(n => n.subtype == "multiplication" || n.type == "product").length > 0);

        if (isMultiplicationOrProductNode && hasMultiplicationOrProductSubnodes) {
            var product = new RPProductNode();

            node.subnodes.forEach(n => {
                if (n.subtype == "multiplication" || n.type == "product") {
                    product.operands = product.operands.concat(n.subnodes);
                }
                else {
                    product.operands.push(n);
                }
            });

            return product;
        }

        return node;
    }

    replaceWithSurd(node) {
        if (node.type == "binaryOperation"
            && node.subtype == "multiplication"
            && node.operand1.type == "number"
            && node.operand2.type == "radical"
            && (node.operand2.radicand.type == "number" || (node.operand2.radicand.type == "bracketedExpression" && node.operand2.radicand.innerExpression.type == "number"))) {
            var surd = new RPSurdNode();

            surd.coefficient = node.operand1;
            surd.radical = node.operand2;

            return surd;
        }

        return node;
    }

    simplifyUnaryOperator(node) {
        if (node.type == "unaryOperation" && node.subtype == "sign" && node.operand.type == "number") {
            var number = node.operand;

            number.start = node.start;
            number.end = node.end;
            number._text = node.text;
            number.value = node.operator.value + node.operand.value;

            number.sign = (node.operator.value == "+") ? "positive" : "negative";
            number.signIsExplicit = true;

            return number;
        }

        return node;
    }

    removeNestedBrackets(node) {
        if (node.type == "bracketedExpression" && node.innerExpression.type == "bracketedExpression") {
            node.innerExpression = node.innerExpression.innerExpression;
        }
        else if (node.type == "radical" && node.radicand.type == "bracketedExpression") {
            node.radicand = node.radicand.innerExpression;
        }

        return node;
    }
}
// CONCATENATED MODULE: ./src/responseparsing.js
/* unused harmony export Marker */
/* unused harmony export ParserSettings */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return responseparsing_ResponseParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Validator; });


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
class responseparsing_ResponseParser {

    constructor() {
        this.settings = new ParserSettings();
        this.simplifier = new Simplifier();
    }

    // The top-level parse function (for now).
    getParseResult(inputText) {
        console.log(inputText);

        var m1 = new Marker();

        var expression = this.parseExpression(inputText, m1);

        if (expression !== null && m1.position == inputText.length) {
            expression = this.simplifier.simplifyNode(expression);
            expression.setDepth();

            console.log(expression);

            return expression;
        }

        // If nothing is found, return nothing.
        return null;
    }

    getInteger(inputText) {
        console.log(inputText);

        var m1 = new Marker();

        var number = this.parseNumber(inputText, m1);

        if (number !== null && number.subtype == "integer" && m1.position == inputText.length) {
            console.log(number);

            return number;
        }

        return null;
    }

    getNumber(inputText) {
        console.log(inputText);

        var m1 = new Marker();

        var number = this.parseNumber(inputText, m1);

        if (number !== null && m1.position == inputText.length) {
            console.log(number);

            return number;
        }

        return null;
    }

    getFraction(inputText) {
        console.log(inputText);

        var m1 = new Marker();
        var m2 = new Marker();

        var number = this.parseNumber(inputText, m1);
        var fraction = this.parseFraction(inputText, m2);

        if (number !== null && m1.position == inputText.length) {
            console.log(number);

            return number;
        }

        if (fraction !== null && m2.position == inputText.length) {
            console.log(fraction);

            return fraction;
        }

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
        var n = 0;
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
            if (node === null) { node = this.parseGreekIdentifier(inputText, marker.copy()); }
            if (node === null) { node = this.parseIdentifier(inputText, marker.copy()); }
            if (node === null) { node = this.parseWhiteSpace(inputText, marker.copy()); }
            if (node === null) { break; }

            if (node.type == "operator" || node.type == "namedFunction") {
                this._applyOperators(operandStack, operatorStack, node);

                operatorStack.push(node);
                n++;
            }
            else if (node.type == "whiteSpace") {
            }
            else {
                if (lastNode !== undefined && lastNode.type != "operator" && lastNode.type != "namedFunction") {
                    var implicitTimes = new RPOperatorNode();

                    implicitTimes.value = "*";
                    implicitTimes.isImplicit = true;

                    operatorStack.push(implicitTimes);
                }
                else if (n == 1 && lastNode.type == "operator" && (lastNode.value == "+" || lastNode.value == "-")) {
                    var signNode = new RPSignNode();
                    var operator = operatorStack.pop();

                    signNode.start = operator.start;
                    signNode.end = node.end;
                    signNode._text = inputText.slice(signNode.start, signNode.end);

                    signNode.operator = operator;
                    signNode.operand = node;

                    node = signNode;
                }

                operandStack.push(node);
                n++;
            }

            marker.position = node.end;

            if (node.type != "whiteSpace") {
                lastNode = node;
            }
        }

        if (lastNode != undefined && lastNode.type == "operator") {
            operatorStack.pop();
        }

        this._applyOperators(operandStack, operatorStack, null);

        if (operandStack.length == 0 && operatorStack.length == 1 && (operatorStack[0].value == "+" || operatorStack[0].value == "-")) {
            var operator = operatorStack.pop();
            var number = new RPNumberNode();

            number.value = operatorStack.value;

            operandStack.push(number);
        }

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

                        if (operator.value == "+") { node = new RPAdditionNode(); }
                        if (operator.value == "-") { node = new RPSubtractionNode(); }
                        if (operator.value == "*") { node = new RPMultiplicationNode(); }
                        if (operator.value == "/") { node = new RPDivisionNode(); }
                        if (operator.value == "^") { node = new RPExponentiationNode(); }

                        node.operand2 = operandStack.pop();
                        node.operand1 = operandStack.pop();

                        if (operator.value == "*" && operator.isImplicit) {
                            node.isImplicit = true;
                            node._text = node.operand1.text + node.operand2.text;
                        }
                        else {
                            node._text = node.operand1.text + operator.text + node.operand2.text;
                        }

                        operandStack.push(node);
                    }
                    else if (operandStack.length >= 1 && operator.type == "operator") {
                        if (operator.value == "!") { node = new RPFactorialNode(); }

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

        var node = new RPOperatorNode();

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

        var node = new RPBracketedExpressionNode();

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

        namedFunctions.forEach(nf => {
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

        var node = new RPNamedFunctionNode();

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

        var node = new RPOperatorNode();

        node.start = start;
        node.end = end;
        node._text = c;
        node.value = c;

        return node;
    }

    parseGreekIdentifier(inputText, marker) {
        var start = marker.position;

        var match = null;

        for (var i = 0; i < greekLetters.length; i++) {
            var g = greekLetters[i];
            if (g.asciiMath.length > 0 && inputText.substr(marker.position, g.asciiMath.length) == g.asciiMath) {
                match = g;
                break;
            }
        }

        if (match === null) { return null; }

        marker.position += g.asciiMath.length;

        var end = marker.position;

        var node = new RPGreekLetterNode();

        node.start = start;
        node.end = end;
        node._text = inputText.slice(node.start, node.end);
        node.value = match;

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

        var node = new RPIdentifierNode();

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

        var radicand = this.parseNumber(inputText, marker.copy());

        if (radicand === null) { radicand = this.parseIdentifier(inputText, marker.copy()); }
        if (radicand === null) { radicand = this.parseBracketedExpression(inputText, marker.copy()); }
        if (radicand === null) { return null; }

        marker.position += radicand.length;

        var end = marker.position;

        var node = new RPRadicalNode();

        node.start = start;
        node.end = end;
        node._text = inputText.slice(start, end);

        node.radix = 2;
        node.radixIsImplicit = true;
        node.radicand = radicand;

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

        var node = new RPFractionNode();

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
            var node = new RPNumberNode();

            node.subtype = subtype;

            node.integralPart = integralPart;
            node.decimalPart = decimalPart;

            node.start = start;
            node.end = end;
            node._text = ts + t;
            node.value = ts + simplestForm;

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

            var node = new RPWhiteSpaceNode();

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

const red = "hsl(350, 80%, 80%)";
const green = "hsl(120, 80%, 60%)";

// Handles the actual on-page events and the validation messages.
class Validator {
    constructor() {
        this.inputs = [];

        // Create an instance of ResponseParser.
        this.rp = new responseparsing_ResponseParser();

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

        this.keyRestrictions = {
            "integer": "0123456789+-",
            "decimalNumber": "0123456789+-.",
            "fraction": "0123456789+-/.",
            "surd": "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-() ",
            "complexNumber": "0123456789.+-i ",
            "vector": "0123456789.+-ijk ",
        };
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

    isControlKey(code) {
        return this.controlKeys.indexOf(code) >= 0;
    }

    isRestrictedKey(key, type) {
        return !isAnyOf(this.keyRestrictions[type], key);
    }

    addInput(input, inputType, katexOutput, validationMessageElement, submitButton) {
        this.inputs.push([input, inputType, katexOutput, validationMessageElement, submitButton]);

        if (inputType == "integer") { this.setValidationEventsForInteger(input, katexOutput, validationMessageElement, submitButton); }
        if (inputType == "decimalNumber") { this.setValidationEventsForDecimalNumber(input, katexOutput, validationMessageElement, submitButton); }
        if (inputType == "fraction") { this.setValidationEventsForFraction(input, katexOutput, validationMessageElement, submitButton); }
        if (inputType == "surd") { this.setValidationEventsForSurd(input, katexOutput, validationMessageElement, submitButton); }
        if (inputType == "complexNumber") { this.setValidationEventsForComplexNumber(input, katexOutput, validationMessageElement, submitButton); }
        if (inputType == "vector") { this.setValidationEventsForVector(input, katexOutput, validationMessageElement, submitButton); }

        var that = this;

        input.onkeyup = function (e) {

            that.rp.simplifier.settings.lookForVectors = false;
            that.rp.simplifier.settings.lookForComplexNumbers = false;

            var parseResult = that.rp.getParseResult(input.value);

            if (parseResult !== null && parseResult.latex != undefined && parseResult.latex != "") {
                katex.render(parseResult.latex, katexOutput);
            }
            else {
                katex.render("", katexOutput);
            }
        }
    }

    setValidationEventsForInteger(input, katexOutput, validationMessageElement, submitButton) {

        var that = this;

        input.onkeydown = function (e) {

            validationMessageElement.innerText = "";

            if (!that.isControlKey(e.code)) {

                var t = that.getNewInputValueOnKeyDown(input, e);
                var parseResult = that.rp.getInteger(t);

                if (that.isRestrictedKey(e.key, "integer") || parseResult === null || parseResult.type != "number" || parseResult.subtype != "integer") {
                    e.preventDefault();
                    validationMessageElement.innerText = "Your answer must be a single whole number. Only use the characters 0 to 9 and the + and - signs.";
                    validationMessageElement.style.color = red;
                }
            }
        }

        submitButton.onmousedown = function (e) {

            validationMessageElement.innerText = "";

            var t = input.value;
            var parseResult = that.rp.getInteger(t);

            if (parseResult === null || parseResult.type != "number" || parseResult.subtype != "integer") {
                validationMessageElement.innerText = "Your answer must be a whole number.";
                validationMessageElement.style.color = red;
            }
            else if (parseResult.type == "number" && parseResult.subtype == "integer") {
                validationMessageElement.innerText = "Your answer has been submitted.";
                validationMessageElement.style.color = green;
            }
        }
    }

    setValidationEventsForDecimalNumber(input, katexOutput, validationMessageElement, submitButton) {

        var that = this;

        input.onkeydown = function (e) {

            validationMessageElement.innerText = "";

            if (!that.isControlKey(e.code)) {

                var t = that.getNewInputValueOnKeyDown(input, e);
                var parseResult = that.rp.getNumber(t);

                if (that.isRestrictedKey(e.key, "decimalNumber") || parseResult === null || parseResult.type != "number") {
                    e.preventDefault();
                    validationMessageElement.innerText = "Your answer must be a single decimal number of whole number. Only use the characters 0 to 9, the decimal point, and the + and - signs."
                    validationMessageElement.style.color = red;
                }
            }
        }

        submitButton.onmousedown = function (e) {

            validationMessageElement.innerText = "";

            var t = input.value;
            var parseResult = that.rp.getNumber(t);

            if (parseResult === null || parseResult.type != "number") {
                validationMessageElement.innerText = "Your answer must be a decimal number or a whole number.";
                validationMessageElement.style.color = red;
            }
            else if (parseResult.type == "number") {
                validationMessageElement.innerText = "Your answer has been submitted.";
                validationMessageElement.style.color = green;
            }
        }
    }

    setValidationEventsForFraction(input, katexOutput, validationMessageElement, submitButton) {

        var that = this;

        input.onkeydown = function (e) {

            validationMessageElement.innerText = "";

            if (!that.isControlKey(e.code)) {

                that.rp.simplifier.settings.lookForVectors = false;
                that.rp.simplifier.settings.lookForComplexNumbers = false;

                var t = that.getNewInputValueOnKeyDown(input, e);
                var parseResult = that.rp.getFraction(t);

                if (that.isRestrictedKey(e.key, "fraction") || parseResult === null || (parseResult.type != "fraction" && parseResult.type != "number")) {
                    e.preventDefault();
                    validationMessageElement.innerText = "Only use the characters 0 to 9, the decimal point, the plus and minus signs, and the forward slash."
                    validationMessageElement.style.color = red;
                }
            }
        }

        submitButton.onmousedown = function (e) {

            validationMessageElement.innerText = "";

            that.rp.simplifier.settings.lookForVectors = false;
            that.rp.simplifier.settings.lookForComplexNumbers = false;

            var t = input.value;
            var parseResult = that.rp.getFraction(t);

            if (parseResult === null || (parseResult.type != "fraction" && parseResult.type != "number")) {
                validationMessageElement.innerText = "Your answer must be a fraction or a whole number.";
                validationMessageElement.style.color = red;
            }
            if (parseResult.type == "fraction" || parseResult.type == "number") {
                validationMessageElement.innerText = "Your answer has been submitted.";
                validationMessageElement.style.color = green;
            }
        }
    }

    setValidationEventsForSurd(input, katexOutput, validationMessageElement, submitButton) {

        var that = this;

        input.onkeydown = function (e) {

            validationMessageElement.innerText = "";

            if (!that.isControlKey(e.code)) {
                if (that.isRestrictedKey(e.key, "surd")) {
                    e.preventDefault();
                    validationMessageElement.innerText = "You should only use the characters 0-9, the minus sign, brackets, and 'sqrt' for the square root sign.";
                    validationMessageElement.style.color = red;
                }
            }
        }

        submitButton.onmousedown = function (e) {

            validationMessageElement.innerText = "";

            that.rp.simplifier.settings.lookForVectors = false;
            that.rp.simplifier.settings.lookForComplexNumbers = false;

            var t = input.value;
            var parseResult = that.rp.getParseResult(t);

            if (parseResult === null || (parseResult.type != "surd" && parseResult.type != "radical" && parseResult.type != "number")) {
                validationMessageElement.innerText = "Your answer must be a surd.";
                validationMessageElement.style.color = red;
            }
            else if (parseResult.type != "surd" || parseResult.type != "radical" || parseResult.type != "number") {
                validationMessageElement.innerText = "Your answer has been submitted.";
                validationMessageElement.style.color = green;
            }
        }
    }

    setValidationEventsForComplexNumber(input, katexOutput, validationMessageElement, submitButton) {

        var that = this;

        input.onkeydown = function (e) {

            validationMessageElement.innerText = "";

            if (!that.isControlKey(e.code)) {
                if (that.isRestrictedKey(e.key, "complexNumber")) {
                    e.preventDefault();
                    validationMessageElement.innerText = "Only use the characters 0 to 9, the decimal point, and the plus and minus sign. Use i as the imaginary constant.";
                    validationMessageElement.style.color = red;
                }
            }
        }

        submitButton.onmousedown = function (e) {

            validationMessageElement.innerText = "";

            that.rp.simplifier.settings.lookForVectors = false;
            that.rp.simplifier.settings.lookForComplexNumbers = true;

            var t = input.value;
            var parseResult = that.rp.getParseResult(t);

            if (parseResult === null || parseResult.type != "complexNumber") {
                validationMessageElement.innerText = "Your answer must be a real number, an imaginary number, or a complex number.";
                validationMessageElement.style.color = red;
            }
            else if (parseResult.type == "complexNumber") {
                validationMessageElement.innerText = "Your answer has been submitted.";
                validationMessageElement.style.color = green;
            }
        }
    }

    setValidationEventsForVector(input, katexOutput, validationMessageElement, submitButton) {

        var that = this;

        input.onkeydown = function (e) {

            validationMessageElement.innerText = "";

            if (!that.isControlKey(e.code)) {
                if (that.isRestrictedKey(e.key, "vector")) {
                    e.preventDefault();
                    validationMessageElement.innerText = "Your answer must be a vector. Use i, j, and k to denote unit vectors in the x, y, and z directions.";
                    validationMessageElement.style.color = red;
                }
            }
        }

        submitButton.onmousedown = function (e) {

            that.rp.simplifier.settings.lookForVectors = true;
            that.rp.simplifier.settings.lookForComplexNumbers = false;

            validationMessageElement.innerText = "";

            var t = input.value;
            var parseResult = that.rp.getParseResult(t);

            if (parseResult === null || parseResult.type != "vector") {
                validationMessageElement.innerText = "Your answer must be a vector";
                validationMessageElement.style.color = red;
            }
            else if (parseResult.type == "vector") {
                validationMessageElement.innerText = "Your answer has been submitted.";
                validationMessageElement.style.color = green;
            }
        }
    }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _responseparsing_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var validator = new _responseparsing_js__WEBPACK_IMPORTED_MODULE_0__[/* Validator */ "b"]();

window.addEventListener("load", function () {
    var i1 = document.getElementById("input1");
    var o1 = document.getElementById("validationMessage1");
    var sb1 = document.getElementById("submitButton1");
    var ko1 = document.getElementById("katexOutput1");

    var i2 = document.getElementById("input2");
    var o2 = document.getElementById("validationMessage2");
    var sb2 = document.getElementById("submitButton2");
    var ko2 = document.getElementById("katexOutput2");

    var i3 = document.getElementById("input3");
    var o3 = document.getElementById("validationMessage3");
    var sb3 = document.getElementById("submitButton3");
    var ko3 = document.getElementById("katexOutput3");

    var i4 = document.getElementById("input4");
    var o4 = document.getElementById("validationMessage4");
    var sb4 = document.getElementById("submitButton4");
    var ko4 = document.getElementById("katexOutput4");

    var i5 = document.getElementById("input5");
    var o5 = document.getElementById("validationMessage5");
    var sb5 = document.getElementById("submitButton5");
    var ko5 = document.getElementById("katexOutput5");

    var i6 = document.getElementById("input6");
    var o6 = document.getElementById("validationMessage6");
    var sb6 = document.getElementById("submitButton6");
    var ko6 = document.getElementById("katexOutput6");

    validator.addInput(i1, "integer", ko1, o1, sb1);
    validator.addInput(i2, "decimalNumber", ko2, o2, sb2);
    validator.addInput(i3, "fraction", ko3, o3, sb3);
    validator.addInput(i4, "surd", ko4, o4, sb4);
    validator.addInput(i5, "complexNumber", ko5, o5, sb5);
    validator.addInput(i6, "vector", ko6, o6, sb6);
});

/***/ })
/******/ ]);