const { normalize } = require("./utils/_normalize");
// const { cit_neutral } = require("./rules/neutral");
const { cit_neutral2 } = require("./rules/neutral2");
const { cit_party_only, cit_party_date, cit_party_unreported } = require("./rules/party_only");
const { cit_short } = require("./rules/short");

/**
* Given text as input, this function will capture any case citation.
* @function annotate
* @param {String} text input raw text
* @param {[String]} rules list of citation rules or function to be applied (default: ["cit_neutral", "cit_party_only", "cit_party_date", "cit_party_unreported", "cit_short"])
* @return {[String]} list of captured citation
*/
const annotate = (text, rules = [cit_neutral2, cit_party_only, cit_party_date, cit_party_unreported, cit_short]) => {
    // normalize text
    text = normalize(text);
    rules = rules.map(fun => eval(fun));
    let citations = [];
    rules.forEach(apply => {
        citations = citations.concat(apply(text));
    });

    return [...new Set(citations)];
}

module.exports = annotate;

// Sample Fail Number 40, 82, 88, 97, 101, 123
