const { normalize } = require("./utils/_normalize");
const { cit_neutral } = require("./rules/neutral");
const { cit_party_only, cit_party_date, cit_party_unreported } = require("./rules/party_only");
const { cit_short } = require("./rules/short");

/**
* Given text as input, this function will capture any case citation.
* @function annotate
* @param {String} text input raw text
* @param {[String]} rules list of citation rules or function to be applied (cit_neutral, cit_party_only, cit_party_date, cit_party_unreported, cit_short)
* @return {[String]} list of captured citation
*/
const annotate = (text, rules) => {
    // normalize text
    text = normalize(text);

    if (!rules) {
        rules = [
            cit_neutral,
            cit_party_only,
            cit_party_date,
            cit_party_unreported,
            cit_short
        ];
    } else {
        rules = rules.map(fun => eval(fun));
    }

    let citations = [];
    rules.forEach(apply => {
        citations = citations.concat(apply(text));
    });

    return [...new Set(citations)];
}

// console.log(annotate("in Anderson v Davis [1993] PIQR Q87, when he"));
module.exports = annotate;

annotate()