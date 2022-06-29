const annotate = require('./annotation');

test('W v W [2011] EWCA Civ 703', () => {
    expect(annotate('Court of Appeal in W v W [2011] EWCA Civ 703 which suggest that the jurisdictional basis on which')).toStrictEqual(['W v W [2011] EWCA Civ 703']);
});

expect1 = "Philips v Pearce [1996] 2 FLR 230";
test(expect1, () => {
    expect(annotate('That text cites Philips v Pearce [1996] 2 FLR 230, where Johnson J held that he was unable to make a maintenance orde')).toStrictEqual([expect1]);
});

expect2 = "Jones v University of Lincolnshire and Humberside [2000] 1 WLR 1988";
test(expect2, () => {
    expect(annotate('(see Jones v University of Lincolnshire and Humberside [2000] 1 WLR 1988 at [43] and the authorities referred to in that paragraph)')).toStrictEqual([expect2]);
});

expect3 = "Home Office v Tariq [2011] UKSC 35";
test(expect3, () => {
    expect(annotate('respondent (Home Office v Tariq [2011] UKSC 35 at [102]-[105])')).toStrictEqual([expect3]);
});

expect4 = "BB v Secretary of State for Work and Pensions (PIP) [2017] UKUT (AAC) 596";
test(expect4, () => {
    expect(annotate('see BB v Secretary of State for Work and Pensions (PIP) [2017] UKUT (AAC) 596')).toStrictEqual([expect4]);
});

expect5 = "Mugford v Midland Bank plc 1997 ICR 399";
test(expect5, () => {
    expect(annotate('was emphasised in Mugford v Midland Bank plc 1997 ICR 399, EAT')).toStrictEqual([expect5]);
});

expect6 = 'Manchester College of Arts and Technology (MANCAT) v Mr G Smith [2007] UKEAT 0460/06';
test(expect6, () => {
    expect(annotate('the tribunal see Manchester College of Arts and Technology (MANCAT) v Mr G Smith [2007] UKEAT 0460/06')).toStrictEqual([expect6]);
});
