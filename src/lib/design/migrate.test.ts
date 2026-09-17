import assert from "node:assert/strict";
import { test } from "node:test";
import {
  migrateCityState,
  parsePlace,
  resolvePlace,
} from "./migrate";
import { normalizeSign } from "../order";

test("legacy legalName city/state migrates off legalName", () => {
  const moved = migrateCityState({ legalName: "Dallas, TX" });
  assert.equal(moved.city, "Dallas");
  assert.equal(moved.state, "TX");
  assert.equal(moved.legalName, "");
});

test("parsePlace rejects company LLC strings", () => {
  assert.equal(parsePlace("ELBRUS FREIGHTLINES LLC"), null);
  assert.ok(parsePlace("PHOENIX, AZ"));
});

test("normalizeSign does not keep city in legalName", () => {
  const fields = normalizeSign({
    companyName: "ELBRUS",
    legalName: "DALLAS, TX",
    dotNumber: "20179229",
    mcNumber: "796405",
  });
  assert.equal(fields.city.toUpperCase(), "DALLAS");
  assert.equal(fields.state, "TX");
  assert.equal(fields.legalName, "");
  assert.equal(fields.design?.widthIn, 20);
  assert.equal(fields.design?.heightIn, 12);
});

test("place line prefers city and state fields", () => {
  assert.equal(
    resolvePlace({ city: "Houston", state: "TX", legalName: "Ignored LLC" }),
    "HOUSTON, TX",
  );
});
