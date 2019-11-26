
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

    get latex() {
        return this.operand.latex + "!";
    }

    get asciiMath() {
        return this.operand.asciiMath + "!";
    }
}

class RPBinaryOperationNode extends RPNode {
    constructor() {
        super("binomialOperation");

        this.operand1 = null;
        this.operand2 = null;

        this.operator = null;

        this._title = "BinaryOperation";
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
        return (this.isImplicit) ? "Multiplication (Implicit)" : "Multiplication";
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