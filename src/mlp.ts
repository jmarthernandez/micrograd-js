import { Value } from "./value";

// random float between -1 and 1
function getRandom() {
  return Math.random() * 2 + -1;
}

class Neuron {
  w: Value[];
  b: Value;
  constructor(nin: number) {
    this.w = [];
    for (let i = 0; i < nin; i++) {
      this.w.push(new Value({ data: getRandom(), label: `w${i + 1}` }));
    }
    this.b = new Value({ data: getRandom(), label: "b" });
  }

  forward(x: Value[]) {
    // Calculate the weighted sum
    let weightedSum = this.b;
    for (let i = 0; i < this.w.length; i++) {
      const wx = this.w[i].mul(x[i]);
      wx.label = `w${i + 1}x${i + 1}`;
      weightedSum = weightedSum.add(wx); // Accumulate the terms
    }
    // Apply the tanh activation function
    const out = weightedSum.tanh();

    return out;
  }

  parameters() {
    return this.w.concat(this.b);
  }
}

class Layer {
  neurons: Neuron[];

  constructor(nin: number, nout: number) {
    this.neurons = [];
    for (let i = 0; i < nout; i++) {
      this.neurons.push(new Neuron(nin));
    }
  }

  forward(x: Value[]) {
    return this.neurons.map((neuron) => neuron.forward(x));
  }

  parameters() {
    const params = [];
    for (const neuron of this.neurons) {
      params.push(...neuron.parameters());
    }
    return params;
  }
}

// class MLP:
//     def __init__(self, nin, nouts):
//         sz = [nin] + nouts
//         self.layers = [Layer(sz[i], sz[i+1]) for i in range(len(nouts))]

//     def __call__(self, x):
//         for layer in self.layers:
//             x = layer(x)
//         return x

//     def parameters(self):
//         return [p for layer in self.layers for p in layer.parameters()]

// x = [2.0, 3.0, -1.0]
// n = MLP(3, [4, 4, 1])
// n(x)

export class MLP {
  layers: Layer[];

  constructor(nin: number, nouts: number[]) {
    const sz = [nin, ...nouts];
    this.layers = sz.slice(0, -1).map((nin, i) => new Layer(nin, sz[i + 1]));
  }

  forward(x: Value[]) {
    let nextInput = x;
    for (const layer of this.layers) {
      const output = layer.forward(nextInput);
      nextInput = output;
    }
    return nextInput.length === 1 ? nextInput[0] : nextInput;
  }

  parameters() {
    const params = [];
    for (const layer of this.layers) {
      params.push(...layer.parameters());
    }
    return params;
  }
}
