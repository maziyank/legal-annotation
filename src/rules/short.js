/**
* Given text as input, capture very rare short citation (i.e. 9R(M)1/32)
* @function cit_short
* @param {String} text 
* @return {[String]} list of captured citation
*/

const cit_short = (text) => {
    const RGX_UNUSUAL = new RegExp("R\\s*\\(.*\\)\\d+\\/\\d+", "gm");
    const matched = Array.from(text.matchAll(RGX_UNUSUAL), m => m[0]);
    return matched.map(m => m.trim())
}

module.exports = {cit_short};