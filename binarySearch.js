// binarySearch.js

var sleepTime;
var level = 180; // not directly used in this version, can remove if desired.

// Box references
var box1, box2, box3; 
var leftNum, midNum, rightNum;
var numItem; // references the array-item elements
var speed;   // reference to the speed input

// We'll store the array globally here
let array = [];

/**
 * Initialize the page after DOM is ready
 */
$(document).ready(function() {
  // Assign references
  box1 = $(".box1");
  box2 = $(".box2");
  box3 = $(".box3");

  leftNum = $("#leftNum");
  midNum = $("#midNum");
  rightNum = $("#rightNum");

  speed = $("#speedBtn");

  // Toggle concept of binary search
  $("#showBtn1").click(function() {
    $("#content1").toggle();
  });

  // Generate initial array
  array = generateRandomArray();
  displayArray();

  // Set initial speed
  speedChange();
});

/**
 * Called when speed changes
 */
function speedChange() {
  // If speed=5, sleepTime = (6-5)*400 = 400ms
  // If speed=1, sleepTime = (6-1)*400 = 2000ms, etc.
  sleepTime = (6 - speed.val()) * 400;
}

/**
 * Highlight line in the code snippet
 */
function codeRunner(code, index) {
  // 'code' is a jQuery selection of lines, we highlight the line at `index`
  code.css("color", "black");
  code.eq(index).css("color", "green");
}

/**
 * For a small convenience, we directly pass the lines in the binary search code snippet here
 */
function codeRunnerBinary(index) {
  let code = $(".code"); // lines with class="code"
  codeRunner(code, index);
}

/**
 * Move the highlight box (e.g. box1, box2, box3) to the position of a certain array element
 */
function move(obj, x, y) {
  obj.animate({ left: x, top: y });
}

/**
 * Return the x offset for item i
 */
function getLeft(items, i) {
  return items.eq(i).offset().left - 2;
}

/**
 * Return the y offset for item i
 */
function getTop(items, i) {
  return items.eq(i).offset().top - 2;
}

/**
 * Initialize position of highlight boxes 
 */
function initBox() {
  move(box1, getLeft(numItem, 0), getTop(numItem, 0));
  move(box2, getLeft(numItem, 0), getTop(numItem, 0));
  move(box3, getLeft(numItem, 0), getTop(numItem, 0));
}

/**
 * A sleep utility so we can "await" to create animation effect
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate and display a random sorted array
 */
function generateArray() {
  array = generateRandomArray();
  displayArray();
}

function generateRandomArray() {
  let length = Math.floor(Math.random() * 10) + 5; // 5~15
  let arr = [];
  for(let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  arr.sort((a, b) => a - b);
  return arr;
}

function displayArray() {
  let arrayDiv = document.getElementById("array");
  while (arrayDiv.firstChild) {
    arrayDiv.removeChild(arrayDiv.firstChild);
  }
  for (let i = 0; i < array.length; i++) {
    let item = document.createElement("div");
    item.className = "array-item";
    item.innerHTML = array[i];
    arrayDiv.appendChild(item);
  }
  // Re-capture jQuery references
  numItem = $(".array-item");
  // Re-initialize highlight boxes
  initBox();
}

/**
 * Perform the Binary Search with animation
 */
async function binarySearch() {
  let target = document.getElementById('target').value;
  let left = 0;
  let right = array.length - 1;

  // Move the left (box1) and right (box3) indicators initially
  move(box1, getLeft(numItem, left), getTop(numItem, left));
  await sleep(sleepTime);
  move(box3, getLeft(numItem, right), getTop(numItem, right));

  leftNum.html(left);
  rightNum.html(right);

  while (left <= right) {
    // while(left <= right)
    codeRunnerBinary(0);
    await sleep(sleepTime);

    // mid = ...
    codeRunnerBinary(1);
    await sleep(sleepTime);
    let mid = Math.floor((left + right) / 2);
    move(box2, getLeft(numItem, mid), getTop(numItem, mid));
    await sleep(sleepTime);
    midNum.html(mid);

    // if(array[mid] == target)
    codeRunnerBinary(2);
    await sleep(sleepTime);
    if (array[mid] == target) {
      document.getElementById('result').innerHTML = 'Found at index ' + mid;
      codeRunnerBinary(3); 
      await sleep(sleepTime);
      return;
    } 
    else if (array[mid] < target) {
      codeRunnerBinary(4);
      await sleep(sleepTime);
      // left = mid + 1
      codeRunnerBinary(5);
      await sleep(sleepTime);
      left = mid + 1;
      move(box1, getLeft(numItem, left), getTop(numItem, left));
      await sleep(sleepTime);
      leftNum.html(left);
    } 
    else {
      // else
      codeRunnerBinary(6);
      await sleep(sleepTime);
      // right = mid - 1
      codeRunnerBinary(7);
      await sleep(sleepTime);
      right = mid - 1;
      move(box3, getLeft(numItem, right), getTop(numItem, right));
      await sleep(sleepTime);
      rightNum.html(right);
    }
  }

  // Not found
  document.getElementById('result').innerHTML = 'Not found';
}
