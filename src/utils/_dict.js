const DICT = {
    prefix: ["on", "see",  "appendix to", "in", "was emphasised in", "applied are", "applied is", "applied", "were", "appeal", "accord", "cites", "cite", "refer to", "was said by", "cited", "on", "by", "at", "with", "to", "of", "for"],
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
            "from": "speech\\sof(\\s[\\w\\%]+){1,5}\\s+in",
            "to": "speech in"
        },
        {
            "from": "decision(s)?\\sof(\\s[\\w\\%]+){1,6}\\s+in",
            "to": "decision in"
        },
        {
            "from": "ruling(s)?\\sof(\\s[\\w\\%]+){1,6}\\s+in",
            "to": "rulings in"
        },
        {
            "from": "judgment(s)?\\sof(\\s[\\w\\%]+){1,6}\\s+in",
            "to": "judgement in"
        },
        {
            "from": "conclusion(s)?\\sof(\\s[\\w\\%]+){1,6}\\s+in",
            "to": "rulings in"
        },
        {
            "from": "approval(s)?\\sby(\\s[\\w\\%]+){1,6}\\s+in",
            "to": "approval in"
        },
        {
            "from": "(see\\s)?per(\\s[\\w\\%]+){1,6}\\s+in",
            "to": "approval in"
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

module.exports = DICT;