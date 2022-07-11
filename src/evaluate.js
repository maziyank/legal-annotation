const annotate = require('.');
const test_case = require('./../dataset/dataset.json');

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
    console.log("Total Documents\t\t\t:", test_case.scenarios.length);
    console.log("Total Actual Citation\t\t:", total_citation);
    console.log("Total Predicted Citation\t:", total_prediction);
    console.log("")
    console.log("TP (Correct Prediction)\t\t:", TP);
    console.log("FN (Error Type I)\t\t:", FN);
    console.log("FP (Error Type II)\t\t:", FP);
    console.log("")
    console.log("Precision\t\t\t:", (TP / (TP+FP)).toFixed(3));
    console.log("Recall\t\t\t\t:", (TP / (TP+FN)).toFixed(3));
    console.log("")
    console.log("Done.")
}

evaluate(); 