
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

class RPNumberNode extends RPNode {
    constructor() {
        super("number");

        this._title = "Number";

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

    get mathML() {
        return "<mn>" + this._text + "</mn>";
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

        this._title = "Identifier";
    }
}

class RPOperatorNode extends RPNode {
    constructor() {
        super();

        this.type = "operator";
        this.isImplicit = false;
    }

    get precedence() {
        return "+-*/^!".indexOf(this.text);
    }

    get title() {
        return "Operator";
    }
}


class RPPrefixOperationNode extends RPNode {
    constructor() {
        super();

        this.type = "prefixOperation";

        this.operand = null;
    }

    get subnodes() {
        return [this.operand];
    }
}

class RPSuffixOperationNode extends RPNode {
    constructor() {
        super();

        this.type = "suffixOperation";

        this.operand = null;
    }

    get subnodes() {
        return [this.operand];
    }
}

class RPFactorialNode extends RPSuffixOperationNode {
    constructor() {
        super();

        this.type = "factorial";
    }

    get title() {
        return "Factorial";
    }
}

class RPBinomialOperationNode extends RPNode {
    constructor() {
        super();

        this.type = "binomialOperation";

        this.operand1 = null;
        this.operand2 = null;
    }

    get subnodes() {
        return [this.operand1, this.operand2];
    }

    get title() {
        return "Binomial Operation";
    }
}

class RPAdditionNode extends RPBinomialOperationNode {
    constructor() {
        super();

        this.subtype = "addition";
    }

    get title() {
        return "Addition";
    }
}

class RPSubtractionNode extends RPBinomialOperationNode {
    constructor() {
        super();

        this.subtype = "subtraction";
    }

    get title() {
        return "Subtraction";
    }
}

class RPMultiplicationNode extends RPBinomialOperationNode {
    constructor() {
        super();

        this.subtype = "multiplication";
        this.isImplicit = false;
    }

    get title() {
        return (this.isImplicit) ? "Multiplication (Implicit)" : "Multiplication";
    }
}

class RPDivisionNode extends RPBinomialOperationNode {
    constructor() {
        super();

        this.subtype = "division";
    }

    get title() {
        return "Division";
    }
}

class RPExponentiationNode extends RPBinomialOperationNode {
    constructor() {
        super();

        this.subtype = "exponentiation";
    }

    get title() {
        return "Exponentiation";
    }
}

class RPNamedFunctionNode extends RPNode {
    constructor() {
        super();

        this.type = "namedFunction";

        this.functionName = [];
        this.parameters = [];

        this.precedence = 6;
    }

    get title() {
        if (this.functionName.length == 0) {
            return "Named Function";
        }
        else {
            return this.functionName[0] + " Function";
        }
    }

    get subnodes() {
        return this.parameters;
    }
}

class RPBracketedExpressionNode extends RPNode {
    constructor() {
        super();

        this.type = "bracketedExpression";

        this.bracketType = "()";
        this.innerExpression = null;
    }

    get title() {
        return "Bracketed Expression";
    }

    get subnodes() {
        return [this.innerExpression];
    }
}