const annotate = require('./src/annotation');
const test_case = require('./dataset.json');

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

const evaluate = () => {
    let FP = 0, TP = 0, FN = 0; TN=0;
    let total_citation = 0; total_prediction = 0;
    test_case.scenarios.forEach(({ text, expected: truth }) => {
        total_citation += truth.length;
        try {
            const prediction = annotate(text);
            total_prediction += prediction.length;
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
    console.log("")
    console.log("Total Docs\t\t:", test_case.scenarios.length);
    console.log("Total Citation\t\t:", total_citation);
    console.log("Total Prediction\t:", total_prediction);
    console.log("TP\t\t\t:", TP);
    console.log("FN\t\t\t:", FN);
    console.log("FP\t\t\t:", FP);
    console.log("Precision\t\t:", (TP / (TP+FP)).toFixed(3));
    console.log("Recall\t\t\t:", (TP / (TP+FN)).toFixed(3));
    console.log("")
    console.log("Done.")
}

evaluate();