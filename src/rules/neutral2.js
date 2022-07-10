const RGX = require("../utils/_general_regex");
const DICT = require("../utils/_dict");

const { denormalize, normalize } = require("./../utils/_normalize");
const STOPPER = new RegExp("(\\n|\\.|\\,|\\;|\\:|\\)|(and))|$", "gm");
const RGX_NEUTRAL_FULL = new RegExp(`${RGX.CITEND.source}(\\s*${RGX.PINPOINT.source})?(\\s*of\\s+${RGX.DATE_DDMMMMYYYY.source})?(\\(${RGX.DATE_DDMMMMYYYY.source}\\))?`, "g");

const RGX_UNUSUAL_FULLDATE = new RegExp(`,\\s+${RGX.FULL_COURTNAME.source},\\s+${RGX.DATE_DDMMMMYYYY.source}`, "g");
const RGX_PARTY_ONLY = new RegExp(`${RGX.PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${RGX.PARTY_NAME.source}`);
const PREFIX = new RegExp(`((\\. +|\:|\\(|\\s|^)(${DICT.prefix.map(t => `(${t})`).join('|')})\\s)|^|\\n|\\:|\\.\\s+`, "gm");

const inc_matching = (text, RGX_PATTERN) => {
    let stops = [0, ...Array.from(text.matchAll(STOPPER), m => m.index)];
    let candidates = [];
    const len = text.length;

    candidates = Array.from(text.matchAll(RGX_PATTERN));
    candidates = candidates.map((m, i) => {
        const prev_match = i > 0 ? candidates[i - 1]: 0;
        return {
            found_in: text.slice(prev_match.index , m.index),
            found_text: m[0],
            start: m.index,
        }
    });

    candidates = candidates.map(({ found_text, found_in, start }, i) => {
        const start_pos = Array.from(found_in.matchAll(PREFIX), m => m[0].length + m.index);
        const subtext = start_pos.map(s => found_in.slice(s))

        let j = 0;
        while (j < subtext.length) {
            const match = subtext[j].match(RGX_PARTY_ONLY)
            if (match)
                return `${subtext[j].slice(match.index)}${found_text}`.trim();
            j++;
        }
        return denormalize(found_text);
    })

    return candidates
}

const cit_neutral2 = (text) => {
    const with_party = inc_matching(text, RGX_NEUTRAL_FULL);
    const unusual_full_date = inc_matching(text, RGX_UNUSUAL_FULLDATE);
    return [...new Set([...with_party, ...unusual_full_date])];
}

module.exports = { cit_neutral2 };

const test_case = require('./../../dataset/dataset.json');
