function annotate(text) {

    const normalize = (txt) => {
        txt = txt.replace("see, generally,", "see");
        txt = txt.replace("see,", "see");
        txt = txt.replace(/\(\S+\)/gm, x => x.replace(/\(\S+\)/gm, x => x.replace(/\(|\)/g, '-')));
        return txt;
    }

    const denormalize = (txt) => {
        if (!txt) return
        txt = txt.replace(/\-\S+\-/gm, x => `(${x.slice(1, x.length - 1)})`);
        txt = txt.replace(new RegExp(prefix), "");
        return txt;
    }
    // normalize text
    text = normalize(text);

    // find v position
    v_indices = Array.from(text.matchAll(/\sv\s/gm), match => match.index);

    const prefix = "(( |^|\\.|\:|\\()((see)|(but)|(in)|(applied)|(accord)|(^[A-Z]+\sof)|(cites)|(on)|(by)|(at)|(with)|(to)) )|\\(";
    const prefix_regex = new RegExp(prefix, "gm");
    prefix_indices = Array.from(text.matchAll(prefix_regex), match => match);

    const start = v_indices.map(v_index => {
        const candidate = prefix_indices.filter(item => item.index < v_index);
        return candidate[candidate.length - 1].index;
    })

    const end = /(.*(|\[|\\(\d{4}\]|\\|)).*([A-Z]\w+)*\s(\d+\/\d+|\d+))|(.*[A-Z]+\/\d+\/\d+\/[A-Z]+)/g;
    const citations = start.map((s, i) => denormalize(Array.from(text.slice(s, v_indices[i + 1]).matchAll(end), match => match[0])[0]));
 
    // denormalize
    return citations;
}

module.exports = annotate;
