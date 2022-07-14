const RGX = require("../utils/_general_regex");
const DICT = require("../utils/_dict");

const { denormalize, normalize } = require("./../utils/_normalize");
const RGX_NEUTRAL_FULL = new RegExp(`${RGX.CITEND.source}(\\s*${RGX.PINPOINT.source})?(\\s*of\\s+${RGX.DATE_DDMMMMYYYY.source})?(\\(${RGX.DATE_DDMMMMYYYY.source}\\))?`, "g");

const RGX_UNUSUAL_FULLDATE = new RegExp(`,\\s+${RGX.FULL_COURTNAME.source},\\s+${RGX.DATE_DDMMMMYYYY.source}`, "gm");
const RGX_PARTY_ONLY = new RegExp(`${RGX.PARTY_NAME.source}(\\s+[\\–\\-]?v[\\–\\-\\.]?)${RGX.PARTY_NAME.source}`, "g");
const PREFIX = new RegExp(`((\\. +|\:|\\s|^)(${DICT.prefix.map(t => `(${t})`).join('|')})\\s)|^|\\(|\\n|\\:|\\;|(\\.\\s+)`, "gm");

const inc_matching = (text, RGX_PATTERN) => {
    let candidates = [];

    candidates = Array.from(text.matchAll(RGX_PATTERN)).filter(m => !(/[a-z]+(\/[a-z]+)/.test(m[0])));
    candidates = candidates.map((m, i) => {
        const prev_match = i > 0 ? candidates[i - 1].index + candidates[i - 1][0].length : 0;
        return {
            found_in: text.slice(prev_match, m.index),
            found_text: m[0],
            start: m.index,
        }
    });

    candidates = candidates.map(({ found_text, found_in, start }, i) => {
        const start_pos = Array.from(found_in.matchAll(PREFIX), m => m[0].length + m.index);
        const subtext = start_pos.map(s => found_in.slice(s))

        let j = 0;
        while (j < subtext.length) {
            const match = Array.from(subtext[j].matchAll(RGX_PARTY_ONLY));
            if (match && match.length == 1) {
                const num_v = Array.from(subtext[j].matchAll(new RegExp(RGX.V.source, "g"))).length;
                if (num_v == 1)
                    return denormalize(`${subtext[j].slice(match[0].index)}${found_text}`);
            }
            j++;
        }

        return denormalize(found_text);
    }).filter(m => m.length > 5)

    return candidates
}

const cit_neutral2 = (text) => {
    const with_party = inc_matching(text, RGX_NEUTRAL_FULL);
    const unusual_full_date = inc_matching(text, RGX_UNUSUAL_FULLDATE);
    return [...new Set([...with_party, ...unusual_full_date])];
}

module.exports = { cit_neutral2 };



// Sample Fail Number 40, 82, 88, 97, 101, 123
const test_case = require('./../../dataset/dataset.json');


// Sample Fail Number 6, 40, 82, 88, 97, 101, 123, 37
// const no = 71
// console.log({
//     result: cit_neutral2(normalize(test_case.scenarios[no].text)),
//     gt: test_case.scenarios[no].expected
// });




