const DICT = require("./_dict");
const RGX = require("./_general_regex")

const normalize = (txt) => {
    // normalize word using dictionary
    DICT.normalizer.forEach(({ from, to }) => {
        txt = txt.replace(new RegExp(from, "gm"), to)
    });
    return txt;
}

const denormalize = (txt) => {
    if (!txt) return
    // txt = txt.replace(/\-\S+\-/gm, x => `(${x.slice(1, x.length - 1)})`);
    txt = txt.trim();
    txt = txt.replace(/^\(/, "");
    if (/\)$/.test(txt) && !(/\(.*/.test(txt))) {
        txt = txt.replace(/\)$/, "");
    }
    
    txt = txt.replace(/[\,\.]$/, "");
    return txt;
}


module.exports = { normalize, denormalize };