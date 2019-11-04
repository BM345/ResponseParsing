
function isAnyOf(characters, character) {
    return (characters.split("").filter(c => c == character).length > 0);
}


class Marker {
    constructor() {
        this.position = 0;
    }
}

class ResponseParser {

    getParseResult(inputText) {
        var marker = new Marker();

        return this.parseSignedInteger(inputText, marker);
    }

    parseSignedInteger(inputText, marker) {
        var sign = this.parseSign(inputText, marker);
        var integer = this.parseInteger(inputText, marker);

        if (integer === null) {
            return null;
        }
        else {
            if (sign === null) {
                return {
                    "type": "signedInteger",
                    "text": integer.text,
                    "start": integer.start,
                    "end": integer.end,
                    "length": integer.length,
                    "numberOfLeadingZeros": integer.numberOfLeadingZeros,
                    "sign": "positive",
                    "signIsExplicit": false
                };
            }
            else {
                var s = (sign.name == "plus") ? "positive" : "negative";

                return {
                    "type": "signedInteger",
                    "text": sign.text + integer.text,
                    "start": sign.start,
                    "end": integer.end,
                    "length": sign.length + integer.length,
                    "numberOfLeadingZeros": integer.numberOfLeadingZeros,
                    "sign": s,
                    "signIsExplicit": true
                };
            }
        }
    }

    parseSign(inputText, marker) {
        var c = inputText.substr(marker.position, 1);

        if (c == "+") {
            marker.position += 1;

            return {
                "type": "sign",
                "name": "plus",
                "text": c,
                "start": marker.position,
                "end": marker.position + 1,
                "length": 1,
            }
        }
        else if (c == "-") {
            marker.position += 1;

            return {
                "type": "sign",
                "name": "minus",
                "text": c,
                "start": marker.position,
                "end": marker.position + 1,
                "length": 1,
            }
        }
        else {
            return null;
        }
    }

    parseInteger(inputText, marker) {
        var t = "";
        var start = marker.position;

        while (marker.position < inputText.length) {
            var c = inputText.substr(marker.position, 1);

            if (isAnyOf("0123456789", c)) {
                t += c;
                marker.position += 1;
            }
            else {
                break;
            }
        }

        var end = marker.position;
        var n = 0;

        for (var i = 0; i < t.length; i++) {
            if (t.substr(i, 1) == "0") {
                n++;
            }
            else {
                break;
            }
        }

        if (t == "") {
            return null;
        }
        else {
            return {
                "type": "integer",
                "text": t,
                "start": start,
                "end": end,
                "length": t.length,
                "numberOfLeadingZeros": n
            };
        }
    }

    parseWhiteSpace(inputText, marker) {
        var t = "";
        var start = marker.position;

        while (marker.position < inputText.length) {
            var c = inputText.substr(marker.position, 1);

            if (isAnyOf(" \t\n", c)) {
                t += c;
                marker.position += 1;
            }
            else {
                break;
            }
        }

        var end = marker.position;

        if (t == "") {
            return null;
        }
        else {
            return {
                "type": "whiteSpace",
                "whiteSpace": t,
                "start": start,
                "end": end,
                "length": t.length,
                "compressedWhiteSpace": " "
            };
        }
    }
}

var rp = new ResponseParser();

window.addEventListener("load", function () {
    var i1 = document.getElementById("input1");

    i1.onkeyup = function () {
        console.log(rp.getParseResult(i1.value));
    }
});