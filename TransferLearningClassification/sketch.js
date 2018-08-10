let video;
let rX;
let rY;
let numClassesSelector;
let classes = [];
let trainButton;
let trainingInfo = " ";
let modelInfo = " ";
let mobileNet;
let classifier;
let speech;
let predictedLabel = "";
let predictionInfo = "Prediction:";


function setup() {
  rX = windowWidth - 400;
  rY = windowHeight - 150;
  speech = new p5.Speech();
  createCanvas(rX, rY);
  video = createCapture(VIDEO);


  //loadModel();
  video.hide();
  numClassesSelector = createSelect('');
  numClassesSelector.position(5, rY + 55);
  numClassesSelector.size(50, 20);
  for (let i = 2; i <= 10; i++) {
    numClassesSelector.option(i);
  }
  numClassesSelector.value(2);
  makeClasses(2);

  checkButtonPressed();

  numClassesSelector.input(function() {
    classifier = mobileNet.classification(video, () => console.log("video ready"));
    makeClasses(numClassesSelector.value());
    checkButtonPressed();
    // mobileNet = ml5.featureExtractor('MobileNet', function() {
    //   modelInfo = "Model Ready";
    // });
    // mobileNet.numClasses = numClassesSelector.value();
    // classifier = mobileNet.classification(video, () => console.log("video ready"));
  });

  mobileNet = ml5.featureExtractor('MobileNet', function() {
    modelInfo = "Model Ready";
  });
  trainButton = createButton("Train");
  trainButton.position(rX + 10, rY + 30);
  trainButton.mousePressed(function() {
    trainingInfo = "Training:";
    classifier.train(function(loss) {
      if (loss === null) {
        trainingInfo = "Training Completed";
        classify();
      } else {
        trainingInfo = "Training:" + loss;
      }
    });
  });
  mobileNet.numClasses = 10;
  classifier = mobileNet.classification(video, () => console.log("video ready"));

}



function classify() {
  classifier.classify(gotResults);
}

// Show the results
function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  console.log(result);
  // if (result !== predictedLabel) {
  //   predictedLabel = result;
  //   //speech.speak("Hi" + predictedLabel);
  // }
  predictionInfo = "Prediction:" + result;
  classify();
}

function makeClasses(numClasses) {
  for (let i = 0; i < classes.length; i++) {
    classes[i].classButton.remove();
    classes[i].classInput.remove();
    classes[i].numImages.remove();
  }
  classes = [];
  let firstClass = createInput();
  let firstClassButton = createButton('+');
  let firstElement = createElement("h5", "0");
  firstClass.position(numClassesSelector.x + 60, numClassesSelector.y);
  firstClassButton.position(firstClass.x + firstClass.width + 10, numClassesSelector.y);
  firstElement.position(numClassesSelector.x + 60 + firstClass.width + firstClassButton.width + 15, numClassesSelector.y - 20);
  let classObj = {
    classInput: firstClass,
    classButton: firstClassButton,
    numImages: firstElement
  };
  classes.push(classObj);

  for (let i = 1; i < numClasses; i++) {
    let _classInput = createInput();
    let _classButton = createButton('+');
    let _numImages = createElement('h5', "0");
    let prevClassI = classes[i - 1].classInput;
    let prevButton = classes[i - 1].classButton;
    let prevNumImages = classes[i - 1].numImages;

    let xC = prevNumImages.x + 20;
    let yC = classes[i - 1].classButton.y;
    if (xC >= rX + 150) {
      xC = numClassesSelector.x + 60;
      yC += 30;
    }
    let xB = xC + _classInput.width + 10;
    let yB = yC;

    let xE = xB + _classButton.width + 5;
    let yE = yB - 20;
    _classInput.position(xC, yC);
    _classButton.position(xB, yB);
    _numImages.position(xE, yE);
    classes.push({
      classInput: _classInput,
      classButton: _classButton,
      numImages: _numImages
    });
  }
  //loadModel();
}

function checkButtonPressed() {
  for (let i = 0; i < classes.length; i++) {
    let counter = 0;
    classes[i].classButton.mousePressed(function() {
      let label = classes[i].classInput.value();
      counter++;
      classifier.addImage(label);
      classes[i].numImages.html(counter);
    });
  }
}

function draw() {
  background(255);
  image(video, 0, 0, rX, rY - 40);
  textSize(20);
  fill(0);
  text(trainingInfo, 140, height - 20);
  fill(0);
  textSize(15);
  text(modelInfo, 5, height - 25);
  textSize(20);
  text(predictionInfo, 5, height - 5);

  textSize(10);
  text("Add images after the model is ready", width - 200, height - 10);
}
