class RPNode{constructor(){this.supernode=null;this.depth=0;this.type="";this.subtype="";this.text="";this.latex="";this.asciiMath="";this.isComplete=false;this.start=0;this.end=0}get length(){return this.end-this.start}get subnodes(){return[]}setDepth(depth=0){this.depth=depth;var that=this;this.subnodes.forEach(n=>{n.supernode=that;n.setDepth(depth+1)})}}class RPNumberNode extends RPNode{constructor(){super();this.type="number";this.integralPart="";this.decimalPart="";this.sign="";this.signIsExplicit=false;this.numberOfLeadingZeros=0;this.numberOfTrailingZeros=0;this.minimumNumberOfSignificantFigures=0;this.maximumNumberOfSignificantFigures=0;this.numberOfDecimalPlaces=0}}class RPFractionNode extends RPNode{constructor(){super();this.type="fraction";this.numerator=null;this.denominator=null}get subnodes(){return[this.numerator,this.denominator]}}class RPMixedFractionNode extends RPNode{constructor(){super();this.type="mixedFraction";this.wholePart=null;this.fractionPart=null}get subnodes(){return[this.wholePart,this.fractionPart]}}class RPRadicalNode extends RPNode{constructor(){super();this.type="radical";this.radix=2;this.radixIsImplicit=true;this.radicand=null}get subnodes(){return[this.radicand]}}class RPIdentifierNode extends RPNode{constructor(){super();this.type="identifier"}}class RPOperatorNode extends RPNode{constructor(){super();this.type="operator"}get precedence(){return"+-*/^".indexOf(this.text)}}class RPBinomialOperationNode extends RPNode{constructor(){super();this.type="binomialOperation";this.operand1=null;this.operand2=null}}class RPAdditionNode extends RPBinomialOperationNode{constructor(){super();this.subtype="addition"}}class RPSubtractionNode extends RPBinomialOperationNode{constructor(){super();this.subtype="subtraction"}}class RPMultiplicationNode extends RPBinomialOperationNode{constructor(){super();this.subtype="multiplication"}}class RPDivisionNode extends RPBinomialOperationNode{constructor(){super();this.subtype="division"}}function isAnyOf(characters,character){return characters.split("").filter(c=>c==character).length>0}class Marker{constructor(){this.position=0}copy(){var marker=new Marker;marker.position=this.position;return marker}}class ParserSettings{constructor(){this.removeLeadingZerosFromSimplifiedForms=false;this.addLeadingZeroToDecimalsForSimplifiedForms=true}}class ResponseParser{constructor(){this.settings=new ParserSettings}getParseResult(inputText){var m1=new Marker;var expression=this.parseExpression(inputText,m1);if(expression!==null&&m1.position==inputText.length){expression.setDepth();return expression}return null}anyAt(words,inputText,marker){for(var i=0;i<words.length;i++){var w=words[i];if(inputText.substring(marker.position,marker.position+w.length)==w){return w}}return false}parseExpression(inputText,marker){var operandStack=[];var operatorStack=[];while(marker.position<inputText.length){var node=this.parseBinomialOperator(inputText,marker.copy());if(node===null){node=this.parseMixedFraction(inputText,marker.copy())}if(node===null){node=this.parseFraction(inputText,marker.copy())}if(node===null){node=this.parseSquareRoot(inputText,marker.copy())}if(node===null){node=this.parseNumber(inputText,marker.copy())}if(node===null){node=this.parseIdentifier(inputText,marker.copy())}if(node===null){break}if(node.type=="operator"){for(var i=operatorStack.length-1;i>=0;i--){if(operatorStack[i].precedence>=node.precedence){if(operandStack.length>=2&&operatorStack[i].text=="+"){var additionNode=new RPAdditionNode;additionNode.operand2=operandStack.pop();additionNode.operand1=operandStack.pop();operandStack.push(additionNode)}if(operandStack.length>=2&&operatorStack[i].text=="-"){var subtractionNode=new RPSubtractionNode;subtractionNode.operand2=operandStack.pop();subtractionNode.operand1=operandStack.pop();operandStack.push(subtractionNode)}if(operandStack.length>=2&&operatorStack[i].text=="*"){var multiplicationNode=new RPMultiplicationNode;multiplicationNode.operand2=operandStack.pop();multiplicationNode.operand1=operandStack.pop();operandStack.push(multiplicationNode)}if(operandStack.length>=2&&operatorStack[i].text=="/"){var divisionNode=new RPDivisionNode;divisionNode.operand2=operandStack.pop();divisionNode.operand1=operandStack.pop();operandStack.push(divisionNode)}}}operatorStack.push(node)}else{operandStack.push(node)}marker.position+=node.length}for(var i=operatorStack.length-1;i>=0;i--){if(operandStack.length>=2&&operatorStack[i].text=="+"){var additionNode=new RPAdditionNode;additionNode.operand2=operandStack.pop();additionNode.operand1=operandStack.pop();operandStack.push(additionNode)}if(operandStack.length>=2&&operatorStack[i].text=="-"){var subtractionNode=new RPSubtractionNode;subtractionNode.operand2=operandStack.pop();subtractionNode.operand1=operandStack.pop();operandStack.push(subtractionNode)}if(operandStack.length>=2&&operatorStack[i].text=="*"){var multiplicationNode=new RPMultiplicationNode;multiplicationNode.operand2=operandStack.pop();multiplicationNode.operand1=operandStack.pop();operandStack.push(multiplicationNode)}if(operandStack.length>=2&&operatorStack[i].text=="/"){var divisionNode=new RPDivisionNode;divisionNode.operand2=operandStack.pop();divisionNode.operand1=operandStack.pop();operandStack.push(divisionNode)}}console.log(operandStack);console.log(operatorStack);if(operandStack.length==1){return operandStack[0]}else{return null}}parseBinomialOperator(inputText,marker){var start=marker.position;var c=inputText.charAt(marker.position);if(!isAnyOf("+-*/^",c)){return null}marker.position++;var end=marker.position;var node=new RPOperatorNode;node.text=c;node.latex=c=="*"?"\\times":c;node.asciiMath=c;node.start=start;node.end=end;return node}parseIdentifier(inputText,marker){var start=marker.position;var c=inputText.charAt(marker.position);if(!isAnyOf("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",c)){return null}marker.position++;var end=marker.position;var node=new RPIdentifierNode;node.text=c;node.latex=c;node.asciiMath=c;node.start=start;node.end=end;return node}parseSquareRoot(inputText,marker){var start=marker.position;var functionNames=["sqrt","squareroot","root"];var name=this.anyAt(functionNames,inputText,marker);if(name===false){return null}marker.position+=name.length;var ws1=this.parseWhiteSpace(inputText,marker);if(inputText.charAt(marker.position)!="("){return null}marker.position+=1;var ws2=this.parseWhiteSpace(inputText,marker);var number=this.parseNumber(inputText,marker);var ws3=this.parseWhiteSpace(inputText,marker);if(inputText.charAt(marker.position)!=")"){return null}marker.position+=1;var end=marker.position;var t1=name;var t2=ws1!==null?ws1.text:"";var t3="(";var t4=ws2!==null?ws2.text:"";var t5=number.text;var t6=ws3!==null?ws3.text:"";var t7=")";var node=new RPRadicalNode;node.text=t1+t2+t3+t4+t5+t6+t7;node.latex="\\sqrt{"+number.latex+"}";node.asciiMath="sqrt("+number.asciiMath+")";node.start=start;node.end=end;node.radix=2;node.radixIsImplicit=true;node.radicand=number;return node}parseMixedFraction(inputText,marker){var start=marker.position;var wholePart=this.parseNumber(inputText,marker);if(wholePart===null){return null}var whiteSpace=this.parseWhiteSpace(inputText,marker);if(whiteSpace===null){return null}var fractionPart=this.parseFraction(inputText,marker);if(fractionPart===null){return null}var end=marker.position;var node=new RPMixedFractionNode;node.text=wholePart.text+whiteSpace.text+fractionPart.text;node.latex=wholePart.latex+" "+fractionPart.latex;node.asciiMath=wholePart.asciiMath+" "+fractionPart.asciiMath;node.start=start;node.end=end;node.wholePart=wholePart;node.fractionPart=fractionPart;return node}parseFraction(inputText,marker){var start=marker.position;var numerator=this.parseNumber(inputText,marker);if(numerator===null){return null}var whiteSpace1=this.parseWhiteSpace(inputText,marker);var c=inputText.charAt(marker.position);if(c!=="/"){return null}marker.position+=1;var whiteSpace2=this.parseWhiteSpace(inputText,marker);var denominator=this.parseNumber(inputText,marker);var end=marker.position;var isComplete=denominator===null?false:true;var t1=numerator.text;var t2=whiteSpace1===null?"":whiteSpace1.text;var t3="/";var t4=whiteSpace2===null?"":whiteSpace2.text;var t5=denominator===null?"":denominator.text;var t6=numerator.simplestForm;var t7="/";var t8=denominator===null?"":denominator.simplestForm;var node=new RPFractionNode;node.text=t1+t2+t3+t4+t5;node.latex="\\frac{"+numerator.latex+"}{"+denominator.latex+"}";node.asciiMath="frac "+numerator.asciiMath+" "+denominator.asciiMath;node.start=start;node.end=end;node.isComplete=isComplete;node.numerator=numerator;node.denominator=denominator;return node}parseNumber(inputText,marker){var t="";var start=marker.position;var integralPart="";var decimalPart="";var ts="";var sign="positive";var signIsExplicit=false;var d=inputText.charAt(marker.position);if(d=="+"){ts="+";signIsExplicit=true;marker.position++}else if(d=="-"){ts="-";sign="negative";signIsExplicit=true;marker.position++}var nlz=0;var ntz=0;var nsf=0;var ndp=0;var p=0;var q=0;while(marker.position<inputText.length){var c=inputText.charAt(marker.position);if(isAnyOf("0123456789",c)){t+=c;marker.position++;if(q==0){integralPart+=c}else{decimalPart+=c;ndp++}if(c=="0"&&nsf==0&&q==0){nlz++}else if(c!="0"){nsf+=p;p=0;nsf++}else if(c=="0"&&nsf>0){p++}}else if(c=="."){if(q==0){t+=c;marker.position++;decimalPart+=c;q++}else{break}}else{break}}var allZero=nsf==0&&t.length>0?true:false;if(allZero){sign="zero"}var minimumNSF=0;var maximumNSF=0;if(allZero){minimumNSF=1;maximumNSF=1;if(q>0){ntz=ndp}}else{if(q>0){minimumNSF=nsf+p;maximumNSF=nsf+p;ntz=p}else{minimumNSF=nsf;maximumNSF=nsf+p}}var end=marker.position;var subtype=q==0?"integer":"decimalNumber";var t1="";if(integralPart==""&&(decimalPart==""||decimalPart==".")){t1=""}else if(integralPart==""){if(this.settings.addLeadingZeroToDecimalsForSimplifiedForms){t1="0"}else{t1=""}}else{if(this.settings.removeLeadingZerosFromSimplifiedForms){t1=integralPart.slice(nlz);if(this.settings.addLeadingZeroToDecimalsForSimplifiedForms){t1=t1==""?"0":t1}}else{t1=integralPart}}var t2=decimalPart=="."?"":decimalPart;var simplestForm=allZero?t1+t2:ts+t1+t2;if(ts+t==""){return null}else{var node=new RPNumberNode;node.subtype=subtype;node.text=ts+t;node.integralPart=integralPart;node.decimalPart=decimalPart;node.latex=simplestForm;node.asciiMath=simplestForm;node.start=start;node.end=end;node.sign=sign;node.signIsExplicit=signIsExplicit;node.numberOfLeadingZeros=nlz;node.numberOfTrailingZeros=ntz;node.minimumNumberOfSignificantFigures=minimumNSF;node.maximumNumberOfSignificantFigures=maximumNSF;node.numberOfDecimalPlaces=ndp;return node}}parseWhiteSpace(inputText,marker){var t="";var start=marker.position;while(marker.position<inputText.length){var c=inputText.charAt(marker.position);if(isAnyOf(" \t\n",c)){t+=c;marker.position+=1}else{break}}var end=marker.position;if(t==""){return null}else{return{type:"whiteSpace",text:t,latex:t,asciiMath:t,start:start,end:end,length:t.length,compressedWhiteSpace:" "}}}}class Validator{constructor(){this.inputs=[];this.rp=new ResponseParser;this.controlKeys=["ShiftLeft","ShiftRight","Backspace","Enter","Tab","CapsLock","MetaLeft","MetaRight","AltLeft","AltRight","ControlLeft","ControlRight","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Escape"]}getNewInputValueOnKeyDown(input,e){var length=input.value.length;if(input.selectionStart==length&&input.selectionEnd==length){return input.value+e.key}else{return input.value.slice(0,input.selectionStart)+e.key+input.value.slice(input.selectionEnd,length)}}addInput(input,inputType,katexOutput,validationMessageElement,submitButton){this.inputs.push([input,inputType,katexOutput,validationMessageElement,submitButton]);var that=this;input.onkeydown=function(e){if(that.controlKeys.filter(ck=>e.code==ck).length==0){var t=that.getNewInputValueOnKeyDown(input,e);var parseResult=that.rp.getParseResult(t);console.log(t);console.log(parseResult);if(parseResult===null){e.preventDefault();return}if(inputType=="integer"&&(parseResult.type!="number"||parseResult.subtype!="integer")){e.preventDefault()}if(inputType=="decimalNumber"&&parseResult.type!="number"){e.preventDefault()}if(inputType=="fraction"&&(parseResult.type!="fraction"&&parseResult.type!="number")){e.preventDefault()}if(parseResult!==null){katex.render(parseResult.latex,katexOutput)}else{katex.render("",katexOutput)}}};input.onkeyup=function(e){validationMessageElement.innerText="";var parseResult=that.rp.getParseResult(input.value);if(parseResult!==null){katex.render(parseResult.latex,katexOutput)}else{katex.render("",katexOutput)}};submitButton.onmousedown=function(e){var t=input.value;var parseResult=that.rp.getParseResult(t);console.log(t);console.log(parseResult);validationMessageElement.innerText="";if(inputType=="integer"&&(parseResult===null||parseResult.type!="number"&&parseResult.subtype=="integer")){validationMessageElement.innerText="Your answer must be a whole number."}if(inputType=="decimalNumber"&&(parseResult===null||parseResult.type!="number")){validationMessageElement.innerText="Your answer must be a decimal number or a whole number."}}}}