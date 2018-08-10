let classDisplay;
let probDisplay;
let classifier;
let class2B;
let class1B;
let trainB;
let userLabel1 = "A";
let userLabel2 = "B";
//transfer learning example

//shiffman live:
//https://www.youtube.com/watch?v=mfOL2RIyk2c
//meth meth method
//https://www.youtube.com/watch?v=_x3feYZNMKY
//siraj raval
//https://www.youtube.com/watch?v=r5XKzjTFCZQ
//MANN
//http://rylanschaeffer.github.io/content/research/neural_turing_machine/main.html
//One shot learning
//https://rylanschaeffer.github.io/content/research/one_shot_learning_with_memory_augmented_nn/main.html
//reddit dataset
//https://www.reddit.com/r/datasets/comments/65o7py/updated_reddit_comment_dataset_as_torrents/
//ue4
//https://www.youtube.com/watch?v=gpYTkgFi5jU
//https://www.youtube.com/watch?v=xwh0NCJueWc&feature=push-sd&attr_tag=IzmypFz5qayUUfgO%3A6
//sentdex
//https://www.youtube.com/watch?reload=9&v=K2hFNFN9lRc&list=PLQVvvaa0QuDdc2k5dwtDTyT9aCja0on8j&index=2
//style transfer
//https://medium.com/data-science-group-iitr/artistic-style-transfer-with-convolutional-neural-network-7ce2476039fd
//3blue1brown
//https://www.youtube.com/watch?v=NO3AqAaAE6o&index=30&list=PLSQl0a2vh4HC5feHa6Rc5c0wbRTx56nF7
//c++
//https://gamedev.stackexchange.com/questions/21/easy-to-use-cross-platform-3d-engines-for-c-game-development

let video;
let mobileNet;

function setup() {
  noCanvas();

  // Create a camera input
  createCanvas(600, 600);
  video = createCapture(VIDEO);
  video.hide();
  classDisplay = createP('');
  probDisplay = createP('');
  mobileNet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobileNet.classification(video, videoReady);
  class1B = createButton("Class1");
  class2B = createButton("Class2");
  trainB = createButton("Train");
  background(0);
  class1B.mousePressed(function() {
    classifier.addImage(userLabel1);
  });
  class2B.mousePressed(function() {
    classifier.addImage(userLabel2);
  });
  trainB.mousePressed(train);



}

function train() {

  classifier.train(training);
}

function training(loss) {
  if (loss === null) {
    classify();
    console.log("Training completed");
  } else {
    console.log("Loss:"+loss);
  }
}

// Classify the current frame.
function classify() {
  classifier.classify(gotResults);
}

// Show the results
function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  classDisplay.html(result);
  classify();
}



function draw() {
  background(0);
  image(video, 0, 0, 600, 600);

}

function modelReady() {
  console.log("Model loaded");
}

function videoReady() {
  console.log("Video Ready");
}
