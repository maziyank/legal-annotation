// General Part
const DICT = require("./_dict")

const GENERAL_REGEX = {
    PREFIX: new RegExp(`((\\. +|\:|\\s|^)(${DICT.prefix.map(t => `(${t})`).join('|')})\\s)|^|\\(|\\n|\\:|\\;|(\\.\\s+)`, "gm"),
    YEAR: new RegExp("([\\[\\(\\s][1-2]\\d{3}[\\]\\)\\s)])"),
    V: new RegExp("([\\–\\-]?v[\\–\\-\\.]?)"),
    NUM_OR_SLASHEDNUM: new RegExp("(\\d+(\\/\\d+)*((\\,\\s\\d+)|(\\-\\d+))*(\\.[\\d\\w]+)*)"),
    PINPOINT: new RegExp(`((((\\,\\s+)?at)|((\\,\\s+)?at pp)|((\\,\\s+)?§)|((\\,\\s+)?esp at)|((\\,\\s+)?at page)|(\\,\\s+par[a]?[s]?)|(at p\\.)|(par[a]?[s]?)|((\\,\\s+)?at par[a]?[s]?)|((\\,\\s+)?at paragraph[s]?))\\s*((\\d+((-\\d+)|(\\,\\s+\\d+)|(\\sto+\\s\\d+))*)|(\\d+\\s+([A-Z\\\–]*))|(\\[\\d+\\]((\\s*\\-\\s*)\\[\\d+\\])*)))`),
    STOPPER: new RegExp("(?=\\s|$|\\n|\\.|\\,|\\;|\\:|\\))"),
    DATE_DDMMMMYYYY: new RegExp(`(([0-9])|([0-2][0-9])|([3][0-1]))(rd|th|st)?\\s+(${DICT.month.join('|')})\\s+\\d{4}`),
    DATE_MMMMDDYYYY: new RegExp(`(${DICT.month.join('|')})\\s+(([0-9])|([0-2][0-9])|([3][0-1]))(rd|th|st)?\\,\\s+\\d{4}`),
    FULL_COURTNAME: new RegExp(`(([A-Z][\\w\\-]+\\s)+(Tribunal))`),
    DIVISION: new RegExp(`((\\([\\w\\d]*\\)))`),
    COURT_ABBV: new RegExp(`((((\\s*[A-Z][\\w\\’]*)){1,2})|((\\s*([A-Z])([\\\.A-Z])+)))`),
    PARTY_NAME: new RegExp(`(((\\s*|^)([[A-Z0-9É][a-z\\,\\-\\']*)(\\s[\\(\\-][A-Z0-9É][a-z\\,\\-\\']+[\\)\\-])?(\\s+(of|for|%FOR%|%OF%|and|in|plc|ex|parte|&|the|ors|Co\\.))?(\\s\\([A-Z]+\\))?\\.?)+)`)
}

const GR = GENERAL_REGEX;

const EUR_REPORT= new RegExp(`\\(?(([Aa]pplication\\s+)?no\\.\\s+\\d+\\/\\d+)${GR.PINPOINT.source}\\,\\s+(E[A-Z]+\\s+\\d{4}\\-[MDCLXVI]+)\\)?`)
const DATE_UNREPORTED = new RegExp(`((.*${GR.DATE_DDMMMMYYYY.source}\\,\\s+(unreported))|(unreported\\s+transcript\\s+${GR.DATE_DDMMMMYYYY.source}))`);
const NEUTRAL = new RegExp(`${GR.YEAR.source}(\\s*${GR.NUM_OR_SLASHEDNUM.source}?\\s*${GR.COURT_ABBV.source}?\\s*${GR.DIVISION.source}?\\s*${GR.NUM_OR_SLASHEDNUM.source}\\s*${GR.DIVISION.source}?)`);
const REPORT = new RegExp(`${GR.YEAR.source}\\s+(\\d+\\s(\\w+\\s){1,4}\\d+(\\s\\([A-Z]\\w+\\))*)`);
const UNUSUAL_1 = new RegExp(`((\\(?\\w+(\\/\\w+)+\\)?))(\\s+of\\s+${GR.DATE_DDMMMMYYYY.source})?`);
const CITEND = new RegExp(`(${EUR_REPORT.source}|${NEUTRAL.source}|${UNUSUAL_1.source}|(\\\(${DATE_UNREPORTED.source}\\\)))`, "g");
const AND = new RegExp(`(${NEUTRAL.source}|${REPORT.source}|${UNUSUAL_1.source}${GR.STOPPER.source})(\\.|(\\s+and\\s+))`, "gm");
const RGX_PARTY_ONLY = new RegExp(`((Re\\s+${GR.PARTY_NAME.source}\\,?)|(${GR.PARTY_NAME.source}(\\s+${GR.V.source})${GR.PARTY_NAME.source}))`, "gm");

module.exports = {
    ...GENERAL_REGEX,
    DATE_UNREPORTED,
    NEUTRAL,
    REPORT,
    UNUSUAL_1,
    CITEND,
    AND,
    RGX_PARTY_ONLY
};

