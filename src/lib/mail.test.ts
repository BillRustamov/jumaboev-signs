import assert from "node:assert/strict";
import { test } from "node:test";
import { accountWelcomeText, orderReceivedText } from "./shop-mail";
import { mailConfig, sendShopEmail } from "./mail";
import { emptySign } from "./order";
import { stampNewOrder } from "./order-status";

test("Resend stays off when no API key is set", async () => {
  const prevApi = process.env.RESEND_API_KEY;
  const prevKey = process.env.RESEND_KEY;
  delete process.env.RESEND_API_KEY;
  delete process.env.RESEND_KEY;
  assert.equal(mailConfig().enabled, false);
  assert.equal(
    await sendShopEmail({
      to: "driver@example.com",
      subject: "test",
      text: "no send",
    }),
    false,
  );
  if (prevApi !== undefined) process.env.RESEND_API_KEY = prevApi;
  if (prevKey !== undefined) process.env.RESEND_KEY = prevKey;
});

test("account welcome and ticket mail name the shop URLs", () => {
  process.env.APP_URL = "https://www.usprint.app";
  const welcome = accountWelcomeText({
    id: "usr_1",
    email: "driver@example.com",
    username: "history_keep",
  });
  assert.match(welcome, /driver@example.com/);
  assert.match(welcome, /usprint\.app\/account/);
  assert.match(welcome, /usprint\.app\/orders/);

  const order = stampNewOrder({
    ...emptySign(),
    id: "JS-8800",
    username: "history_keep",
    source: "web",
    createdAt: "2026-03-01T00:00:00.000Z",
    status: "received",
    service: "CUSTOM_DESIGN",
    companyName: "HISTORY FLEET",
    dotNumber: "3311300",
    mcNumber: "1051891",
  });
  const body = orderReceivedText(order);
  assert.match(body, /JS-8800/);
  assert.match(body, /HISTORY FLEET/);
  assert.match(body, /usprint\.app\/orders/);
});
