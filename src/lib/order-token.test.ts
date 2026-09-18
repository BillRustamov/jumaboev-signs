import assert from "node:assert/strict";
import { test } from "node:test";
import {
  accessTokenMatches,
  createAccessToken,
  hashAccessToken,
} from "./order-token";

test("access tokens hash and match in constant time", () => {
  const { token, hash } = createAccessToken();
  assert.equal(hash, hashAccessToken(token));
  assert.equal(accessTokenMatches(token, hash), true);
  assert.equal(accessTokenMatches("nope", hash), false);
  assert.equal(accessTokenMatches(token, ""), false);
});
