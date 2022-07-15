const RGX = require("../utils/_general_regex");

const { denormalize, normalize } = require("../utils/_normalize");
const RGX_NEUTRAL_FULL = new RegExp(`${RGX.CITEND.source}(\\s*${RGX.PINPOINT.source})?(\\s*of\\s+${RGX.DATE_DDMMMMYYYY.source})?(\\(${RGX.DATE_DDMMMMYYYY.source}\\))?`, "g");
const RGX_UNUSUAL_FULLDATE = new RegExp(`,\\s+${RGX.FULL_COURTNAME.source},\\s+${RGX.DATE_DDMMMMYYYY.source}`, "gm");
const RGX_PARTY_ONLY = new RegExp(`${RGX.PARTY_NAME.source}(\\s+[\\–\\-]?v[\\–\\-\\.]?)${RGX.PARTY_NAME.source}`, "g");

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
        const start_pos = Array.from(found_in.matchAll(RGX.PREFIX), m => m[0].length + m.index);
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

const cit_neutral = (text) => {
    const with_party = inc_matching(text, RGX_NEUTRAL_FULL);
    const unusual_full_date = inc_matching(text, RGX_UNUSUAL_FULLDATE);
    return [...new Set([...with_party, ...unusual_full_date])];
}

module.exports = { cit_neutral };


// const test_case = require('../../dataset/dataset.json');
// Sample Fail Number 6, 40, 82, 88, 97, 101, 123, 37, 129
// const no = 129
// console.log({
//     result: cit_neutral(normalize(test_case.scenarios[no].text)),
//     gt: test_case.scenarios[no].expected
// });




