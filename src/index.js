const { normalize } = require("./utils/_normalize");
const { cit_neutral } = require("./rules/neutral");
const { cit_party_only, cit_party_date, cit_party_unreported } = require("./rules/party_only");
const { cit_short } = require("./rules/short");

/** List of rules to be applied */
const NEUTRAL = cit_neutral;
const PARTY_ONLY = cit_party_only;
const PARTY_DATE = cit_party_date;
const PARTY_UNREPORTED = cit_party_unreported;
const SHORT = cit_short;

/**
* Given text as input, this function will capture any case citation.
* @function apply
* @param {String} text input raw text
* @param {[String]} applied_rules list of citation rules or function to be applied (default: ["NEUTRAL", "PARTY_ONLY", "PARTY_DATE", "PARTY_UNREPORTED", "SHORT"])
* @return {[String]} list of captured citation
*/

const annotate = (text, applied_rules = [NEUTRAL, PARTY_ONLY, PARTY_DATE, PARTY_UNREPORTED, SHORT]) => {
    return new Promise(function (resolve, reject) {
        try {
            const normalized_text = normalize(text);
            applied_rules = applied_rules.map(fun => eval(fun));
            const citations = applied_rules.reduce((acc, fun) => acc.concat(fun(normalized_text)), []);
            resolve([...new Set(citations)]);
        } catch (error) {
            reject(error);
        }

    })
}

module.exports = annotate;



// console.log(annotate(normalize("DPP v. Walsh (Court of Appeal, 26th February 2016)")));