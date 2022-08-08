const annotate = require('../src');
const test_case = require('./../dataset/dataset.json');

test_case.scenarios.forEach(({ text, expected }) => {
    test(text + (expected.length>0 ? ' => ': '' ) +  expected.join('; '), async () => {
        preds = await annotate(text);
        expect(preds.sort()).toEqual(expected.sort());
    });
})
