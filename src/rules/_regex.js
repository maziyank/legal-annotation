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
            "from": "([a-z]+\\s){2}([a-z]+\\,)",
            "to": "see "
        }
    ],
    "month": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
}

class GeneralRegex {
    constructor () {
        
    }

    static get RGX_PREFIX() {
        return new RegExp(`((\\. +|\:|\\(|\\s|^)(${DICT.prefix.ma = (t => `(${t})`).join('|')})\\s)|\\(|^|\\n|\\.\\s+`, "gm")
    };

    static get RGX_YEAR() {
        return new RegExp("((\\[\\d{4}\\])|(\\(\\d{4}\\))|\\d{4})")
    };

    static get RGX_V() {
        return new RegExp("(\\s[\\–\\-]?v[\\-\\.]?\\s)")
    };

    static get RGX_NUM_OR_SLASHEDNUM() {
        return new RegExp("(\\d+(\\/\\d+)*(\\,\\s\\d+)*(\\-\\d+)*)")
    };

    static get RGX_PINPOINT() {
        return new RegExp(`(((at)|(at pp)|(\\,\\s+par[a]?[s]?)|(at p\\.)|(par[a]?[s]?)|(at par[a]?[s]?)|(at paragraph))\\s+((\\d+((-\\d+)|(\\,\\s+\\d+))*)|(\\[\\d+\\]((\\s*-\\s*)\\[\\d+\\])*)))`)
    };

    static get RGX_STOPPER() {
        return new RegExp("(?=\\s|$|\\n|\\.|\\,|\\,|\\:|\\))")
    };

    static get RGX_DATE_DDMMMMYYYY() {
        return new RegExp(`(([0-9])|([0-2][0-9])|([3][0-1]))(rd|th|st)?\\s+(${DICT.month.join('|')})\\s+\\d{4}`)
    };

    static get RGX_FULL_COURTNAME() {
        return new RegExp(`(([A-Z][\\w\\-]+\\s)+(Tribunal))`)
    };

    static get RGX_DIVISION() {
        return new RegExp(`((\\([\\w\\d]*\\)))`)
    };

    static get RGX_COURT_ABBV() {
        return new RegExp(`((((\\s[A-Z]\\w*)){1,2})|((\\s([A-Z])([\\\.A-Z])+)))`)
    };

    static get RGX_PARTY_NAME() {
        return new RegExp(`(((\\s|^)+([\\\(\\-]?[A-Z][a-z\\,\\-]*[\\\)\\-]?)(\\s+(of|for|%FOR%|%OF%|and|in|plc|&|the|Co\\.))?)+)`)
    };

    static get RGX_DATE_UNREPORTED() {
        return new RegExp(`(.*${RGX_DATE_DDMMMMYYYY.source}\\,\\s+(unreported))`)
    };


}


module.exports = GeneralRegex;