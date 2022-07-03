const prefix = "((\\. +|\:|\\(| |^)((see)|(but)|(in)|(of)|(applied)|(on appeal)|(accord)|(cites)|(cite)|(cited)|(on)|(by)|(at)|(with)|(to)) )|\\(|^|\\n";
const prefix_regex = new RegExp(prefix, "gm");
const end = /((.*((\[\d{4}\])|(\(\d{4}\))|\d{4}).*([A-Z]\w+)*\s(\d+\/\d+|\d+))|(.*[A-Z]+\/\d+\/\d+\/[A-Z]+)|(.*(\(\w+\/\d+\/\d+\))))(?=\s|$|\n|\.|\,|\;|\:|\)|)/g;
const end2 = /((((\[\d{4}\])|(\(\d{4}\))|\d{4}).*([A-Z]\w+)*\s(\d+\/\d+|\d+))|([A-Z]+\/\d+\/\d+\/[A-Z]+)|((\(\w+\/\d+\/\d+\))))(?=\s|$|\n|\.|\,|\;|\:|\))/g;

const normalize = (txt) => {
    txt = txt.replace("see, generally,", "see");
    txt = txt.replace("See, generally,", "see");
    txt = txt.replace("see,", "see");
    txt = txt.replace("See,", "see");
    txt = txt.replace("see also ", "see ");
    txt = txt.replace("See also ", "see ");
    txt = txt.replace(/,?\sand\s/gm, " and ");
    txt = txt.replace(/\:\s*/gm, '\n');
    txt = txt.replace(/;/gm, '\n'); 

    // split if `and` found 
    const and_ = /(\sv\s.*((|\[|\\(\d{4}\]|\\|))([A-Z]\w+)*\s(\d+\/\d+|\d+))|([A-Z]+\/\d+\/\d+\/[A-Z]+)|((\(\w+\/\d+\/\d+\))))(\s+and\s+)/g
    match_and_ = Array.from(txt.matchAll(and_))[0]
    if (match_and_){
        index_and_ = match_and_.index + match_and_[0].length    
        txt = txt.substring(0, index_and_) + '\n' + txt.substring(index_and_);
    }
    
    // preserve
    txt = txt.replace(/(\(\S+\))(?=.*\sv\.?\s)/gm, x => x.replace(/\(|\)/g, '-'));
    txt = txt.replace(/(\(\S+\))(?=.*((\[\d{4}\])|(\(\d{4}\))|(\d{4})))/gm, x => x.replace(/\(|\)/g, '-'));
    txt = txt.replace(/(?<=[A-Z]\w+)(\sof\s)(?=[A-Z])/gm, x => x.replace(' of ', ' %OF% '));
    return txt;
}

const denormalize = (txt) => {
    if (!txt) return
    txt = txt.replace(/\-\S+\-/gm, x => `(${x.slice(1, x.length - 1)})`);
    txt = txt.replace(' %OF% ', ' of ');
    txt = txt.trim();
    return txt;
}

function detector1(text) {
    // find v position
    v_matches = Array.from(text.matchAll(/\sv\.?\s/gm), match => match.index);

    if (!v_matches)
        return []

    prefix_match = Array.from(text.matchAll(prefix_regex), match => match);

    const start = v_matches.map(v => {
        const candidate = prefix_match.filter(item => item.index < v);
        if (!candidate) {
            return -1
        }

        const final_candidate = candidate[candidate.length - 1]
        return final_candidate.index + final_candidate[0].length;
    })
    if (!start) return []

    let citations = start.map((s, i) => Array.from(text.slice(s, v_matches[i + 1]).matchAll(end), match => match[0])[0]);

    // revert text to original
    citations = citations.map(item => denormalize(item))

    return citations;
}

function detector2(text) {
    const end_matches = Array.from(text.matchAll(end2), match => match);
    if (!end_matches)
        return []

    prefix_match = Array.from(text.matchAll(prefix_regex), match => match);
    const start = end_matches.map(e => {
        const candidate = prefix_match.filter(item => item.index < e.index);
        if (!candidate) {
            return -1
        }
        const final_candidate =  candidate[candidate.length - 1]
        return [final_candidate.index + final_candidate[0].length, e.index + e[0].length];
    })
    if (!start) return 
    
    //  construct text and exclude citation with v
    let citations = start.map(s => text.slice(s[0], s[1])).filter(s => s.indexOf(' v ') == -1);
    // revert text to original
    citations = citations.map(item => denormalize(item))
    return citations
}

function annotate(text) {
    // normalize text
    text = normalize(text);
    
    const detectors = [detector1, detector2];
    let citations = [];
    detectors.forEach(detector => {
        citations = citations.concat(detector(text));
    });

    return [...new Set(citations)];
}

console.log(annotate("That nobody"))
module.exports = annotate;