"use strict";

document.addEventListener("DOMContentLoaded", () => { 

    var arr = [];

    function JSparser() {
        getFile("primjer1.txt").then(data => parse(data));
        getFile("primjer2.txt").then(data => parse(data));

        // ispis polja s objektima
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
        /*let i = 1;
        while(i > 0) {
            data = parseCurly(data);
            i--;
        }*/
    }

    function parseCurly(data) {       
        var tempData = data;
        var content = getContent(data);
        content = content.filter(element => !(element.includes("{/")));

        for(let i = 0; i < content.length; i++) {
            console.log(content[i]);

            var type;
            var attributes = [];
            var elementContent; 
            
            let beginning = tempData.indexOf(content[i]);

            type = tempData.substring(beginning + 1, tempData.indexOf("}"));
            type = getWord(type);
            
            if(content[i].indexOf("=") > -1) {
                let attributeStart = checkAttribute(content[i]);

                let tmpAtrribute = content[i].substring(attributeStart, content[i].indexOf("=")).trim();
                let tmpValue = getBetweenQuotes(content[i]);

                attributes.push({[tmpAtrribute]: tmpValue});
            }

            tempData = tempData.slice(tempData.indexOf(content[i + 1])).trim();
            
            arr.push({"type": type, "attributes": attributes, "content": elementContent});
        }

        return tempData;
    }

    function getContent(string) {
        let pattern = /{([^}]+)}/g;
        string = string.match(pattern);
        return string;
    }

    function getBetweenQuotes(string) {
        let pattern = /[”"](.*?)[”"]/g;
        string = string.match(pattern);
        return string.toString().slice(1, -1);
    }

    function getWord(string) {
        let pattern = /\b(\w*\w*)\b/g;
        string = string.match(pattern);
        let word = string.toString();
        let firstWord = word.substring(0, word.indexOf(","));
        return firstWord;
    }

    function checkAttribute(element) {
        if (element.includes(" ")) {
            var attributeStart = element.indexOf(" ");
        } else if (element.indexOf("\n") > -1) {
            var attributeStart = element.indexOf("\n")
        }

        return attributeStart;
    }

});