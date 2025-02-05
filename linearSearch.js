// linearSearch.js

var sleepTime;
var level = 180; // might remove if not used
var box4;
var numItem2;
var speed;
let array = [];

/**
 * Initialize after DOM is ready
 */
$(document).ready(function() {
  box4 = $(".box4");

  speed = $("#speedBtn");

  // Toggle concept of linear search
  $("#showBtn2").click(function() {
    $("#content2").toggle();
  });

  // Generate initial array
  array = generateRandomArray2();
  displayArray2();

  // Set initial speed
  speedChange();
});

/**
 * Called when speed changes
 */
function speedChange() {
  sleepTime = (6 - speed.val()) * 400;
}

/**
 * Highlight line in the code snippet
 */
function codeRunnerLinear(index) {
  let code = $(".code2");
  code.css("color", "black");
  code.eq(index).css("color", "green");
}

/**
 * Move highlight box
 */
function move(obj, x, y) {
  obj.animate({ left: x, top: y });
}

/**
 * Return left offset
 */
function getLeft(items, i) {
  return items.eq(i).offset().left - 2;
}

/**
 * Return top offset
 */
function getTop(items, i) {
  return items.eq(i).offset().top - 2;
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate new array
 */
function generateArray2() {
  array = generateRandomArray2();
  displayArray2();
}

/**
 * Random unsorted array
 */
function generateRandomArray2() {
  let length = Math.floor(Math.random() * 10) + 5;
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  return arr;
}

/**
 * Display array
 */
function displayArray2() {
  let arrayDiv = document.getElementById("array2");
  while (arrayDiv.firstChild) {
    arrayDiv.removeChild(arrayDiv.firstChild);
  }
  for (let i = 0; i < array.length; i++) {
    let item = document.createElement("div");
    item.className = "array-item2";
    item.innerHTML = array[i];
    arrayDiv.appendChild(item);
  }

  numItem2 = $(".array-item2");
  move(box4, getLeft(numItem2, 0), getTop(numItem2, 0));
}

/**
 * Perform linear search with animation
 */
async function linearSearch() {
  let target = document.getElementById('target2').value;

  for (let i = 0; i < array.length; i++) {
    // for(let i=0; i< array.length;i++){
    codeRunnerLinear(0);
    await sleep(sleepTime);

    // Move highlight to index i
    move(box4, getLeft(numItem2, i), getTop(numItem2, i));
    await sleep(sleepTime);

    // if(array[i] == target)
    codeRunnerLinear(1);
    await sleep(sleepTime);
    if (array[i] == target) {
      document.getElementById('result2').innerHTML = 'Found at index ' + i;
      codeRunnerLinear(2);
      await sleep(sleepTime);
      return;
    }
  }
  document.getElementById('result2').innerHTML = 'Not found';
}
