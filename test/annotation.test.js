const annotate = require('./../src/annotation');
const test_case = require('./test_case.json');

test_case.scenarios.forEach(({ text, expected }) => {
    test(expected, () => {
        expect(annotate(text)).toStrictEqual([expected]);
    });
})
