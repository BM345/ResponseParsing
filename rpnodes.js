

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
}

class RPIdentifierNode extends RPNode {
    constructor() {
        super();

        this.type = "identifier";
    }
}

class RPOperatorNode extends RPNode {
    constructor() {
        super();

        this.type = "operator";
        this.isImplicit = false;
    }

    get precedence() {
        return "+-*/^".indexOf(this.text);
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
}

class RPAdditionNode extends RPBinomialOperationNode {
    constructor() {
        super();

        this.subtype = "addition";
    }
}

class RPSubtractionNode extends RPBinomialOperationNode {
    constructor() {
        super();

        this.subtype = "subtraction";
    }
}

class RPMultiplicationNode extends RPBinomialOperationNode {
    constructor() {
        super();

        this.subtype = "multiplication";
    }
}

class RPDivisionNode extends RPBinomialOperationNode {
    constructor() {
        super();

        this.subtype = "division";
    }
}

class RPExponentiationNode extends RPBinomialOperationNode {
    constructor() {
        super();

        this.subtype = "exponentiation";
    }
}