const CREATE_MODE = 1;
const CONNECT_MODE = 0;
const MOVE_MODE = 2;
const DEL_MODE = 3;
// MODES TO COMPLETE
const BFS_MODE = 4;
const DFS_MODE = 5;
const DIJKSTRA = 6;

let currMode = CREATE_MODE;
let graph = null;
let firstClick = true;
let selectedVertex = null;
let dragNode = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  graph = new UndirectedGraph();
}

function draw() {
  background(255);
  if(currMode == CREATE_MODE){
    fill(0);
    noStroke();
    textSize(25);
    let message = "Create vertices by left clicking";
    text(message, width / 2 - textWidth(message)/2, height / 8);
  }
  else if(currMode == CONNECT_MODE){
    fill(0);
    noStroke();
    textSize(25);
    let message = "Create edges by clicking vertices";
    text(message, width / 2 - textWidth(message)/2, height / 8);
  }
  else if (currMode == MOVE_MODE){
    fill(0);
    noStroke();
    textSize(25);
    let message = "Move vertices by clicking and dragging";
    text(message, width / 2 - textWidth(message)/2, height / 8);
  }
  else if (currMode == DEL_MODE){
    fill(0);
    noStroke();
    textSize(25);
    let message = "Delete vertex and connecting edges";
    text(message, width / 2 - textWidth(message)/2, height / 8);
  }
  graph.drawGraph();
}

function mousePressed(){
  if(currMode == CREATE_MODE){
    graph.addVertex(mouseX, mouseY);
  }
  // Make sure a node cannot be connected to itself...
  else if(currMode == CONNECT_MODE){
    // console.log(firstClick);
    let node = graph.findVertexByCoord(mouseX, mouseY);
    if(firstClick && node != null){
      selectedVertex = node;
      firstClick = false;
    }
    else if(!firstClick && node != null){
      graph.connectVertices(selectedVertex, node);
      firstClick = true;
      selectedVertex = null;
      // console.log(graph.edges);
    }else if(!firstClick && node == null){
      firstClick = true;
      selectedVertex = null;
    }
  }
  else if (currMode == MOVE_MODE){
    dragNode = graph.findVertexByCoord(mouseX, mouseY);
  }
  else if(currMode == DEL_MODE){
    let delNode = graph.findVertexByCoord(mouseX, mouseY);
    graph.deleteNode(delNode);
  }
}

function mouseDragged(){
  if(currMode == MOVE_MODE && dragNode != null){
    dragNode.x = mouseX;
    dragNode.y = mouseY;
  }
}

function keyPressed(){
  if(key == 'c'){
    currMode = CONNECT_MODE
  }
  else if(key == 'a'){
    currMode = CREATE_MODE
  }
  else if(key == 'm'){
    currMode = MOVE_MODE;
  }
  else if (key == 'd'){
    currMode = DEL_MODE;
  }
}

class UndirectedGraph{
  constructor(){
    this.edges = {}
    this.vertices = [];
    this.id = 0;
  }
  addVertex(x, y){
    this.vertices.push(new Vertex(x, y, this.id));
    this.edges[this.id] = new Set();
    this.id++;
  }
  findVertexByCoord(x, y){
    for(let i = 0; i < this.vertices.length; i++){
      if(this.vertices[i].isClicked(x, y)){
        return this.vertices[i];
      }
    }
    return null;
  }
  findVertexById(id){
    for(let i = 0; i < this.vertices.length; i++){
      if(this.vertices[i].id == id){
        return this.vertices[i];
      }
    }
    return null;
  }
  connectVertices(one, two){
    this.edges[one.id].add(two.id);
    this.edges[two.id].add(one.id);
  }
  drawVertices(){
     this.vertices.forEach(vertex => vertex.drawMe());
  }
  drawEdges(){
    this.vertices.forEach(vertex =>{
      let startNode = vertex;
      let startId = startNode.id;
      this.edges[startId].forEach(id =>{
        let endNode = this.findVertexById(id);
        stroke(0, 100, 0);
        fill(0, 100, 0);
        line(startNode.x, startNode.y, endNode.x, endNode.y);
      });
    });
  }
  drawGraph(){
    this.drawVertices();
    this.drawEdges();
  }
  deleteNode(node){
    if(node == null) return
    // Delete from vertex list (easy)
    // Delete from edge lists (medium)
    for(let i = 0; i < this.vertices.length; i++){
      if(this.vertices[i].id == node.id){
        this.vertices.splice(i, 1);
      }
    }
    // Remove edges now... need to go through each edge pairings
    for(let vKey in this.edges){
      this.edges[vKey].delete(node.id);
    }
    delete this.edges[node.id];
  }
}

class Vertex{
  constructor(x, y, id){
    this.id = id;
    this.x = x;
    this.y = y;
    this.diameter = 20;
    this.radius = this.diameter / 2;
  }
  drawMe(){
    fill(255, 0, 0);
    stroke(255, 0, 0);
    circle(this.x, this.y, this.diameter);
    noStroke();
    fill(0);
    text(this.id, this.x - this.diameter, this.y - this.diameter);
  }
  isClicked(x, y){
    return dist(this.x, this.y, x, y) < this.radius;
  }
}