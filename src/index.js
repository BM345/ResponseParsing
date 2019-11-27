import * as rp from "./responseparsing.js";

var validator = new rp.Validator();

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

    validator.addInput(i1, "integer", ko1, o1, sb1);
    validator.addInput(i2, "decimalNumber", ko2, o2, sb2);
    validator.addInput(i3, "fraction", ko3, o3, sb3);
});