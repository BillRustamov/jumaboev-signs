import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  claimGuestOrders,
  createSession,
  createUser,
  authenticateUser,
  sessionTokenFromRequest,
  userFromRequest,
} from "./auth";
import {
  hashPassword,
  usernameFromEmail,
  validateEmail,
  verifyPassword,
} from "./auth-crypto";
import { emptySign, validateUsername } from "./order";
import { stampNewOrder } from "./order-status";
import { resetShopDbForTests } from "./shop-db";
import { listOrdersForAccount, saveOrder } from "./store";

function tempDb(): void {
  const dir = mkdtempSync(path.join(tmpdir(), "jumaboev-auth-"));
  process.env.SHOP_DB_PATH = path.join(dir, "shop.sqlite");
  process.env.SHOP_JSON_PATH = path.join(dir, "missing-orders.json");
  process.env.SHOP_SNAPSHOT_PATH = path.join(dir, "snap.json");
  resetShopDbForTests();
}

test("password hashes verify and reject the wrong secret", async () => {
  const stored = await hashPassword("doorvinyl1");
  assert.equal(await verifyPassword("doorvinyl1", stored), true);
  assert.equal(await verifyPassword("doorvinyl2", stored), false);
});

test("email local-part becomes a valid shop username", () => {
  const handle = usernameFromEmail("elbrus.dispatch@fleet.example");
  assert.equal(validateUsername(handle), null);
  assert.equal(handle, "elbrus_dispatch");
  assert.equal(validateUsername("elbrus.dispatch@fleet.example"), null);
  assert.equal(validateEmail("not-an-email"), "Enter a valid email.");
});

test("new accounts use email as the shop username", async () => {
  tempDb();
  const created = await createUser({
    email: "fleet@example.com",
    password: "doorvinyl1",
  });
  assert.ok("user" in created);
  if (!("user" in created)) return;
  assert.equal(created.user.username, "fleet@example.com");
});

test("account tickets persist and guest history is claimed", async () => {
  tempDb();
  const guest = await saveOrder(
    stampNewOrder({
      ...emptySign(),
      id: "JS-AUTH1",
      username: "elbrus_dispatch",
      source: "web",
      createdAt: "2026-03-01T00:00:00.000Z",
      status: "received",
      service: "CUSTOM_DESIGN",
      companyName: "ELBRUS",
      dotNumber: "20179229",
      mcNumber: "796405",
    }),
  );
  assert.equal(guest.userId, undefined);

  const created = await createUser({
    email: "Elbrus.Dispatch@fleet.example",
    password: "doorvinyl1",
    username: "elbrus_dispatch",
  });
  assert.ok("user" in created);
  if (!("user" in created)) return;
  assert.equal(created.user.email, "elbrus.dispatch@fleet.example");

  const again = await createUser({
    email: "elbrus.dispatch@fleet.example",
    password: "doorvinyl1",
  });
  assert.deepEqual(again, {
    error: "An account with this email already exists.",
    status: 409,
  });

  assert.ok(await authenticateUser("elbrus.dispatch@fleet.example", "doorvinyl1"));
  assert.equal(
    await authenticateUser("elbrus.dispatch@fleet.example", "wrong-pass"),
    undefined,
  );

  assert.equal(await claimGuestOrders(created.user), 1);
  const mine = await listOrdersForAccount(created.user);
  assert.equal(mine.map((order) => order.id).join(), "JS-AUTH1");
  assert.equal(mine[0]?.userId, created.user.id);

  const token = await createSession(created.user.id);
  const request = new Request("http://127.0.0.1/api/auth/me", {
    headers: { cookie: `jumaboev_session=${token}` },
  });
  assert.equal(sessionTokenFromRequest(request), token);
  const sessionUser = await userFromRequest(request);
  assert.equal(sessionUser?.id, created.user.id);
  resetShopDbForTests();
});
