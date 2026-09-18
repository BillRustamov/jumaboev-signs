import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { emptySign } from "./order";
import { stampNewOrder } from "./order-status";
import { resetShopDbForTests } from "./shop-db";
import { getOrder, listOrders, saveOrder } from "./store";

test("sqlite store migrates a JSON backup and keeps new tickets", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "jumaboev-db-"));
  const jsonPath = path.join(dir, "orders.json");
  writeFileSync(
    jsonPath,
    JSON.stringify([
      {
        ...emptySign(),
        id: "JS-OLD1",
        username: "legacy",
        source: "web",
        createdAt: "2026-01-02T00:00:00.000Z",
        status: "received",
        companyName: "ELBRUS",
        dotNumber: "20179229",
        mcNumber: "796405",
      },
    ]),
  );
  process.env.SHOP_DB_PATH = path.join(dir, "shop.sqlite");
  process.env.SHOP_JSON_PATH = jsonPath;
  process.env.SHOP_SNAPSHOT_PATH = path.join(dir, "snap.json");
  resetShopDbForTests();

  const imported = getOrder("JS-OLD1");
  assert.ok(imported);
  assert.equal(imported?.productionStatus, "RECEIVED");
  assert.equal(imported?.paymentStatus, "UNPAID");

  const created = saveOrder(
    stampNewOrder({
      ...emptySign(),
      id: "JS-NEW1",
      username: "fresh",
      source: "telegram",
      createdAt: "2026-02-01T00:00:00.000Z",
      status: "received",
      service: "PRINT_ONLY",
      printExact: false,
      printNotes: "keep the logo",
      originalFileName: "door.png",
    }),
  );
  assert.equal(created.productionStatus, "NEEDS_REVIEW");
  assert.equal(created.paymentStatus, "UNPAID");
  assert.equal(created.accessTokenHash, undefined);
  assert.ok(listOrders().some((order) => order.id === "JS-NEW1"));
  resetShopDbForTests();
});
