import * as d3 from "d3";
import { Value } from "./micrograd.ts";

// Create new weights and parameters and multiple
const x1 = new Value({ data: 2.0, label: "x1" });
const w1 = new Value({ data: -3.0, label: "w1" });
const x1w1 = x1.mul(w1);
x1w1.label = "x1w1";

const x2 = new Value({ data: 0.0, label: "x2" });
const w2 = new Value({ data: 1.0, label: "w2" });
const x2w2 = x2.mul(w2);
x2w2.label = "x2w2";

const x1w1x2w2 = x1w1.add(x2w2);
x1w1x2w2.label = "x1w1 + x2w2";

const b = new Value({ data: 6.8813735870195432, label: "b" });

const n = x1w1x2w2.add(b);
n.label = "n";

const o = n.tanh();
o.label = "o";

console.log(o.data);
console.log(o);

function prettyPrintValue(node: Value, indent = 0) {
  let str = "";
  const indentation = " ".repeat(indent);
  const opString = node.op ? ` (${node.op})` : "";
  str += `${indentation}${node.label}${opString}: data = ${node.data} grad = ${node.grad}\n`;
  if (node.children.length > 0) {
    node.children.forEach((child) => {
      str += prettyPrintValue(child, indent + 2);
    });
  }
  return str;
}

console.log(prettyPrintValue(o));

type Data = {
  label: string;
  data: number;
  grad: number;
  op: string;
  children: Data[];
};

function createDataObject(node: Value) {
  const dataObject: Data = {
    label: node.label,
    data: node.data,
    grad: node.grad,
    op: node.op,
    children: [],
  };

  if (node.children.length > 0) {
    for (const child of node.children) {
      const childData: Data = createDataObject(child);
      dataObject.children.push(childData);
    }
  }

  return dataObject;
}

const oDataObject = createDataObject(o);

// Create a function to generate the graph
function createGraph(data: any) {
  // Create an SVG element for the visualization
  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", 800)
    .attr("height", 400);
  const g = svg.append("g").attr("transform", "translate(50,50)");

  // Create a hierarchical layout
  const root = d3.hierarchy(data);
  const treeLayout = d3.tree().size([600, 300]);
  const treeData = treeLayout(root);

  // Create links between nodes
  g.selectAll(".link")
    .data(treeData.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", (d: any) => {
      return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
    });

  // Create nodes with labels and data
  const nodes = g
    .selectAll(".node")
    .data(treeData.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

  nodes.append("circle").attr("r", 8);

  nodes
    .append("text")
    .attr("dy", "0.35em")
    .attr("x", (d: any) => (d.children ? -13 : 13))
    .style("text-anchor", (d: any) => (d.children ? "end" : "start"))
    .text((d: any) => {
      return `${d.data.label}: data = ${d.data.data} grad = ${d.data.grad} (${d.data.op})`;
    });
}

// Call the createGraph function with the oDataObject
createGraph(oDataObject);
