const DICT = {
    prefix: ["on", "see",  "appendix to", "in", "was emphasised in", "applied are", "applied is", "applied", "were", "was", "appeal", "as", "accord", "cites", "citing", "cite", "refer to", "was said by", "cited", "on", "by", "at", "with", "to", "of", "for", "against", "de", "also", "including", "per", "upon", "re", "which", "et", "is", "and", "for", "example"],
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
            "from": "(Lord|Judge)(\\s[A-Z]\\w+){1,5}\\s+in",
            "to": "lord in"
        },
        {
            "from": "(\\s[A-Z]\\w+){1,2}\\s(Court|Tribunal|Division|Chamber|Lord(s?)|House|Justice|Board)\\s+in",
            "to": "court in"
        },
        {
            "from": "of(\\s[A-Z]\\w+){1,6}\\s+in",
            "to": "of in"
        },
        {
            "from": "(see\\s)?per(\\s[\\w\\%\\,\\']+){1,6}\\s+in",
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
            "from": "\\s+–\\s+[A-Z]",
            "to": "\n"
        },
        {
            "from": "refer to the decision of the \\w+ in",
            "to": "refer to"
        },
        {
            "from": "([a-z]+\\s){2}([a-z]+\\,)",
            "to": "see "
        },
        {
            "from": "Court\\s+of\\s+Appeal\\s+in",
            "to": "see"
        },
    ],
    "month": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
}

module.exports = DICT;