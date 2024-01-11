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
  _backward: () => void;

  constructor(props: ValueProps) {
    this.data = props.data;
    this.grad = 0.0;
    this.children = props.children || [];
    this.op = props.op || "";
    this.label = props.label || "";
    this._backward = () => {};
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

  // Backward pass for the addition operation (self + other)
  add(other: number | Value) {
    const otherValue = this.coerceToValue(other);
    const out = new Value({
      data: this.data + otherValue.data,
      children: [this, otherValue],
      op: "+",
    });

    out._backward = () => {
      // d(out)/d(this) = 1.0, d(out)/d(otherValue) = 1.0
      this.grad += 1.0 * out.grad;
      otherValue.grad += 1.0 * out.grad;
    };

    return out;
  }

  // Backward pass for the negation operation (-self)
  neg() {
    return this.mul(-1);
  }

  // Backward pass for the subtraction operation (self - other)
  sub(other: number | Value) {
    const otherValue = this.coerceToValue(other);
    const negativeValue = otherValue.neg();
    return this.add(negativeValue);
  }

  // Backward pass for the multiplication operation (self * other)
  mul(other: number | Value) {
    const otherValue = this.coerceToValue(other);
    const out = new Value({
      data: this.data * otherValue.data,
      children: [this, otherValue],
      op: "*",
    });

    out._backward = () => {
      // d(out)/d(this) = otherValue.data, d(out)/d(otherValue) = this.data
      this.grad += otherValue.data * out.grad;
      otherValue.grad += this.data * out.grad;
    };

    return out;
  }

  // Backward pass for the division operation (self / other)
  div(other: number | Value) {
    const otherValue = this.coerceToValue(other);
    return this.mul(otherValue.pow(-1));
  }

  // Backward pass for the power operation (self ** other)
  pow(other: number) {
    const out = new Value({
      data: this.data ** other,
      children: [this],
      op: `pow`,
      label: `**${other}`,
    });

    out._backward = () => {
      // d(out)/d(this) = other * this.data^(other-1)
      this.grad += other * this.data ** (other - 1) * out.grad;
    };

    return out;
  }

  // Backward pass for the tanh operation (tanh(self))
  tanh() {
    const x = this.data;
    const t = (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1);
    const out = new Value({ data: t, children: [this], op: "tanh" });

    out._backward = () => {
      // d(out)/d(this) = 1 - tanh(self)^2
      this.grad += (1 - t ** 2) * out.grad;
    };

    return out;
  }

  // Backward pass for the exponential operation (exp(self))
  exp() {
    const out = new Value({
      data: Math.exp(this.data),
      children: [this],
      op: "exp",
      label: `e^${this.data}`,
    });

    out._backward = () => {
      // d(out)/d(this) = out.data
      this.grad += out.data * out.grad;
    };

    return out;
  }

  // Backward pass to compute gradients
  backward() {
    const topo: Value[] = [];
    const visited = new Set();
    const buildTopo = (v: Value) => {
      if (!visited.has(v)) {
        visited.add(v);
        v.children.forEach((child) => {
          if (child instanceof Value) {
            buildTopo(child);
          }
        });
        topo.push(v);
      }
    };

    buildTopo(this);
    this.grad = 1.0;
    // walk the graph in reverse
    for (let i = topo.length - 1; i >= 0; i--) {
      topo[i]._backward();
    }
  }
}
