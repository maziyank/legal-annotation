const annotate = require('./../src/annotation');

scenarios = [
    {
        text: 'Court of Appeal in W v W [2011] EWCA Civ 703 which suggest that the jurisdictional basis on which',
        expected: 'W v W [2011] EWCA Civ 703'
    },
    {
        text: 'That text cites Philips v Pearce [1996] 2 FLR 230, where Johnson J held that he was unable to make a maintenance order',
        expected: 'Philips v Pearce [1996] 2 FLR 230'
    },
    {
        text: '(see Jones v University of Lincolnshire and Humberside [2000] 1 WLR 1988 at [43] and the authorities referred to in that paragraph)',
        expected: 'Jones v University of Lincolnshire and Humberside [2000] 1 WLR 1988'
    },
    {
        text: 'see BB v Secretary of State for Work and Pensions (PIP) [2017] UKUT (AAC) 596',
        expected: 'BB v Secretary of State for Work and Pensions (PIP) [2017] UKUT (AAC) 596'
    },
    {
        text: 'was emphasised in Mugford v Midland Bank plc 1997 ICR 399, EAT',
        expected: 'Mugford v Midland Bank plc 1997 ICR 399'
    },
    {
        text: 'Appeal Tribunal in Nicholls v Rockwell Automation Ltd EAT/0540/11/SM.',
        expected: 'Nicholls v Rockwell Automation Ltd EAT/0540/11/SM'
    },
    {
        text: 'compensation awarded (pursuant to Polkey v AE Dayton Services Ltd [1988] ICR 142). Those judgments..',
        expected: 'Polkey v AE Dayton Services Ltd [1988] ICR 142'
    },
    {
        text: 'the tribunal see Manchester College of Arts and Technology (MANCAT) v Mr G Smith [2007] UKEAT 0460/06 in the bank',
        expected: 'Manchester College of Arts and Technology (MANCAT) v Mr G Smith [2007] UKEAT 0460/06'
    }
]



scenarios.forEach(({ text, expected }) => {
    test(expected, () => {
        expect(annotate(text)).toStrictEqual([expected]);
    });
})
