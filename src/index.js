const { normalize } = require("./utils/_normalize");
const { cit_neutral } = require("./rules/neutral");
const { cit_party_only, cit_party_date, cit_party_unreported } = require("./rules/party_only");
const { cit_short } = require("./rules/short");

const annotate = (text) => {
    // normalize text
    text = normalize(text);

    const rules = [
        cit_neutral,
        cit_party_only,
        cit_party_date,
        cit_party_unreported,
        cit_short
    ];

    let citations = [];
    rules.forEach(apply => {
        citations = citations.concat(apply(text));
    });

    return [...new Set(citations)];
}

// console.log(annotate("in Anderson v Davis [1993] PIQR Q87, when he"));
module.exports = annotate;

