
export class RPNode {
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

export class RPWhiteSpaceNode extends RPNode {
    constructor() {
        super("whiteSpace");

        this.value = "";
    }

    isEqualTo(object) {
        return (object.type === this.type && object.subtype === this.subtype && object.value === this.value);
    }
}

export class RPNumberNode extends RPNode {
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

export class RPFractionNode extends RPNode {
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

export class RPMixedFractionNode extends RPNode {
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

export class RPRadicalNode extends RPNode {
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

export class RPIdentifierNode extends RPNode {
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

export class RPOperatorNode extends RPNode {
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

export class RPUnaryOperationNode extends RPNode {
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

export class RPSignNode extends RPUnaryOperationNode {
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

export class RPFactorialNode extends RPUnaryOperationNode {
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

export class RPBinaryOperationNode extends RPNode {
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

export class RPAdditionNode extends RPBinaryOperationNode {
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

export class RPSubtractionNode extends RPBinaryOperationNode {
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

export class RPMultiplicationNode extends RPBinaryOperationNode {
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

export class RPDivisionNode extends RPBinaryOperationNode {
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

export class RPExponentiationNode extends RPBinaryOperationNode {
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

export class RPNamedFunction {
    constructor(name = "", allowedWritings = [], latex = "", asciiMath = "", mathML = "") {
        this.name = name;
        this.allowedWritings = allowedWritings;
        this.latex = latex;
        this.asciiMath = asciiMath;
        this.mathML = mathML;
    }
}

export var namedFunctions = [
    new RPNamedFunction("Sine", ["sin", "sine"], "\\sin", "sin"),
    new RPNamedFunction("Cosine", ["cos", "cosine"], "\\cos", "cos"),
    new RPNamedFunction("Tangent", ["tan", "tangent"], "\\tan", "tan"),
    new RPNamedFunction("Arcsine", ["asin", "arcsin", "arcsine"], "\\arcsin", "arcsin"),
    new RPNamedFunction("Arccosine", ["acos", "arccos", "arccosine"], "\\arccos", "arccos"),
    new RPNamedFunction("Arctangent", ["atan", "arctan", "arctangent"], "\\arctan", "arctan"),
];

export class RPNamedFunctionNode extends RPNode {
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

export class RPBracketedExpressionNode extends RPNode {
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

export class RPSurdNode extends RPNode {
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

export class RPSummationNode extends RPNode {
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

export class RPVectorNode extends RPSummationNode {
    constructor() {
        super();

        this.type = "vector";

        this._title = "Vector";
    }
}

export class RPComplexNumberNode extends RPSummationNode {
    constructor() {
        super();

        this.type = "complexNumber";

        this._title = "Complex Number";
    }
}

export class RPProductNode extends RPNode {
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

export class SimplifierSettings {
    constructor() {
        this.lookForVectors = false;
        this.lookForComplexNumbers = true;
    }
}

export class Simplifier {
    constructor() {
        this.settings = new SimplifierSettings();
    }

    simplifyNode(node, d = 0) {

        node.subnodes = this.simplifyNodes(node.subnodes, d + 1);

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
            var isUnitVector = (n) => { return (n.type == "identifier" && (n.value == "i" || n.value == "j" || n.value == "k")); }

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