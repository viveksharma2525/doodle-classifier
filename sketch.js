const len = 784;
const total_data = 1000;

const DONUT = 0;
const HEADPHONES = 1;
const APPLE = 2;
const SKULL = 3;
const TRACTOR = 4;

let donut_data;
let headphones_data;
let apple_data;
let skull_data;
let tractor_data;

//Training the data for classifier
let donut = {};
let headphones = {};
let apple = {};
let skull = {};
let tractor = {};

let nn;

function preload() {
    donut_data = loadBytes('data/donut1000.bin');
    headphones_data = loadBytes('data/headphones1000.bin');
    apple_data = loadBytes('data/apple1000.bin');
    skull_data = loadBytes('data/skull1000.bin');
    tractor_data = loadBytes('data/tractor1000.bin');
}


//Load the Image on the canvas

function setup() {
    cnv = createCanvas(280, 280);
    background(255);
    cnv.parent('canvasContainer');

    //preparing the data
    prepareData(donut, donut_data, DONUT);
    prepareData(headphones, headphones_data, HEADPHONES);
    prepareData(apple, apple_data, APPLE);
    prepareData(skull, skull_data, SKULL);
    prepareData(tractor, tractor_data, TRACTOR);
    
    // Making the neural network
    nn = new NeuralNetwork(784, 64, 5);

    // Radomizing the data
    let training = [];
    training = training.concat(donut.training);
    training = training.concat(headphones.training);
    training = training.concat(apple.training);
    training = training.concat(skull.training);
    training = training.concat(tractor.training);
    


    let testing = [];
    testing = testing.concat(donut.testing);
    testing = testing.concat(headphones.testing);
    testing = testing.concat(apple.testing);
    testing = testing.concat(skull.testing);
    testing = testing.concat(tractor.testing);

    let trainButton = select('#train');
    let epochCounter = 0;
        trainButton.mousePressed(function() {
        trainEpoc(training);
        epochCounter++;
        console.log("Epoch: " + epochCounter);
    });

    let testButton = select('#test');
        testButton.mousePressed(function() {
        let percent = testAll(testing);
        console.log("Percent: " + nf(percent, 2, 2) + "%");
    });

    let guessButton = select("#guess");
guessButton.mousePressed(function () {
    let inputs = new Array(784).fill(0);
    let img = get();
    img.resize(28, 28);
    img.loadPixels();
    let len = img.width * img.height;

    for (let i = 0; i < len; i++) {
        let bright = img.pixels[i * 4]; // Access red channel value
        inputs[i] = (255 - bright) / 255.0; // Normalize pixel value
    }

    if (inputs.length !== 784) {
        console.error(`Error: Input length (${inputs.length}) does not match 784.`);
        return;
    }

    let guess = nn.predict(inputs);
    let m = max(guess);
    let classification = guess.indexOf(m);

    let resultText = "Unknown"; // Default text
    if (classification === DONUT) resultText = "Donut";
    else if (classification === HEADPHONES) resultText = "Headphones";
    else if (classification === APPLE) resultText = "Apple";
    else if (classification === SKULL) resultText = "Skull";
    else if (classification === TRACTOR) resultText = "Tractor";

    console.log(resultText); // Log the name to the console
    select("#res").html(`I see: ${resultText}`); // Update the UI with the name

    image(img, 0, 0);
});

let clearButton = select('#clear');
    clearButton.mousePressed(function(){
    background(255);
    select('#res').html('');
})
       
    // for(let i = 0; i < 6; i++){
    //     trainEpoc(testing);
    //     console.log("epoch" + i);
    //     let percent = testAll(training);
    //     console.log("% Correct:" + percent);
    // }
    



    // let total = 100;
    // for(let n = 0; n < total; n++){
    //     let img = createImage(28, 28);
    //     img.loadPixels();
    //     let offset = n * 784;
    //     for (let i = 0; i < 784; i++) {
    //        let val = 255-donut_data.bytes[i + offset];
    //        img.pixels[i*4 + 0] = val;
    //        img.pixels[i*4 + 1] = val;
    //        img.pixels[i*4 + 2] = val;
    //        img.pixels[i*4 + 255] = val;
    //     }
    //     img.updatePixels();
    //     let x = ( n % 10) * 28;
    //     let y = floor(n/10) * 28;
    //     image(img, x, y);
    // }
}

function draw() {
    strokeWeight(16); 
    stroke(0); // Set the stroke color to black
    if (mouseIsPressed) {
        line(pmouseX, pmouseY, mouseX, mouseY); // Corrected to include both x and y for the end point
    }
}

