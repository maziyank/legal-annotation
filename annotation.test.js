const annotate = require('./annotation');

test('Test 1', () => {
    expect(annotate('Court of Appeal in W v W [2011] EWCA Civ 703 which suggest that the jurisdictional basis on which')).toStrictEqual(['W v W [2011] EWCA Civ 703']);
});

test('Test 2', () => {
    expect(annotate('That text cites Philips v Pearce [1996] 2 FLR 230, where Johnson J held that he was unable to make a maintenance orde')).toStrictEqual(['Philips v Pearce [1996] 2 FLR 230']);
});

test('Test 3', () => {
    expect(annotate('(see Jones v University of Lincolnshire and Humberside [2000] 1 WLR 1988 at [43] and the authorities referred to in that paragraph)')).toStrictEqual(['Jones v University of Lincolnshire and Humberside [2000] 1 WLR 1988']);
});