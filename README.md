
# Doodle Classifier

This project is a simple doodle classifier built using **p5.js** and **TensorFlow.js**. It allows users to draw simple doodles and classify them using a pre-trained machine learning model.

## Technologies Used

- **p5.js**: A JavaScript library for creative coding, used for the drawing interface.
- **TensorFlow.js**: A JavaScript library for machine learning, used to load and run the pre-trained model for classification.

## Features

- Draw your doodles on the canvas.
- Classify your doodles into different categories.
- Display the prediction result with confidence.

## Setup and Installation

### Prerequisites

To run this project, you need to have the following:

- A modern web browser (e.g., Chrome, Firefox).
- Node.js (if you plan to run it locally).
  
### Steps to Run

1. **Clone the repository**:
   ```
   git clone https://github.com/your-username/doodle-classifier.git
   cd doodle-classifier
   ```

2. **Open the HTML file**:
   - You can simply open the `index.html` file in your browser, or if you're using Node.js, you can serve it using a local server.
   - To use a simple server with Node.js, install `http-server`:
     ```
     npm install -g http-server
     ```
   - Run the server:
     ```
     http-server
     ```
   - Navigate to `http://localhost:8080` in your browser to access the app.

### How to Use

1. **Drawing**: Use the mouse or touchscreen to draw on the canvas.
2. **Classify**: Once you finish drawing, click the "Classify" button to get a prediction.
3. **View Result**: The classification result, including the category and confidence score, will appear on the screen.

## Code Overview

### Files

- **index.html**: The HTML structure for the app.
- **style.css**: The styling of the canvas and buttons.
- **sketch.js**: The main JavaScript code, using p5.js for drawing and TensorFlow.js for classification.

### sketch.js (main logic)

```javascript
let classifier;
let canvas;
let label = "Drawing...";

function setup() {
  canvas = createCanvas(280, 280);
  canvas.mouseReleased(classifyDrawing);

  // Load the model from TensorFlow.js
  classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/your-model-url/model.json', modelReady);
}

function modelReady() {
  console.log("Model Loaded!");
}

function classifyDrawing() {
  classifier.classify(canvas, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label + " with " + nf(results[0].confidence, 0, 2) + "%";
}

function draw() {
  background(255);
  stroke(0);
  strokeWeight(10);
  line(mouseX, mouseY, pmouseX, pmouseY);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(label, width / 2, height - 20);
}
```

In this code:
- **p5.js** is used to create the canvas and handle mouse/touch events for drawing.
- **ml5.js** (a wrapper around TensorFlow.js) is used to load the pre-trained model and classify the doodles.

## License

This project is licensed under the MIT License.
