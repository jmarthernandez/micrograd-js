import { Value } from "./value.ts";
import { MLP } from "./mlp.ts";

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

const b = new Value({ data: 6.8813735870195432, label: "b" });

const n = x1w1x2w2.add(b);
n.label = "n";

const o = n.tanh();
o.label = "o";
o.backward();

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

const x = [2.0, 3.0, -1.0].map(
  (data, i) => new Value({ data, label: `x${i + 1}` })
);
const mlp = new MLP(3, [4, 4, 1]);
const result = mlp.forward(x);
console.log(result);

// Get the 'graph' element
const graphElement = document.getElementById("graph");

// Create a 'pre' element
const preElement = document.createElement("pre");

// Call the prettyPrintValue function and set its result as the 'pre' element's text content

if (!Array.isArray(result)) {
  preElement.textContent = prettyPrintValue(result);
}

// Append the 'pre' element to the 'graph' element
graphElement?.appendChild(preElement);
