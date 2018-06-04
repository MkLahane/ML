let x_Arr = [];
let y_Arr = [];
const learningRate = 0.1;
let optimizer; //= tf.train.sgd(learningRate);
let n = 1;
let coefficients = new Array(100);
let info;
let dragging = false;
let degreeOfPolynomialP;

function init() {
  for (let i = 0; i < n; i++) {
    let temp = tf.scalar(random(1));
    coefficients[i].assign(temp);
    temp.dispose();
  }

}

function setup() {
  createCanvas(500, 500);
  optimizer = tf.train.adam(learningRate);
  for (let i = 0; i < coefficients.length; i++) {
    coefficients[i] = tf.variable(tf.scalar(random(1)));
  }
  info = createP(' Use up and down arrow or W or S to increase and decrease the degree of polynomial.');
  degreeOfPolynomialP = createP('');

  init();

}


function draw() {
  background(0);


  degreeOfPolynomialP.html("Degree of polynomial:" + n);
  stroke(255);
  strokeWeight(8);
  tf.tidy(function() {
    if (x_Arr.length > 0) {
      optimizer.minimize(() => loss(predict(x_Arr), tf.tensor1d(y_Arr)));
    }
  });


  for (let i = 0; i < x_Arr.length; i++) {
    let px = map(x_Arr[i], 0, 1, 0, width);
    let py = map(y_Arr[i], 0, 1, height, 0);
    point(px, py);
  }

  let curveX_Arr = [];
  for (let x = 0; x < 1; x += 0.05) {
    curveX_Arr.push(x);
  }
  let curveY_Arr = tf.tidy(() => predict(curveX_Arr).dataSync());

  stroke(0, 255, 0);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let i = 0; i < curveX_Arr.length; i++) {
    let x = map(curveX_Arr[i], 0, 1, 0, width);
    let y = map(curveY_Arr[i], 0, 1, height, 0);
    vertex(x, y);
  }
  endShape();

}

function predict(x_arr) {
  const x_Tensor = tf.tensor1d(x_arr);
  let sumTensor = x_Tensor.pow(tf.scalar(n)).mul(coefficients[0]);
  for (let i = 1; i < n; i++) {
    sumTensor = sumTensor.add(x_Tensor.pow(tf.scalar(n - i)).mul(coefficients[i]));
  }
  return sumTensor;
}

function keyPressed() {
  if (key == 'W' || keyCode == UP_ARROW) {
    if (n < 100) {
      n++;
    }
    init()
  } else if (key == 'S' || keyCode == DOWN_ARROW) {
    if (n > 1) {
      n--;
    }
    init()
  }

}

function loss(guess, labels) {
  return guess.sub(labels).square().mean();
}



function mousePressed() {
  let x = map(mouseX, 0, width, 0, 1);
  let y = map(mouseY, 0, height, 1, 0);
  x_Arr.push(x);
  y_Arr.push(y);
}
