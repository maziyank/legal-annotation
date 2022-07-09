// Very Short Citation Like R(M)1/32
const cit_short = (text) => {
    const RGX_UNUSUAL = new RegExp("R\\s*\\(.*\\)\\d+\\/\\d+", "gm");
    const matched = Array.from(text.matchAll(RGX_UNUSUAL), m => m[0]);
    return matched.map(m => m.trim())
}

module.exports = {cit_short};