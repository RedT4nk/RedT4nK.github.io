// redBlackTree.js

// Possible node colors
const RED = 0;
const BLACK = 1;

// Node structure
class RBNode {
  constructor(key){
    this.key = key;
    this.color = RED;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

// Global reference to root
let rbRoot = null;
let rbSpeedInput;
let rbSleepTime = 800;

$(document).ready(function(){
  rbSpeedInput = $("#speedBtn");
  speedChange(); // set initial speed
  
  $("#showBtnRB").click(function(){
    $("#rbContent").toggle();
  });

  // Optionally: Insert some initial values
  renderRBTree();
});

function speedChange(){
  let val = parseInt(rbSpeedInput.val());
  rbSleepTime = (6 - val) * 400;
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Insert new key
async function insertRBKey(){
  let k = parseInt($("#rbKey").val());
  if(isNaN(k)) return;
  
  // Insert as in a regular BST
  let newNode = bstInsert(rbRoot, k);
  if(rbRoot == null) {
    rbRoot = newNode;
  }
  // Fix violations
  await fixViolation(newNode);
  
  // Re-render
  renderRBTree();
}

// Standard BST insert
function bstInsert(root, key){
  if(root == null){
    let node = new RBNode(key);
    return node;
  }
  if(key < root.key){
    let leftChild = bstInsert(root.left, key);
    root.left = leftChild;
    leftChild.parent = root;
  } else {
    let rightChild = bstInsert(root.right, key);
    root.right = rightChild;
    rightChild.parent = root;
  }
  return root;
}

// Fix any Red-Black violations
async function fixViolation(node){
  // If node is root, color it black
  if(node.parent == null){
    node.color = BLACK;
    return;
  }
  // If parent is black, nothing to fix
  if(node.parent.color == BLACK) {
    return;
  }
  // If parent is red, we have to fix
  // (This is a very simplified version, real logic checks "uncle" color, does rotations, etc.)
  
  // Example: if parent's sibling is also red -> recolor
  let parent = node.parent;
  let grandparent = parent.parent;
  if(grandparent == null) return;
  let uncle = null;
  if(parent == grandparent.left){
    uncle = grandparent.right;
  } else {
    uncle = grandparent.left;
  }
  
  // 1) If uncle is red
  if(uncle && uncle.color == RED){
    // Recolor parent, uncle -> black, grandparent -> red
    parent.color = BLACK;
    uncle.color = BLACK;
    grandparent.color = RED;
    // Now check for grandparent violation recursively
    await fixViolation(grandparent);
  } else {
    // 2) If uncle is black or null, do rotations
    // We'll do a minimal approach. Real logic is more extensive.
    if(parent == grandparent.left){
      // if node is parent's right child => left rotate parent
      if(node == parent.right){
        await rotateLeft(parent);
        node = parent;
        parent = node.parent;
      }
      // Now rotate right grandparent
      await rotateRight(grandparent);
      // swap colors
      let tmpColor = parent.color;
      parent.color = grandparent.color;
      grandparent.color = tmpColor;
    } else {
      // symmetrical
      if(node == parent.left){
        await rotateRight(parent);
        node = parent;
        parent = node.parent;
      }
      await rotateLeft(grandparent);
      let tmpColor = parent.color;
      parent.color = grandparent.color;
      grandparent.color = tmpColor;
    }
  }
}

// Left rotation
async function rotateLeft(node){
  let pivot = node.right;
  if(!pivot) return;
  
  // Move pivot's left subtree to node's right
  node.right = pivot.left;
  if(pivot.left) pivot.left.parent = node;
  
  pivot.parent = node.parent;
  if(node.parent == null) {
    rbRoot = pivot;
  } else if(node == node.parent.left){
    node.parent.left = pivot;
  } else {
    node.parent.right = pivot;
  }
  pivot.left = node;
  node.parent = pivot;
  
  // Pause to visualize
  await sleep(rbSleepTime);
}

// Right rotation
async function rotateRight(node){
  let pivot = node.left;
  if(!pivot) return;
  
  node.left = pivot.right;
  if(pivot.right) pivot.right.parent = node;
  
  pivot.parent = node.parent;
  if(node.parent == null){
    rbRoot = pivot;
  } else if(node == node.parent.left){
    node.parent.left = pivot;
  } else {
    node.parent.right = pivot;
  }
  pivot.right = node;
  node.parent = pivot;
  
  // Pause to visualize
  await sleep(rbSleepTime);
}

// Searching
async function searchRBKey(){
  let k = parseInt($("#rbSearchKey").val());
  if(isNaN(k)) return;
  
  let foundNode = await rbSearch(rbRoot, k);
  if(foundNode){
    $("#rbSearchResult").text(`Key ${k} found!`);
  } else {
    $("#rbSearchResult").text(`Key ${k} not found.`);
  }
}

// Basic BST search
async function rbSearch(node, key){
  if(!node) return null;
  // optional highlight or animation here
  await sleep(rbSleepTime);

  if(key == node.key){
    return node;
  } else if(key < node.key){
    return rbSearch(node.left, key);
  } else {
    return rbSearch(node.right, key);
  }
}

// Render tree
function renderRBTree(){
  let container = $("#rbTreeContainer");
  container.empty();

  // Simple text-based traversal
  let html = traverseRB(rbRoot, 0);
  container.append(html);
}

function traverseRB(node, level){
  if(!node) return "";
  
  let indent = "&nbsp;".repeat(level * 4);
  let colorStr = (node.color == RED) ? "RED" : "BLACK";
  let nodeDesc = `[${node.key} - ${colorStr}]`;
  
  let content = `<div>${indent}${nodeDesc}</div>`;
  content += traverseRB(node.left, level+1);
  content += traverseRB(node.right, level+1);
  return content;
}
