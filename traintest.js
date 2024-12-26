function trainEpoc(training) {
    shuffle(training, true);

    // Train for one epoch
    for (let i = 0; i < training.length; i++) {
        let data = training[i];
        let inputs = Array.from(data).map(x => x / 255); // Ensure data is converted to an array and normalized
        if (inputs.length !== 784) { // Ensure the input array is the correct size
            console.error(`Input size error: expected 784, got ${inputs.length}`);
            continue;
        }
        let label = data.label; // Assuming data contains the label
        let targets = [0, 0, 0, 0, 0]; // Create an array for target labels
        targets[label] = 1; // Set the correct label

        // Train the network with inputs and targets
        nn.train(inputs, targets);
    }
}
function testAll(testing) {
    let correct = 0;

    // Test for all data
    for (let i = 0; i < testing.length; i++) {
        let data = testing[i];
        let inputs = Array.from(data).map(x => x / 255); // Normalize input values
        if (inputs.length !== 784) { // Ensure the input array is the correct size
            console.error(`Input size error: expected 784, got ${inputs.length}`);
            continue;
        }

        let label = data.label;
        let guess = nn.predict(inputs);

        // Find the index of the maximum value in the prediction
        let m = max(guess);
        let classification = guess.indexOf(m);

        if (classification === label) {
            correct++;
        }
    }

    let percent = 100 * correct / testing.length;
    return percent;
}
