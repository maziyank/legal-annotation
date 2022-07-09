const RGX = require("./../utils/_general_regex");
const { denormalize } = require("./../utils/_normalize");

const cit_party_date = (text) => {
    const RGX_PARTY_WITH_DATE = new RegExp(`${RGX.PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${RGX.PARTY_NAME.source}\\s+\\\(${RGX.DATE_DDMMMMYYYY.source}\\\)`, 'gm');
    const matched = Array.from(text.matchAll(RGX_PARTY_WITH_DATE));
    const result = matched.map(m => denormalize(m[0]));
    return result
}

const cit_party_unreported = (text) => {
    const RGX_PARTY_UNREPORTED = new RegExp(`${RGX.PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${RGX.PARTY_NAME.source}\\s+\\\(${RGX.DATE_UNREPORTED.source}\\\)`, 'gm');
    const matched = Array.from(text.matchAll(RGX_PARTY_UNREPORTED));
    const result = matched.map(m => denormalize(m[0]));
    return result
}

const cit_party_only = (text) => {
    const RGX_TEST = new RegExp(`${RGX.PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${RGX.PARTY_NAME.source}(.{0,30})`, 'gm');
    const RGX_PARTY_ONLY = new RegExp(`${RGX.PARTY_NAME.source}(\\s+[\\–\\-]?v\\.?)${RGX.PARTY_NAME.source}`, 'gm');
    const matched = Array.from(text.matchAll(RGX_TEST));

    const result = matched.filter(m => !RGX.YEAR.test(m) && !RGX.UNUSUAL_1.test(m))
        .map(m => RGX_PARTY_ONLY.exec(m))
        .filter(m => m)
        .map(m => denormalize(m[0].trim()))
        .map(m => m.replace(/\s(of|for|and|&|in|plc|the)$/gm), '');

    return result
}

module.exports = { cit_party_date, cit_party_unreported, cit_party_only }