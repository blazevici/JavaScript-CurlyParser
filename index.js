"use strict";

document.addEventListener("DOMContentLoaded", () => { 

    const arr = [];

    function JSparser() {

        getFile("primjer1.txt").then(data => parse(data));
        getFile("primjer2.txt").then(data => parse(data));

        console.log(arr);
    }
    JSparser();

    async function getFile(file) {

        let response = await fetch(file);
        let data = response.text();
        return data;
    }

    function parse(data) {

        while(data.search(/\{/g) != -1) {
            data = parseCurly(data);
        }
    }

    function parseCurly(data) {   

        let tempData = data;
        let curly = getCurly(data);
        curly = curly.filter(element => !(element.includes("{/")));

        for(let i = 0; i < curly.length; i++) {
            //console.log(curly[i]);

            let elementType = "";
            let attributes = [];
            let elementContent = ""; 
            
            let beginning = tempData.indexOf(curly[i]);

            elementType = tempData.substring(beginning + 1, tempData.indexOf("}"));
            elementType = getWord(elementType);

            let tmpCurly = curly[i].replace(/[¶\r\n\t]/g, " ").replace(/[”]/g, "\"");
            let attributesExist = getAttributes(curly[i]);

            if(attributesExist) {
                parseAttributes(tmpCurly, attributesExist, attributes);
            }

            if (!curly[i].includes("/}")) {
                elementContent = tempData.substring(tempData.indexOf("}"), tempData.indexOf("{/")).slice(1);
            } else {
                elementContent = "";
            }

            //console.log(tempData);
            tempData = tempData.slice(tempData.indexOf(curly[i + 1])).trim();
            
            arr.push({"type": elementType, "attributes": attributes, "content": elementContent});
        }

        return tempData;
    }

    function getCurly(string) {

        let pattern = /{([^}]+)}/g;
        string = string.match(pattern);
        return string;
    }

    function getBetweenQuotes(string) {

        let pattern = /[”"'](.*?)[”"']/g;
        string = string.match(pattern).toString();

        if(string.toString().includes(",")) {
            string = string.slice(0, string.indexOf(","));
        }
        return string.slice(1, -1).trim();
    }

    function getWord(string) {

        let pattern = /\b(\w*\w*)\b/g;
        string = string.match(pattern);
        let word = string.toString();
        let firstWord = word.substring(0, word.indexOf(","));
        return firstWord;
    }

    function getAttributes(string) {

        let pattern = /(\w+)[=]/g;
        string = string.match(pattern);

        if(string) {
            return string.toString();
        }
    }

    function parseAttributes(element, attributesExist, attributes) {

        while(attributesExist) {
            let attributeStart = checkAttribute(element);
            // console.log("početni="+element);
            let equalSign = element.indexOf("=");

            let tmpAtrribute = element.substring(attributeStart, equalSign).trim();
            // console.log("attribute="+tmpAtrribute);
            let tmpValue = getBetweenQuotes(element);
            // console.log("value="+tmpValue)

            element = element.slice(element.indexOf('"', equalSign + 2) + 1).trim();
            // console.log("izrezani="+element);

            if(attributesExist.indexOf(",") > -1) {
                attributesExist = attributesExist.slice(attributesExist.indexOf(",") + 1);
            } else {
                attributesExist = "";
            }

            attributes.push({[tmpAtrribute]: tmpValue});
        }
    }

    function checkAttribute(element) {

        if (element.includes(" ")) {
            element = element.indexOf(" ");
        }

        return element;
    }

});