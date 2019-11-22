

class RPNode {
    constructor() {
        this.supernode = null;
        this.depth = 0;

        this.type = "";
        this.subtype = "";

        this.text = "";
        this.latex = "";
        this.asciiMath = "";
        this.isComplete = false;

        this.start = 0;
        this.end = 0;
    }

    get length() {
        return this.end - this.start;
    }

    get subnodes() {
        return [];
    }

    setDepth(depth = 0) {
        this.depth = depth;

        var that = this;

        this.subnodes.forEach(n => {
            n.supernode = that;
            n.setDepth(depth + 1);
        });
    }

    get title() {
        return "";
    }
}

class RPNumberNode extends RPNode {
    constructor() {
        super();

        this.type = "number";

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
}

class RPFractionNode extends RPNode {
    constructor() {
        super();

        this.type = "fraction";

        this.numerator = null;
        this.denominator = null;
    }

    get subnodes() {
        return [this.numerator, this.denominator];
    }

    get title() {
        return "Fraction";
    }
}

class RPMixedFractionNode extends RPNode {
    constructor() {
        super();

        this.type = "mixedFraction";

        this.wholePart = null;
        this.fractionPart = null;
    }

    get subnodes() {
        return [this.wholePart, this.fractionPart];
    }

    get title() {
        return "Mixed Fraction";
    }
}

class RPRadicalNode extends RPNode {
    constructor() {
        super();

        this.type = "radical";

        this.radix = 2;
        this.radixIsImplicit = true;
        this.radicand = null;
    }

    get subnodes() {
        return [this.radicand];
    }

    get title() {
        return (this.radix == 2) ? "Square Root" : "Radical";
    }
}

class RPIdentifierNode extends RPNode {
    constructor() {
        super();

        this.type = "identifier";
    }

    get title() {
        return "Identifier";
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