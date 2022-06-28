example_text = `
    Rather she has relied on observations made by Singer J in Re P (A Child: Mirror Orders) [2000] 1 FLR 435 and members of the Court of Appeal in W v W [2011] EWCA Civ 703 which suggest that the jurisdictional basis on which a court in England and Wales makes mirror orders is doubtful and that such orders are ancillary or auxiliary in character and made for pragmatic reasons under the inherent jurisdiction of the court rather than under a particular statute.  
    
    That this analysis is right is confirmed by the authoritative guidance in “Child Support: the Legislation” edited by Edward Jacobs at p 29. That text cites Philips v Pearce [1996] 2 FLR 230, where Johnson J held that he was unable to make a maintenance order, because the Secretary of State … had jurisdiction.

    To a person unfamiliar with public and administrative law, the Secretary of State’s option not to make a maintenance calculation might seem to leave her with a great deal of discretion. But that is not the case. Powers conferred by statutes must be exercised so as to further the purposes of the statute (see, generally, Padfield v Minister of Agriculture, Fisheries and Food [1968] AC 997)

    Judgments given on applications for permission to appeal do not create binding precedents (see Jones v University of Lincolnshire and Humberside [2000] 1 WLR 1988 at [43] and the authorities referred to in that paragraph).

    The Upper Tribunal’s jurisdiction was examined by the Court of Appeal in Bradley Fold Travel Ltd and Anor v Secretary of State for Transport [2010] EWCA Civ 695. The court applied Subesh and ors v Secretary of State for the Home Department [2004] EWCA Civ 56, where Woolf LJ held.

    He relied on the statement of Lord Justice Rix in the Court of Appeal in paragraph 69 of Muck It Limited, Hazel Merritt, Hayley Merritt v The Secretary of State for Transport [2005] EWCA Civ 1124 as below

    The Administrative Court decided in R. (on the application of Al-Le Logistics Ltd) v Traffic Commissioner for the South Eastern and Metropolitan Traffic Area [2010] EWHC 134 (Admin) at paragraph 92: 

    “In AM Richardson v. BETR 2000/65 the Transport Tribunal accepted that the Traffic Commissioner is a public authority and thus subject to control by section 6 of the Human Rights Act 1988. 

    This approach of the Traffic Commissioner is an error of law in that it reverses the burden of proof for an existing licence holder resting on the Commissioner (Muck-it v Merritt and Others [2005] EWCA 1124 and Patricia Bakewell (t/a PP Haulage T/2017/4)). 
`

const annotate = (text) => {
    // normalize text
    text = text.replace("see, generally,", "see")
    text = text.replace("see,", "see")

    // find v position
    v_indices = Array.from(text.matchAll(/\sv\s/gm), match => match.index);

    const prefix = "(((^|\.\s*)(see)|(but)|(in)|(applied)|(cites)|(of)|(on)|(at)) )|\\("
    const prefix_regex = new RegExp(prefix, "gm")
    prefix_indices = Array.from(text.matchAll(prefix_regex), match => match);

    const start = v_indices.map(v_index => {
        const cadidate = prefix_indices.filter(item => item.index < v_index)
        return cadidate[cadidate.length - 1].index
    })

    const end = /(.*(\[|\\(\d{4}\]|\\)).*[A-Z]\w+\s\d+)/g
    const citations = start.map((s, i) => Array.from(text.slice(s, v_indices[i + 1]).matchAll(end), match => match[0].replace(new RegExp(prefix),""))[0])

    return citations
}

const annotate_2 = (text) => {
    const patterns = [
        /(?<=((\.|\,|^)|(see)|(but)|(in)|(cites)|(of)|(on)|(at))\s)(([A-Z][a-z]*)(\sv\s).+\s(\[|\(\d{4}\]|\)).*[A-Z]\w+\s\d+)/gm,
    ]

    let citations = {}
    patterns.forEach((pattern, i) => {
        citations[`rules ${i + 1}`] = Array.from(text.matchAll(pattern), match => match[0]);
    })

    return citations
} 

console.log(annotate(example_text))