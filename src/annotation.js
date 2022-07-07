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
        }
    ],
    "month": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octiber", "November", "December"]
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
const RGX_NUM_OR_SLASHEDNUM = new RegExp("(\\d+(\\/\\d+)*)");
const RGX_PINPOINT = new RegExp(`(((at)|(at pp))\\s+(\\d+(-\\d+)*)|(\\[\\d+\\]((\\s*-\\s*)\\[\\d+\\])*))`);
const RGX_STOPPER = new RegExp("(?=\\s|$|\\n|\\.|\\,|\\;|\\:|\\))");
const RGX_DATE_DDMMMMYYYY = new RegExp(`(([0-9])|([0-2][0-9])|([3][0-1]))(rd|th|st)?\\s+(${DICT.month.join('|')})\\s+\\d{4}`);
const RGX_FULL_COURTNAME = new RegExp(`(([A-Z][\\w\\-]+\\s)+(Tribunal))`);
const RGX_DIVISION = new RegExp(`((\\([\\w\\d]*\\)))`);
const RGX_COURT_ABBV = new RegExp(`((\\s[A-Z]\\w+)){1,2}`);
const RGX_PARTY_NAME = new RegExp(`(((\\s|^)+([\\\(\\-]?[A-Z][a-z\\,\\-]*[\\\)\\-]?)(\\s+(of|for|%FOR%|%OF%|and|in|plc|&|the|Co\\.))?)+)`);
const RGX_DATE_UNREPORTED = new RegExp(`(.*${RGX_DATE_DDMMMMYYYY.source}\\,\\s+(unreported))`);

// Various Citation
const RGX_NEUTRAL = new RegExp(`${RGX_YEAR.source}(\\s*${RGX_NUM_OR_SLASHEDNUM.source}?\\s*${RGX_COURT_ABBV.source}?\\s*${RGX_DIVISION.source}?\\s*${RGX_NUM_OR_SLASHEDNUM.source}\\s*${RGX_DIVISION.source}?)`);
const RGX_REPORT = new RegExp(`${RGX_YEAR.source}\\s+(\\d+\\s(\\w+\\s){1,4}\\d+(\\s\\([A-Z]\\w+\\))*)`);
const RGX_UNUSUAL_1 = new RegExp("([A-Z]+(\\/\\d+)+\\/[A-Z]+)");
const RGX_UNUSUAL_2 = new RegExp("((\\(?\\w+(\\/\\d+)+\\)?))");

const RGX_CITEND = new RegExp(`(${RGX_NEUTRAL.source}|${RGX_REPORT.source}|${RGX_UNUSUAL_1.source}|${RGX_UNUSUAL_2.source}|(\\\(${RGX_DATE_UNREPORTED.source}\\\)))`, "g");
const RGX_AND = new RegExp(`(${RGX_NEUTRAL.source}|${RGX_REPORT.source}|${RGX_UNUSUAL_1.source}|${RGX_UNUSUAL_2.source}${RGX_STOPPER.source})(\\.|(\\s+and\\s+))`, "gm");

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

    const result = matched.filter(m => !RGX_YEAR.test(m) && !RGX_UNUSUAL_1.test(m) && !RGX_UNUSUAL_2.test(m))
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

// console.log(annotate("There are three further points, all of them negative, but all of them in my opinion very important, which should guide the construction of the 2000 Act. First, there is nothing whatever which suggests an intention to depart from the principle that the issue of warrants by a secretary of state and all matters pertaining to such warrants should not be the subject of enquiry in the course of a criminal trial. Secondly, there was nothing in RAS v Allan [2001] EWCA Crim 1027 the 2000 Act, nor in the consultation paper which preceded it (Interception of Communications in the United Kingdom, Cm 4368, 1999), nor in the Hansard references to which the House was referred, which questioned or threw doubt on the decisions in R v Ahmed and R v Effik (see paragraph 8 above) in which the court had examined whether an interception had been made within a public or a private system. Since the 2000 Act was passed, there have been further Court of Appeal decisions in which the same enquiry has been conducted: R v Allan [2001] EWCA Crim 1027 (6 April 2001, unreported); R v Goodman [2002] EWCA Crim 903 (4 March 2002, unreported). Thirdly, there is nothing in the 2000 Act or in any other materials the House has been shown to suggest a parliamentary intention to render inadmissible as evidence in criminal proceedings any material which had previously been admissible, save to the extent explained in paragraph 20 below. As already shown, the United Kingdom practice has been to exclude the product of warranted interception from the public domain and thus to preclude its use as evidence. But this has been a policy choice, not a requirement compelled by the Convention, and other countries have made a different policy choice. Article 8(2) of the European Convention permits necessary and proportionate interference with the right guaranteed in article 8(1) if in accordance with the law and if in the interests of national security, public safety, the economic well-being of the country, the prevention of disorder or crime, the protection of health or morals or the protection of the rights and freedoms of others. Save where necessary to preserve the security of warranted interception, there is no reason why it should have been sought to exclude the product of any lawful interception where relevant as evidence in any case whether civil or criminal"))
module.exports = annotate;

