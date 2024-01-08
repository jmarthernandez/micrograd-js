interface ValueProps {
  data: number;
  // [] = leaf node
  // [Value] = intermediate value like exp or pow
  // [Value, Value] = combining two Values like mul or add
  children?: [] | [Value] | [Value, Value];
  op?: "" | "+" | "*" | "pow" | "exp" | "tanh";
  label?: string;
}

export class Value {
  data: number;
  grad: number;
  children: [] | [Value] | [Value, Value];
  op: "" | "+" | "*" | "pow" | "exp" | "tanh";
  label: string;

  constructor(props: ValueProps) {
    this.data = props.data;
    this.grad = 0.0;
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
