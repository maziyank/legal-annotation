const annotate = require('../src/annotation');
const test_case = require('./../dataset.json');

test_case.scenarios.forEach(({ text, expected }) => {
    test(text + (expected.length>0 ? ' => ': '' ) +  expected.join('; '), () => {
        expect(annotate(text).sort()).toEqual(expected.sort());
    });
})
