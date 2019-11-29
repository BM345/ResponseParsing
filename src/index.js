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