const prefix = "((\\. +|\:|\\(| |^)((see)|(but)|(in)|(of)|(applied)|(accord)|(cites)|(on)|(by)|(at)|(with)|(to)) )|\\(|^|\\n";
const prefix_regex = new RegExp(prefix, "gm");
const end = /(.*(|\[|\\(\d{4}\]|\\|)).*([A-Z]\w+)*\s(\d+\/\d+|\d+))|(.*[A-Z]+\/\d+\/\d+\/[A-Z]+)|(.*(\(\w+\/\d+\/\d+\)))/g;

const normalize = (txt) => {
    txt = txt.replace("see, generally,", "see");
    txt = txt.replace("see,", "see");
    txt = txt.replace(/\:\s*/, '\n');
    txt = txt.replace(/(\(\S+\))(?=.*\sv\.?\s)/gm, x => x.replace(/\(|\)/g, '-'));
    txt = txt.replace(/(?<=[A-Z]\w+)(\sof\s)(?=[A-Z])/gm, x => x.replace(' of ', ' %OF% '));
    return txt;
}

const denormalize = (txt) => {
    if (!txt) return
    txt = txt.replace(/\-\S+\-/gm, x => `(${x.slice(1, x.length - 1)})`);
    txt = txt.replace(' %OF% ', ' of ');
    // txt = txt.replace(new RegExp(prefix), "");
    return txt;
}

function detector1(text) {
    // normalize text
    text = normalize(text);

    // find v position
    v_indices = Array.from(text.matchAll(/\sv\.?\s/gm), match => match.index);

    if (!v_indices)
        return false

    prefix_match = Array.from(text.matchAll(prefix_regex), match => match);

    const start = v_indices.map(v_index => {
        const candidate = prefix_match.filter(item => item.index < v_index);
        if (!candidate) {
            return -1
        }

        const final_candidate = candidate[candidate.length - 1]
        return final_candidate.index + final_candidate[0].length;
    })
    if (!start) return false

    let citations = start.map((s, i) => Array.from(text.slice(s, v_indices[i + 1]).matchAll(end), match => match[0])[0]);

    // revert text to original
    citations = citations.map(item => denormalize(item))

    return citations;
}

function annotate(text) {
    const detectors = [detector1]
    let citations = []
    detectors.forEach(detector => {
        citations = citations.concat(detector(text));
    })

    return [...new Set(citations)];
}

// console.log(annotate("We need only refer to the well-known authorities of Meek v City of Birmingham DC [1987] IRLR 250 and"))
module.exports = annotate;
