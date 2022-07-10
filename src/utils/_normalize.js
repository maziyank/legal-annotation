const DICT = require("./_dict");
const RGX = require("./_general_regex")

const normalize = (txt) => {
    // normalize word using dictionary
    DICT.normalizer.forEach(({ from, to }) => {
        txt = txt.replace(new RegExp(from, "gm"), to)
    });

    // split if `and` found 
    match_and_ = Array.from(txt.matchAll(RGX.AND));
    if (match_and_) {
        match_and_.forEach((ma, i) => {
            index_and_ = ma.index + ma[0].length;
            txt = txt.substring(0, index_and_ + i) + '\n' + txt.substring(index_and_ + i);
        })
    }

    // preserve
    // txt = txt.replace(/(\(\S+\))(?=.*\sv\.?\s)/gm, x => x.replace(/\(|\)/g, '-'));
    // txt = txt.replace(/(\(\S+\))(?=.*((\[\d{4}\])|(\(\d{4}\))|(\d{4})))/gm, x => x.replace(/\(|\)/g, '-'));
    // txt = txt.replace(/(?<=[A-Z]\w+)(\sof\s)(?=[A-Z])/gm, x => x.replace(' of ', ' %OF% '));
    // txt = txt.replace(/(?<=[A-Z]\w+)(\sfor\s)(?=[A-Z])/gm, x => x.replace(' for ', ' %FOR% '));
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


module.exports = { normalize, denormalize };