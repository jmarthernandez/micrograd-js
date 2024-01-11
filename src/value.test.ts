import { expect, test } from "vitest";
import { Value } from "./value";

test(".toString() returns human readable format", () => {
  expect(new Value({ data: 10 }).toString()).toBe("Value(data=10)");
});
