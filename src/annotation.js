function detector1(text) {

    const normalize = (txt) => {
        txt = txt.replace("see, generally,", "see");
        txt = txt.replace("see,", "see");
        txt = txt.replace(/\:\s*/ , '\n');
        txt = txt.replace(/(\(\S+\))(?=.*\sv\.?\s)/gm,  x => x.replace(/\(|\)/g, '-'));
        txt = txt.replace(/(?<=[A-Z]\w+)(\sof\s)(?=[A-Z])/gm,  x => x.replace(' of ', ' %OF% '));
        return txt;
    }

    const denormalize = (txt) => {
        if (!txt) return
        txt = txt.replace(/\-\S+\-/gm, x => `(${x.slice(1, x.length - 1)})`);
        txt = txt.replace(' %OF% ', ' of ');
        txt = txt.replace(new RegExp(prefix), "");
        return txt;
    }
    // normalize text
    text = normalize(text);

    // find v position
    v_indices = Array.from(text.matchAll(/\sv\.?\s/gm), match => match.index);

    if (!v_indices)
        return false

    const prefix = "((\\. +|\:|\\(| |^)((see)|(but)|(in)|(of)|(applied)|(accord)|(cites)|(on)|(by)|(at)|(with)|(to)) )|\\(|^|\\n";
    const prefix_regex = new RegExp(prefix, "gm");
    prefix_indices = Array.from(text.matchAll(prefix_regex), match => match);

    const start = v_indices.map(v_index => {
        const candidate = prefix_indices.filter(item => item.index < v_index);
        if (!candidate) {
            return -1
        }
        return candidate[candidate.length - 1].index;
    })
     if (!start) return false

    const end = /(.*(|\[|\\(\d{4}\]|\\|)).*([A-Z]\w+)*\s(\d+\/\d+|\d+))|(.*[A-Z]+\/\d+\/\d+\/[A-Z]+)|(.*(\(\w+\/\d+\/\d+\)))/g;
    const citations = start.map((s, i) => denormalize(Array.from(text.slice(s, v_indices[i + 1]).matchAll(end), match => match[0])[0]));

    // denormalize
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
module.exports = annotate;
