interface ValueProps {
  data: number;
  // [] = leaf node
  // [Value] = intermediate value like exp or pow
  // [Value, Value] = combining two Values like mul or add
  children?: [] | [Value] | [Value, Value];
  op?: "" | "+" | "*" | "pow" | "exp" | "tanh";
  label?: string;
}

class Value {
  data: number;
  children: [] | [Value] | [Value, Value];
  op: "" | "+" | "*" | "pow" | "exp" | "tanh";
  label: string;

  constructor(props: ValueProps) {
    this.data = props.data;
    this.children = props.children || [];
    this.op = props.op || "";
    this.label = props.label || "";
  }

  toString() {
    return `Value(data=${this.data})`;
  }

  coerceToValue(other: number | Value) {
    if (other instanceof Value) {
      return other;
    }
    return new Value({
      data: other,
    });
  }

  add(other: number | Value) {
    const otherValue = this.coerceToValue(other);
    const out = new Value({
      data: this.data + otherValue.data,
      children: [this, otherValue],
      op: "+",
    });

    // TODO: back propagation
    //
    return out;
  }

  neg() {
    return this.mul(-1);
  }

  sub(other: number | Value) {
    const otherValue = this.coerceToValue(other);
    const negativeValue = otherValue.neg();
    return this.add(negativeValue);
  }

  mul(other: number | Value) {
    const otherValue = this.coerceToValue(other);
    const out = new Value({
      data: this.data * otherValue.data,
      children: [this, otherValue],
      op: "*",
    });

    // TODO: back propagation
    //
    return out;
  }

  div(other: number | Value) {
    const otherValue = this.coerceToValue(other);
    return this.mul(otherValue.pow(-1));
  }

  pow(other: number) {
    const out = new Value({
      data: Math.pow(this.data, other),
      children: [this],
      op: "pow",
    });

    // TODO: backprop

    return out;
  }

  exp() {
    const x = this.data;

    const out = new Value({
      data: Math.exp(this.data),
      children: [this],
      op: "exp",
      label: `e^${this.data}`,
    });

    // TODO: backprop

    return out;
  }

  tanh() {
    const x = this.data;
    const t = (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1);
    const out = new Value({ data: t, children: [this], op: "tanh" });
    return out;
  }
}

// create new variables
const x1 = new Value({ data: 2.0, label: "x1" });
const w1 = new Value({ data: -3.0, label: "w1" });
const x1w1 = x1.mul(w1);
x1w1.label = "x1w1";

const x2 = new Value({ data: 0.0, label: "x2" });
const w2 = new Value({ data: 1.0, label: "w2" });
const x2w2 = x2.mul(w2);
x2w2.label = "x2w2";

const x1w1x2w2 = x1w1.add(x2w2);
x1w1x2w2.label = "x1w1x2w2";

const b = new Value({ data: 6.8813735870195432, label: "b" });

const n = x1w1x2w2.add(b);
n.label = "n";

const o = n.tanh();
o.label = "o";

console.log(o.data);
console.log(o);

function prettyPrintValue(node: Value, indent = 0) {
  const indentation = " ".repeat(indent);
  const opString = node.op ? ` (${node.op})` : "";
  console.log(indentation + node.label + opString + ": " + node.data);

  if (node.children.length > 0) {
    node.children.forEach((child) => {
      prettyPrintValue(child, indent + 2);
    });
  }
}

prettyPrintValue(o);
