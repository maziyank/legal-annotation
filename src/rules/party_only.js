const RGX = require("./../utils/_general_regex");
const { denormalize } = require("./../utils/_normalize");

/**
* Given text as input, capture citation which has party with date  (i.e. Henderson vs Ronaldo (23 July 2020))
* @function cit_party_date
* @param {String} text input raw text
* @return {[String]} list of captured citation
*/

const cit_party_date = (text) => {
    const RGX_PARTY_WITH_DATE = new RegExp(`${RGX.PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${RGX.PARTY_NAME.source}\\s+\\\(${RGX.DATE_DDMMMMYYYY.source}\\\)`, 'gm');
    const matched = Array.from(text.matchAll(RGX_PARTY_WITH_DATE));
    const result = matched.map(m => denormalize(m[0]));
    return result
}

/**
* Given text as input, capture citation which has party and unreported date (i.e. Henderson vs Ronaldo (23 July 2020, unreported))
* @function cit_party_unreported
* @param {String} text input raw text
* @return {[String]} list of captured citation
*/

const cit_party_unreported = (text) => {
    const RGX_PARTY_UNREPORTED = new RegExp(`${RGX.PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${RGX.PARTY_NAME.source}\\s+\\\(${RGX.DATE_UNREPORTED.source}\\\)`, 'gm');
    const matched = Array.from(text.matchAll(RGX_PARTY_UNREPORTED));
    const result = matched.map(m => denormalize(m[0]));
    return result
}

/**
* Given text as input, capture citation which has only party (i.e. Henderson vs Ronaldo)
* @function cit_party_only
* @param {String} text input raw text
* @return {[String]} list of captured citation
*/

const cit_party_only = (text) => {
    const RGX_TEST = new RegExp(`(${RGX.PARTY_NAME.source}((\\s+[\\–\\-]?v\\.?)${RGX.PARTY_NAME.source})|(Re\\s+${RGX.PARTY_NAME.source}\\,?))(.{0,30})`, 'gm');
    const RGX_PARTY_ONLY = new RegExp(`((Re\\s+${RGX.PARTY_NAME.source}\\,?)|(${RGX.PARTY_NAME.source}(\\s+[\\–\\-]?v[\\–\\-\\.]?)${RGX.PARTY_NAME.source}))`, "g");
    const matched = Array.from(text.matchAll(RGX_TEST));

    const result = matched.filter(m => !RGX.YEAR.test(m) && !RGX.UNUSUAL_1.test(m))
        .map(m => RGX_PARTY_ONLY.exec(m))
        .filter(m => m)
        .map(m => denormalize(m[0].trim()))
        .map(m => m.replace(/\s(of|for|and|&|in|plc|the)$/gm), '');

    return result
}

module.exports = { cit_party_date, cit_party_unreported, cit_party_only }

