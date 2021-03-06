import * as responseparsing from "./responseparsing.js";

var nodeColours = {
    "number": 220,
    "binaryOperation": 350,
    "summation": 350,
    "product": 350,
    "identifier": 90,
    "unitVector": 90,
    "radical": 280,
    "surd": 290,
    "fraction": 15,
    "mixedFraction": 30,
    "namedFunction": 200,
    "bracketedExpression": 300,
    "unaryOperation": 250,
    "vector":180,
    "complexNumber":160,
}

class App extends Application {
    constructor(canvasId) {
        super(canvasId);

        this.nodeTree = null;

        this.canvasSizingWidth = "fixed";
        this.canvasSizingHeight = "fixed";

        this.fixedWidth = 1200;
        this.fixedHeight = 1000;

        this.columnSpacing = 100;
        this.rowSpacing = 500;
          this.nodeMarginX = 50;
          this.nodeMarginY = 35;
    }

    initialise() {
        super.initialise();

        this.graphics = new GraphicsContext(this.context);
    }

    setNodeTree(nodeTree) {
        this.nodeTree = nodeTree;

        if (this.nodeTree !== null) {
            this.nodeTree.position = v2(this.width / 2, this.height / 5);
            this.setColumnWidths(this.nodeTree);
            this.setSubnodePositions(this.nodeTree);
        }
    }

    setColumnWidths(node) {
        var w1 = 0;

        node.subnodes.forEach(n => {
            this.setColumnWidths(n);
            w1 += n.columnWidth;
        });

        w1 += (node.subnodes.length - 1) * this.columnSpacing;

        var size1 = this.graphics.measureText(node.title, "Didot", 90);
        var size2 = this.graphics.measureText(node.asciiMath, "Courier New", 70);

        var w2 = Math.max(size1.width, size2.width) / 2 + 2 * this.nodeMarginX;

        node.columnWidth = Math.max(w1, w2);
    }

    setSubnodePositions(node) {
        var x1 = 0;

        node.subnodes.forEach(n => {
            x1 += n.columnWidth;
            n.position = node.position.add(v2(-node.columnWidth + this.columnSpacing / 2 + x1, this.rowSpacing));
            this.setSubnodePositions(n);
            x1 += n.columnWidth + this.columnSpacing;
        });
    }

    drawNode(graphics, node) {
        var fs1 = 90;
        var fs2 = 70;
        var fn1 = "Didot";
        var fn2 = "Courier New";

        var size1 = graphics.measureText(node.title, fn1, fs1);
        var size2 = graphics.measureText(node.asciiMath, fn2, fs2);

        var w1 = Math.max(size1.width, size2.width) / 2 + 100;
        var h1 = fs1 / 2 + fs2 / 2 + 70;

        var e1 = node.position.translate(-w1, -h1);
        var e2 = node.position.translate(w1, -h1);
        var e3 = node.position.translate(w1, h1);
        var e4 = node.position.translate(-w1, h1);

        var hue = nodeColours[node.type];

        if (node.supernode != null) {
            var e5 = node.supernode.position.translate(0, h1);
            var e6 = node.position.translate(0, -h1);
            graphics.drawLine(e5, e6, "hsla(" + hue + ", 0%, 50%, 0.3)", 8);
        }

        var e7 = node.position.translate(0, -fs2 / 2 - 20);
        var e8 = node.position.translate(0, fs2 / 2 + 20);

        var u1 = v2(0, 20);

        graphics.drawPath([e1.add(u1), e2.add(u1), e3.add(u1), e4.add(u1), e1.add(u1)], "hsla(" + hue + ", 0%, 50%, 0.2)", "", 0);
        graphics.drawPath([e1, e2, e3, e4, e1], "hsl(" + hue + ", 50%, 45%)", "", 0);
        graphics.drawText(node.title, e7, "middlecentre", 0, fn1, fs1, "#ffffff");
        graphics.drawText(node.asciiMath, e8, "middlecentre", 0, fn2, fs2, "#ffffff");

        node.subnodes.forEach(n => this.drawNode(graphics, n));
    }

    draw() {
        this.graphics.clear(this.fixedWidth * this.resolutionFactor, this.fixedHeight * this.resolutionFactor);

        if (this.nodeTree !== null) {
            this.drawNode(this.graphics, this.nodeTree);
        }
    }
}

var app = new App("nodeTreeCanvas");

var rp = new responseparsing.ResponseParser();

window.addEventListener("load", function () {

    var input = document.getElementById("input1");
    var output = document.getElementById("output1");
    var katexOutput = document.getElementById("katexOutput1");
    var asciiMathOutput = document.getElementById("asciiMathOutput1");

    input.onkeyup = function (e) {
        var parseResult = rp.getParseResult(input.value.toString());

        console.log(parseResult);

        app.setNodeTree(parseResult);

        var cache = [];
        output.innerText = JSON.stringify(parseResult, function (key, value) {
            if (typeof value === "object" && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }
            return value;
        }, 4);
        cache = null;

        if (parseResult !== null) {
            asciiMathOutput.innerText = "ASCIIMath: " + parseResult.asciiMath;
            katex.render(parseResult.latex, katexOutput);
        }
        else {
            asciiMathOutput.innerText = "ASCIIMath: ";
            katex.render("", katexOutput);
        }

    }

});