import * as d3 from "d3";
import { Value } from "./value";

type Data = {
  label: string;
  data: number;
  grad: number;
  op: string;
  children: Data[];
};

export function createDataObject(node: Value) {
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
// o.backward();
// const oDataObject = createDataObject(o);

// Create a function to generate the graph
export function createGraph(data: any) {
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
// createGraph(oDataObject);
