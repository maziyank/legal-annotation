const RGX  = require("./../utils/_general_regex");
const { denormalize } = require("./../utils/_normalize");

/**
* Given text as input, capture neutral citation (i.e. SWP v Deane [2010] EWCA Civ 699)
* @function cit_neutral
* @param {String} text input raw text
* @return {[String]} list of captured citation
*/

const cit_neutral = (text) => {
    const RGX_NEUTRAL_FULL = new RegExp(`${RGX.V.source}.{1,100}\\s+${RGX.CITEND.source}(\\s*${RGX.PINPOINT.source})?(\\s*of\\s+${RGX.DATE_DDMMMMYYYY.source})?`, "gm");
    const RGX_NOPARTY_FULL = new RegExp(`.*\\s+${RGX.CITEND.source}(\\s*of\\s+${RGX.DATE_DDMMMMYYYY.source})?`, "gm");
    const RGX_UNUSUAL_FULLDATE = new RegExp(`,\\s+${RGX.FULL_COURTNAME.source},\\s+${RGX.DATE_DDMMMMYYYY.source}`, "gm");

    const apply = (TYPE) => {
        let citations = [];
        cit_matches = Array.from(text.matchAll(TYPE));
        prefix_match = Array.from(text.matchAll(RGX.PREFIX));
        if (cit_matches && prefix_match) {
            const candidates = cit_matches.map(cit => {
                const candidate = prefix_match.filter(pre => pre.index < cit.index);
                if (!candidate || candidate.length == 0) {
                    return false;
                }
                const final_candidate = candidate[candidate.length - 1];
                return [final_candidate.index + final_candidate[0].length, cit.index + cit[0].length];
            });

            if (candidates) {
                citations = candidates.map(s => text.slice(s[0], s[1]));
                citations = citations.map(item => denormalize(item));
            }
        }
        return citations;
    }

    const with_party = apply(RGX_NEUTRAL_FULL);
    const without_party = apply(RGX_NOPARTY_FULL).filter(cit => !RGX.V.test(cit));
    const unusual_full_date = apply(RGX_UNUSUAL_FULLDATE);

    return [...new Set([...with_party, ...without_party, ...unusual_full_date])];
}

module.exports = {cit_neutral};