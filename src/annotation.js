const DICT = {
    prefix: ["on", "see", "appendix to", "in", "applied", "appeal", "accord", "cites", "cite", "refer to", "was said by", "cited", "on", "by", "at", "with", "to", "of", "for"],
    normalizer: [
        {
            "from": "[sS]ee,? generally,",
            "to": "see"
        },
        {
            "from": "[sS]ee also",
            "to": "see"
        },
        {
            "from": "[sS]ee (in|on)",
            "to": "see"
        },
        {
            "from": "[sS]ee, for example,",
            "to": "see"
        },
        {
            "from": "see-",
            "to": "see"
        },
        {
            "from": "(\\.\\s+)In",
            "to": ". in"
        },
        {
            "from": "^In",
            "to": "in"
        },
        {
            "from": "\\,?\\sand\\s",
            "to": " and "
        },
        {
            "from": "and\\s+((on)|(in))",
            "to": "\n"
        },
        {
            "from": "\\:\\s*",
            "to": "\n"
        },
        {
            "from": "\\;",
            "to": "\n"
        },
        {
            "from": "\\s-\\s",
            "to": "\n"
        },
        {
            "from": "\\s+–\\s+",
            "to": "\n"
        },
        {
            "from": "refer to the decision of the \\w+ in",
            "to": "refer to"
        },
        {
            "from": "(\\[a-z]+\\s){2}(\\[a-z]+\\,)",
            "to": "see "
        }
    ],
    "month": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
}

const normalize = (txt) => {
    // normalize word using dictionary
    DICT.normalizer.forEach(({ from, to }) => {
        txt = txt.replace(new RegExp(from, "gm"), to)
    });

    // split if `and` found 
    match_and_ = Array.from(txt.matchAll(RGX_AND));
    if (match_and_) {
        match_and_.forEach((ma,i) => {
            index_and_ = ma.index + ma[0].length;
            txt = txt.substring(0, index_and_+i) + '\n' + txt.substring(index_and_+i);
        })
    }

    // preserve
    txt = txt.replace(/(\(\S+\))(?=.*\sv\.?\s)/gm, x => x.replace(/\(|\)/g, '-'));
    txt = txt.replace(/(\(\S+\))(?=.*((\[\d{4}\])|(\(\d{4}\))|(\d{4})))/gm, x => x.replace(/\(|\)/g, '-'));
    txt = txt.replace(/(?<=[A-Z]\w+)(\sof\s)(?=[A-Z])/gm, x => x.replace(' of ', ' %OF% '));
    txt = txt.replace(/(?<=[A-Z]\w+)(\sfor\s)(?=[A-Z])/gm, x => x.replace(' for ', ' %FOR% '));
    return txt;
}

const denormalize = (txt) => {
    if (!txt) return
    txt = txt.replace(/\-\S+\-/gm, x => `(${x.slice(1, x.length - 1)})`);
    txt = txt.replace(' %OF% ', ' of ');
    txt = txt.replace(' %FOR% ', ' for ');
    txt = txt.trim();
    txt = txt.replace(/,$/, "");
    return txt;
}

// General Part
const RGX_PREFIX = new RegExp(`((\\. +|\:|\\(|\\s|^)(${DICT.prefix.map(t => `(${t})`).join('|')})\\s)|\\(|^|\\n|\\.\\s+`, "gm");
const RGX_YEAR = new RegExp("((\\[\\d{4}\\])|(\\(\\d{4}\\))|\\d{4})");
const RGX_V = new RegExp("(\\s[\\–\\-]?v[\\-\\.]?\\s)");
const RGX_NUM_OR_SLASHEDNUM = new RegExp("(\\d+(\\/\\d+)*(\\,\\s\\d+)*)");
const RGX_PINPOINT = new RegExp(`(((at)|(at pp)|(\\,\\s+para)|(para)|(at para)|(at paragraph))\\s+((\\d+((-\\d+)|(\\,\\s+\\d+))*)|(\\[\\d+\\]((\\s*-\\s*)\\[\\d+\\])*)))`);
const RGX_STOPPER = new RegExp("(?=\\s|$|\\n|\\.|\\,|\\;|\\:|\\))");
const RGX_DATE_DDMMMMYYYY = new RegExp(`(([0-9])|([0-2][0-9])|([3][0-1]))(rd|th|st)?\\s+(${DICT.month.join('|')})\\s+\\d{4}`);
const RGX_FULL_COURTNAME = new RegExp(`(([A-Z][\\w\\-]+\\s)+(Tribunal))`);
const RGX_DIVISION = new RegExp(`((\\([\\w\\d]*\\)))`);
const RGX_COURT_ABBV = new RegExp(`((((\\s[A-Z]\\w*)){1,2})|((\\s([A-Z])([\\\.A-Z])+)))`);
const RGX_PARTY_NAME = new RegExp(`(((\\s|^)+([\\\(\\-]?[A-Z][a-z\\,\\-]*[\\\)\\-]?)(\\s+(of|for|%FOR%|%OF%|and|in|plc|&|the|Co\\.))?)+)`);
const RGX_DATE_UNREPORTED = new RegExp(`(.*${RGX_DATE_DDMMMMYYYY.source}\\,\\s+(unreported))`);

// Various Citation
const RGX_NEUTRAL = new RegExp(`${RGX_YEAR.source}(\\s*${RGX_NUM_OR_SLASHEDNUM.source}?\\s*${RGX_COURT_ABBV.source}?\\s*${RGX_DIVISION.source}?\\s*${RGX_NUM_OR_SLASHEDNUM.source}\\s*${RGX_DIVISION.source}?)`);
const RGX_REPORT = new RegExp(`${RGX_YEAR.source}\\s+(\\d+\\s(\\w+\\s){1,4}\\d+(\\s\\([A-Z]\\w+\\))*)`);
// const RGX_UNUSUAL_1 = new RegExp(`([A-Z0-9]+(\\/([A-Z0-9]+))+)`);
const RGX_UNUSUAL_2 = new RegExp(`((\\(?\\w+(\\/\\w+)+\\)?))(\\s+of\\s+${RGX_DATE_DDMMMMYYYY.source})?`);

const RGX_CITEND = new RegExp(`(${RGX_NEUTRAL.source}|${RGX_REPORT.source}|${RGX_UNUSUAL_2.source}|(\\\(${RGX_DATE_UNREPORTED.source}\\\)))`, "g");
const RGX_AND = new RegExp(`(${RGX_NEUTRAL.source}|${RGX_REPORT.source}|${RGX_UNUSUAL_2.source}${RGX_STOPPER.source})(\\.|(\\s+and\\s+))`, "gm");

function rule3(text) {
    const RGX_PARTY_WITH_DATE = new RegExp(`${RGX_PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${RGX_PARTY_NAME.source}\\s+\\\(${RGX_DATE_DDMMMMYYYY.source}\\\)`, 'gm');
    const matched = Array.from(text.matchAll(RGX_PARTY_WITH_DATE));
    const result = matched.map(m => denormalize(m[0]));
    return result
}

function rule4(text) {
    const RGX_PARTY_UNREPORTED = new RegExp(`${RGX_PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${RGX_PARTY_NAME.source}\\s+\\\(${RGX_DATE_UNREPORTED.source}\\\)`, 'gm');
    const matched = Array.from(text.matchAll(RGX_PARTY_UNREPORTED));
    const result = matched.map(m => denormalize(m[0]));
    return result
}

function rule2(text) {
    const RGX_TEST = new RegExp(`${RGX_PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${RGX_PARTY_NAME.source}(.{0,25})`, 'gm');
    const RGX_PARTY_ONLY = new RegExp(`${RGX_PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${RGX_PARTY_NAME.source}`, 'gm');
    const matched = Array.from(text.matchAll(RGX_TEST));

    const result = matched.filter(m => !RGX_YEAR.test(m) && !RGX_UNUSUAL_2.test(m))
        .map(m=> RGX_PARTY_ONLY.exec(m))
        .filter(m=> m)
        .map(m => denormalize(m[0].trim()))
        .map(m => m.replace(/\s(of|for|and|&|in|plc|the)$/gm), '');

    return result
}

function rule1(text) {
    const RGX_NEUTRAL_FULL = new RegExp(`${RGX_V.source}.{1,100}\\s+${RGX_CITEND.source}(\\s*${RGX_PINPOINT.source})?`, "gm");
    const RGX_NOPARTY_FULL = new RegExp(`.*\\s+${RGX_CITEND.source}`, "gm");
    const RGX_UNUSUAL_FULLDATE = new RegExp(`,\\s+${RGX_FULL_COURTNAME.source},\\s+${RGX_DATE_DDMMMMYYYY.source}`, "gm");

    function apply(RGX) {
        let citations = [];
        cit_matches = Array.from(text.matchAll(RGX));
        prefix_match = Array.from(text.matchAll(RGX_PREFIX));
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
    const without_party = apply(RGX_NOPARTY_FULL).filter(cit => !RGX_V.test(cit));
    const unusual_full_date = apply(RGX_UNUSUAL_FULLDATE);
    
    return [...new Set([...with_party, ...without_party, ...unusual_full_date])];
}

function annotate(text) {
    // normalize text
    text = normalize(text);
    const rules = [rule1, rule2, rule3, rule4];
    let citations = [];
    rules.forEach(apply => {
        citations = citations.concat(apply(text));
    });

    return [...new Set(citations)];
}

console.log(annotate("Mr Tinnion drew our attention to those passages in paragraphs 122 and 123 and suggested that they were not an accurate statement of the law. More particularly, Mr Tinnion submitted that the law had moved on and had been developed in a series of recent authorities. He took us in turn to three such authorities. First, the decision of this Employment Appeal Tribunal in Samsung Electronics v Monte-D’Cruz UKEAT/0039/11/DM."))
module.exports = annotate;

