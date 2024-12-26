class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

const sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

const tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);

class NeuralNetwork {
  /**
   * Neural Network Constructor
   * @param {number|NeuralNetwork} in_nodes - Number of input nodes or another NeuralNetwork instance to clone.
   * @param {number} [hid_nodes] - Number of hidden nodes.
   * @param {number} [out_nodes] - Number of output nodes.
   */
  constructor(in_nodes, hid_nodes, out_nodes) {
    if (in_nodes instanceof NeuralNetwork) {
      // Clone the neural network
      const a = in_nodes;
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      this.output_nodes = a.output_nodes;

      this.weights_ih = a.weights_ih.copy();
      this.weights_ho = a.weights_ho.copy();
      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();
    } else {
      // Initialize the neural network
      this.input_nodes = in_nodes;
      this.hidden_nodes = hid_nodes;
      this.output_nodes = out_nodes;

      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes).randomize();
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes).randomize();
      this.bias_h = new Matrix(this.hidden_nodes, 1).randomize();
      this.bias_o = new Matrix(this.output_nodes, 1).randomize();
    }

    this.setLearningRate();
    this.setActivationFunction();
  }

  /**
   * Predict outputs given an input array.
   * @param {Array<number>} input_array - The input data.
   * @returns {Array<number>} The predicted output.
   */
  predict(input_array) {
    if (input_array.length !== this.input_nodes) {
      throw new Error(
        `Input array length (${input_array.length}) does not match the number of input nodes (${this.input_nodes}).`
      );
    }

    // Convert input array to matrix and calculate hidden outputs
    const inputs = Matrix.fromArray(input_array);
    const hidden = Matrix.multiply(this.weights_ih, inputs).add(this.bias_h).map(this.activation_function.func);

    // Calculate final outputs
    const outputs = Matrix.multiply(this.weights_ho, hidden).add(this.bias_o).map(this.activation_function.func);

    return outputs.toArray();
  }

  /**
   * Train the neural network with input and target arrays.
   * @param {Array<number>} input_array - The input data.
   * @param {Array<number>} target_array - The target data.
   */
  train(input_array, target_array) {
    if (input_array.length !== this.input_nodes) {
      throw new Error(
        `Input array length (${input_array.length}) does not match the number of input nodes (${this.input_nodes}).`
      );
    }
    if (target_array.length !== this.output_nodes) {
      throw new Error(
        `Target array length (${target_array.length}) does not match the number of output nodes (${this.output_nodes}).`
      );
    }

    // Convert input and target arrays to matrices
    const inputs = Matrix.fromArray(input_array);
    const targets = Matrix.fromArray(target_array);

    // Forward pass
    const hidden = Matrix.multiply(this.weights_ih, inputs).add(this.bias_h).map(this.activation_function.func);
    const outputs = Matrix.multiply(this.weights_ho, hidden).add(this.bias_o).map(this.activation_function.func);

    // Calculate output errors and gradients
    const output_errors = Matrix.subtract(targets, outputs);
    const gradients = Matrix.map(outputs, this.activation_function.dfunc)
      .multiply(output_errors)
      .multiply(this.learning_rate);

    // Update weights and biases for hidden-to-output
    const hidden_T = Matrix.transpose(hidden);
    const weight_ho_deltas = Matrix.multiply(gradients, hidden_T);
    this.weights_ho.add(weight_ho_deltas);
    this.bias_o.add(gradients);

    // Calculate hidden errors and gradients
    const who_t = Matrix.transpose(this.weights_ho);
    const hidden_errors = Matrix.multiply(who_t, output_errors);
    const hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc)
      .multiply(hidden_errors)
      .multiply(this.learning_rate);

    // Update weights and biases for input-to-hidden
    const inputs_T = Matrix.transpose(inputs);
    const weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);
    this.weights_ih.add(weight_ih_deltas);
    this.bias_h.add(hidden_gradient);
  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  copy() {
    return new NeuralNetwork(this);
  }

  mutate(func) {
    this.weights_ih.map(func);
    this.weights_ho.map(func);
    this.bias_h.map(func);
    this.bias_o.map(func);
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    const nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h = Matrix.deserialize(data.bias_h);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }
}
