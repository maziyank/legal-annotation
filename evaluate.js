const annotate = require('./src/annotation');
const test_case = require('./dataset.json');

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

const evaluate = () => {
    let FP = 0, TP = 0, FN = 0; TN=0;
    test_case.scenarios.forEach(({ text, expected: truth }) => {
        try {
            const prediction = annotate(text);
            TP += sum(prediction.map(y_hat => Number(truth.includes(y_hat))));
            FP += sum(prediction.map(y_hat => Number(!truth.includes(y_hat))));
            FN += sum(truth.map(y => Number(!prediction.includes(y))));
        } catch (error) {
            FN += truth.length;
            console.log(error);
        }
    });

    console.log("=================================");
    console.log("Heuristic Model Evaluation Result:");
    console.log("=================================");
    console.log("TP\t\t:", TP);
    console.log("FN\t\t:", FN);
    console.log("FP\t\t:", FP);
    console.log("Precision\t:", (TP / (TP+FP)).toFixed(3));
    console.log("Recall\t\t:", (TP / (TP+FN)).toFixed(3));
}

evaluate();