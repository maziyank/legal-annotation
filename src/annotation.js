const normalize = (txt) => {
    txt = txt.replace("see, generally,", "see");
    txt = txt.replace("See, generally,", "see");
    txt = txt.replace("see,", "see");
    txt = txt.replace("See,", "see");
    txt = txt.replace("see also ", "see ");
    txt = txt.replace("See also ", "see ");
    txt = txt.replace(/\,?\sand\s/gm, " and ");
    txt = txt.replace(/and on/gm, '\n');
    txt = txt.replace(/and in/gm, '\n');
    txt = txt.replace(/\:\s*/gm, '\n');
    txt = txt.replace(/;/gm, '\n');

    // split if `and` found 
    match_and_ = Array.from(txt.matchAll(RGX_AND));
    if (match_and_) {
        match_and_.forEach(ma => {
            index_and_ = ma.index + ma[0].length;
            txt = txt.substring(0, index_and_) + '\n' + txt.substring(index_and_);
        })
    }

    // preserve
    txt = txt.replace(/(\(\S+\))(?=.*\sv\.?\s)/gm, x => x.replace(/\(|\)/g, '-'));
    txt = txt.replace(/(\(\S+\))(?=.*((\[\d{4}\])|(\(\d{4}\))|(\d{4})))/gm, x => x.replace(/\(|\)/g, '-'));
    txt = txt.replace(/(?<=[A-Z]\w+)(\sof\s)(?=[A-Z])/gm, x => x.replace(' of ', ' %OF% '));
    return txt;
}

const denormalize = (txt) => {
    if (!txt) return
    txt = txt.replace(/\-\S+\-/gm, x => `(${x.slice(1, x.length - 1)})`);
    txt = txt.replace(' %OF% ', ' of ');

    // refine 'at digit' in the end of citation
    txt = txt.replace(/((\sat\s)|(\sat\spp\s))(((\[|\()\d+(\]|\)))|\d+)$/g, "")
    txt = txt.trim();
    return txt;
}

// General Part
const RGX_PREFIX = new RegExp("((\\. +|\:|\\(| |^)((see)|(but)|(in)|(of)|(applied)|(appeal)|(accord)|(cites)|(cite)|(cited)|(on)|(by)|(at)|(with)|(to)) )|\\(|^|\\n", "gm");
const RGX_YEAR = new RegExp("((\\[\\d{4}\\])|(\\(\\d{4}\\))|\\d{4})");
const RGX_V = new RegExp("(\\sv\\.?\\s)");
const RGV_NUM_OR_SLASHEDNUM = new RegExp("(\\d+(\\/\\d+)*)");
// Various Citation
const RGX_NEUTRAL = new RegExp(`${RGX_YEAR.source}\\s([A-Z]+(\\s+([A-Z]\\w+))*((\\s+\\([A-Z]\\w+\\)))*\\s+${RGV_NUM_OR_SLASHEDNUM.source}((\\s+\\([A-Z]\\w+\\)))*)`);
const RGX_REPORT = new RegExp(`${RGX_YEAR.source}\\s(\\d+\\s(\\w+\\s){1,4}\\d+(\\s\\([A-Z]\\w+\\))*)`);
const RGX_UNUSUAL_1 = new RegExp("([A-Z]+\\/\\d+\\/\\d+\\/[A-Z]+)");
const RGX_UNUSUAL_2 = new RegExp("((\\(\\w+\\/\\d+\\/\\d+\\)))");

const RGX_STOPPER = new RegExp("(?=\\s|$|\\n|\\.|\\,|\\;|\\:|\\))");
const RGX_AND = new RegExp(`(${RGX_NEUTRAL.source}|${RGX_REPORT.source}|${RGX_UNUSUAL_1.source}|${RGX_UNUSUAL_2.source}${RGX_STOPPER.source})(\\s+and\\s+)`, "gm");
const RGX_CITEND = new RegExp(`(${RGX_NEUTRAL.source}|${RGX_REPORT.source}|${RGX_UNUSUAL_1.source}|${RGX_UNUSUAL_2.source})`, "g");

function rule1(text) {
    const RGX_NEUTRAL_FULL = new RegExp(`${RGX_V.source}.*\\s${RGX_CITEND.source}`, "g");
    let citations = [];
    cit_matches = Array.from(text.matchAll(RGX_NEUTRAL_FULL));
    prefix_match = Array.from(text.matchAll(RGX_PREFIX), match => match);

    if (cit_matches) {
        const candidates = cit_matches.map(cit => {
            const candidate = prefix_match.filter(pre => pre.index < cit.index);
            if (!candidate) {
                return false
            }
            const final_candidate = candidate[candidate.length - 1]
            return [final_candidate.index + final_candidate[0].length, cit.index + cit[0].length];
        });
  
        if (candidates) {
            citations = candidates.map(s => text.slice(s[0], s[1]));
            citations = citations.map(item => denormalize(item));
        }
    }

    return citations;
}

function annotate(text) {
    // normalize text
    text = normalize(text);

    const rules = [rule1];
    let citations = [];
    rules.forEach(apply => {
        citations = citations.concat(apply(text));
    });

    return [...new Set(citations)];
}

console.log(annotate("No question of proof on the civil or criminal standard arises in that context: Dhayakpa v Minister for Immigration and Ethnic Affairs (1995) 62 FCR 556 at 563 per French J; Ovcharuk v Minister for Immigration and Multicultural Affairs (1998) 153 ALR 385 at 388 per Marshall J and on appeal Minister for Immigration and Multicultural Affairs v Ovcharuk (1998) 88 FCR 173 at 179; 158 ALR 289 at 294–5; 51 ALD 549 at 554 per Whitlam J. See also Arquita v Minister for Immigration and Multicultural Affairs (2000) 106 FCR 465 at 476; 63 ALD 321 at 331–2 where Weinberg J reviewed the authorities"));
module.exports = annotate;