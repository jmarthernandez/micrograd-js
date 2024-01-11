import { describe, expect, test } from "vitest";
import { Value } from "./value";

describe("Value class", () => {
  describe("toString method", () => {
    test("returns human-readable format", () => {
      const value = new Value({ data: 10 });
      expect(value.toString()).toBe("Value(data=10)");
    });
  });

  describe("add method", () => {
    test("performs addition with another Value", () => {
      const a = new Value({ data: 5 });
      const b = new Value({ data: 3 });
      const result = a.add(b);
      expect(result.data).toBe(8);
    });

    test("performs addition with another negative Value", () => {
      const a = new Value({ data: 5 });
      const b = new Value({ data: -3 });
      const result = a.add(b);
      expect(result.data).toBe(2);
    });

    test("performs addition with a number", () => {
      const a = new Value({ data: 5 });
      const result = a.add(3);
      expect(result.data).toBe(8);
    });

    test("performs addition with a negative number", () => {
      const a = new Value({ data: 5 });
      const result = a.add(-3);
      expect(result.data).toBe(2);
    });

    test("computes gradients correctly during backward pass", () => {
      const a = new Value({ data: 5 });
      const b = new Value({ data: 3 });
      const result = a.add(b);
      result.grad = 1.0; // Assume a downstream gradient
      result.backward();

      // Gradients should be updated for 'a' and 'b'
      expect(a.grad).toBe(1.0);
      expect(b.grad).toBe(1.0);
      expect(result.grad).toBe(1.0);
    });
  });

  describe("neg method", () => {
    test("negates the value", () => {
      const a = new Value({ data: 5 });
      const result = a.neg();
      expect(result.data).toBe(-5);
    });
  });

  describe("sub method", () => {
    test("performs subtraction with another Value", () => {
      const a = new Value({ data: 5 });
      const b = new Value({ data: 3 });
      const result = a.sub(b);
      expect(result.data).toBe(2);
    });

    test("performs subtraction with another negative Value", () => {
      const a = new Value({ data: 5 });
      const b = new Value({ data: -3 });
      const result = a.sub(b);
      expect(result.data).toBe(8);
    });

    test("performs subtraction with a number", () => {
      const a = new Value({ data: 5 });
      const result = a.sub(3);
      expect(result.data).toBe(2);
    });

    test("performs subtraction with a negative number", () => {
      const a = new Value({ data: 5 });
      const result = a.sub(-3);
      expect(result.data).toBe(8);
    });

    test("computes gradients correctly during backward pass", () => {
      const a = new Value({ data: 5 });
      const b = new Value({ data: 3 });
      const result = a.sub(b);
      result.grad = 1.0; // Assume a downstream gradient
      result.backward();

      expect(a.grad).toBe(1.0);
      expect(b.grad).toBe(-1.0);
      expect(result.grad).toBe(1.0);
    });
  });

  describe("mul method", () => {
    test("performs multiplication with another Value", () => {
      const a = new Value({ data: 5 });
      const b = new Value({ data: 3 });
      const result = a.mul(b);
      expect(result.data).toBe(15);
    });

    test("performs multiplication with a number", () => {
      const a = new Value({ data: 5 });
      const result = a.mul(3);
      expect(result.data).toBe(15);
    });

    test("computes gradients correctly during backward pass", () => {
      const a = new Value({ data: 5 });
      const b = new Value({ data: 3 });
      const result = a.mul(b);
      result.grad = 1.0; // Assume a downstream gradient
      result.backward();

      expect(a.grad).toBe(3.0);
      expect(b.grad).toBe(5.0);
      expect(result.grad).toBe(1.0);
    });
  });

  describe("div method", () => {
    test("performs division with another Value", () => {
      const a = new Value({ data: 10 });
      const b = new Value({ data: 2 });
      const result = a.div(b);
      expect(result.data).toBe(5);
    });

    test("performs division with another negative Value", () => {
      const a = new Value({ data: 10 });
      const b = new Value({ data: -2 });
      const result = a.div(b);
      expect(result.data).toBe(-5);
    });

    test("handles division by zero appropriately", () => {
      const a = new Value({ data: 10 });
      const b = new Value({ data: 0 });
      // Expect an error or specific behavior for division by zero
      expect(() => a.div(b)).toThrow();
    });

    test("computes gradients correctly during backward pass", () => {
      const a = new Value({ data: 10 });
      const b = new Value({ data: 2 });
      const result = a.div(b);
      result.grad = 1.0; // Assume a downstream gradient
      result.backward();

      expect(a.grad).toBe(0.5);
      expect(b.grad).toBe(-2.5);
      expect(result.grad).toBe(1.0);
    });
  });

  describe("pow method", () => {
    test("performs power operation with a positive exponent", () => {
      const a = new Value({ data: 2 });
      const result = a.pow(3);
      expect(result.data).toBe(8);
    });

    test("handles power operation with zero exponent appropriately", () => {
      const a = new Value({ data: 2 });
      const result = a.pow(0);
      expect(result.data).toBe(1);
    });

    test("handles power operation with negative exponent appropriately", () => {
      const a = new Value({ data: 2 });
      const result = a.pow(-2);
      expect(result.data).toBe(0.25);
    });

    test("computes gradients correctly during backward pass", () => {
      const a = new Value({ data: 2 });
      const result = a.pow(3);
      result.grad = 1.0; // Assume a downstream gradient
      result.backward();

      // Gradient should be updated for 'a'
      expect(a.grad).toBe(12.0);
      expect(result.grad).toBe(1.0);
    });
  });

  describe("tanh method", () => {
    test("computes tanh operation", () => {
      const a = new Value({ data: 0.5 });
      const result = a.tanh();
      expect(result.data).toBeCloseTo(0.462117);
    });

    test("computes gradients correctly during backward pass", () => {
      const a = new Value({ data: 0.5 });
      const result = a.tanh();
      result.grad = 1.0; // Assume a downstream gradient
      result.backward();

      expect(a.grad).toBeCloseTo(0.786986);
    });
  });

  describe("exp method", () => {
    test("computes exponential operation", () => {
      const a = new Value({ data: 2 });
      const result = a.exp();
      expect(result.data).toBeCloseTo(7.389056);
    });

    test("computes gradients correctly during backward pass", () => {
      const a = new Value({ data: 2 });
      const result = a.exp();
      result.grad = 1.0; // Assume a downstream gradient
      result.backward();

      // Gradient should be updated for 'a'
      expect(a.grad).toBeCloseTo(7.389056);
      expect(result.grad).toBe(1.0);
    });
  });

  describe("backward method", () => {
    test("computes gradients for the entire graph", () => {
      // correct values
      // o (tanh): data = 0.7071067811865476 grad = 1
      //   n (+): data = 0.8813735870195432 grad = 0.4999999999999999
      //     x1w1 + x2w2 (+): data = -6 grad = 0.4999999999999999
      //       x1w1 (*): data = -6 grad = 0.4999999999999999
      //         x1: data = 2 grad = -1.4999999999999996
      //         w1: data = -3 grad = 0.9999999999999998
      //       x2w2 (*): data = 0 grad = 0.4999999999999999
      //         x2: data = 0 grad = 0.4999999999999999
      //         w2: data = 1 grad = 0
      //     b: data = 6.881373587019543 grad = 0.4999999999999999

      // create neuron
      const x1 = new Value({ data: 2.0, label: "x1" });
      const w1 = new Value({ data: -3.0, label: "w1" });
      const x1w1 = x1.mul(w1);

      const x2 = new Value({ data: 0.0, label: "x2" });
      const w2 = new Value({ data: 1.0, label: "w2" });
      const x2w2 = x2.mul(w2);

      const x1w1x2w2 = x1w1.add(x2w2);

      const b = new Value({ data: 6.8813735870195432 });

      const n = x1w1x2w2.add(b);

      const o = n.tanh();
      o.backward();

      // Gradients should be updated for all Values
      expect(x1.grad).toBeCloseTo(-1.5);
      expect(w1.grad).toBeCloseTo(1.0);
      expect(x2.grad).toBeCloseTo(0.5);
      expect(w2.grad).toBeCloseTo(0.0);
      expect(x1w1.grad).toBeCloseTo(0.5);
      expect(x2w2.grad).toBeCloseTo(0.5);
      expect(x1w1x2w2.grad).toBeCloseTo(0.5);
      expect(b.grad).toBeCloseTo(0.5);
      expect(o.grad).toBeCloseTo(1.0);
    });
  });
});
