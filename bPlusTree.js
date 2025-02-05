// bPlusTree.js

// --------------- Data Structures ---------------
class BPlusNode {
    constructor(isLeaf = false) {
      this.isLeaf = isLeaf;
      this.keys = [];        // store keys
      this.children = [];    // store child pointers (or next-level nodes)
      // For a B+ tree, leaf nodes can also have a 'next' pointer to the next leaf.
      this.next = null;      // For leaf-level linked list
    }
  }
  
  // --------------- Global / Configuration ---------------
  let root = new BPlusNode(true);  // Start with an empty leaf
  let t = 3;  // branching factor (example: each node can hold up to 2t-1 keys in simplified version)
  let sleepTime = 800; // default
  let speedInput;
  
  $(document).ready(function(){
    speedInput = $("#speedBtn");
    speedChange();
    
    $("#showBtnBPlus").click(function() {
      $("#bplusContent").toggle();
    });
    
    // Initial tree is empty. Optionally, you can generate random initial inserts
    renderTree();
  });
  
  // --------------- Speed Control ---------------
  function speedChange(){
    // same logic as your existing pages
    let val = parseInt(speedInput.val());
    sleepTime = (6 - val) * 400;
  }
  
  function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // --------------- Core Functions (Insert / Search) ---------------
  async function insertKey(){
    let key = parseInt($("#bplusKey").val());
    if(isNaN(key)) return;
    
    // Insert key
    await insertBPlus(root, key);
    
    // Re-render
    renderTree();
  }
  
  async function searchKey(){
    let key = parseInt($("#searchKey").val());
    if(isNaN(key)) return;
  
    let found = await searchBPlus(root, key);
    if(found){
      $("#searchResult").text(`Key ${key} found!`);
    } else {
      $("#searchResult").text(`Key ${key} not found.`);
    }
  }
  
  // Insert into B+ Tree (highly simplified logic)
  async function insertBPlus(node, key){
    // 1) If node is leaf, insert key in order
    // 2) If overflow, split node
    // 3) Possibly do recursive splits up to root
    // This is a placeholder to show concept. Real logic is more detailed.
  
    if(node.isLeaf){
      // Insert the key in sorted order
      node.keys.push(key);
      node.keys.sort((a,b)=>a-b);
  
      // Check overflow
      if(node.keys.length >= 2*t){
        await splitLeaf(node);
      }
    } else {
      // find the child to descend into
      let i = 0;
      while(i < node.keys.length && key > node.keys[i]) i++;
      // go into child i
      await insertBPlus(node.children[i], key);
      // if child is split, maybe update node
      // ...
    }
  }
  
  // Splitting a leaf node
  async function splitLeaf(leaf){
    // Visual highlight (optional). 
    // In a real B+ tree, we’d create a new leaf, move half the keys to the new leaf, 
    // then update parent. If parent overflows, keep splitting up.
  
    let newLeaf = new BPlusNode(true);
    // move half of the keys to newLeaf
    let mid = Math.floor(leaf.keys.length / 2);
    newLeaf.keys = leaf.keys.splice(mid);
  
    // link leaves
    newLeaf.next = leaf.next;
    leaf.next = newLeaf;
  
    // If leaf has a parent, we’d update it, otherwise create a new root.
    // For demonstration, if leaf == root, we create a new root.
    if(leaf === root){
      let newRoot = new BPlusNode(false);
      newRoot.keys.push(newLeaf.keys[0]); 
      newRoot.children.push(leaf);
      newRoot.children.push(newLeaf);
      root = newRoot;
    } else {
      // we’d push newLeaf’s first key into the parent, handle parent’s overflow, etc.
      // ...
    }
  
    // Wait a bit to visualize
    await sleep(sleepTime);
  }
  
  // Searching in B+ Tree
  async function searchBPlus(node, key){
    if(node.isLeaf){
      // Linear search in node.keys
      for(let k of node.keys){
        // optional highlight step
        if(k === key){
          return true;
        }
      }
      return false;
    } else {
      // find correct child
      let i = 0;
      while(i < node.keys.length && key > node.keys[i]) i++;
      return await searchBPlus(node.children[i], key);
    }
  }
  
  // --------------- Rendering / Visualization ---------------
  function renderTree(){
    let container = $("#bPlusTreeContainer");
    container.empty();
    
    // Very simple text-based rendering (in-order). 
    // For advanced visuals, you might draw an actual tree structure or use a canvas.
    let html = buildHtml(root, 0);
    container.append(html);
  }
  
  // Recursively build a small HTML structure to represent the node and its children
  function buildHtml(node, level){
    let indent = "&nbsp;".repeat(level*4);
    let nodeDesc = node.keys.join(",");
    if(node.isLeaf){
      nodeDesc = "[Leaf: " + nodeDesc + "]";
    } else {
      nodeDesc = "[Node: " + nodeDesc + "]";
    }
    let div = `<div>${indent}${nodeDesc}</div>`;
    
    if(!node.isLeaf){
      for(let child of node.children){
        div += buildHtml(child, level+1);
      }
    }
    
    return div;
  }
  