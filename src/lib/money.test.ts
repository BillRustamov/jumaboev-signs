import assert from "node:assert/strict";
import { test } from "node:test";
import { formatUsd, isPriced, parseUsdToMinor } from "./money";

test("price parser rejects zero and junk", () => {
  assert.equal(parseUsdToMinor("0"), null);
  assert.equal(parseUsdToMinor("$0.00"), null);
  assert.equal(parseUsdToMinor("nope"), null);
  assert.equal(parseUsdToMinor("85"), 8500);
  assert.equal(parseUsdToMinor("$85.50"), 8550);
  assert.equal(isPriced(0), false);
  assert.equal(isPriced(8500), true);
  assert.equal(formatUsd(8500), "$85.00");
});
