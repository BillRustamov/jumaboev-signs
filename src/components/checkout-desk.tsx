"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { clearCart, useCart } from "@/lib/cart";
import { writeLocalOrder, writeUsername, useUsername } from "@/lib/client-session";
import {
  createOrderId,
  validateSign,
  validateUsername,
  type SignOrder,
} from "@/lib/order";

export function CheckoutDesk() {
  const items = useCart();
  const storedUsername = useUsername();
  const [usernameDraft, setUsernameDraft] = useState<string | null>(null);
  const username = usernameDraft ?? storedUsername;
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState<SignOrder[]>([]);

  const ready = useMemo(
    () =>
      items.filter((item) => validateSign(item.fields).length === 0),
    [items],
  );

  async function checkout(event: React.FormEvent) {
    event.preventDefault();
    const nameError = validateUsername(username);
    if (nameError) {
      setUsernameError(nameError);
      return;
    }
    if (!ready.length) {
      setFormError("Your cart has no complete door pair to print.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    writeUsername(username.trim());
    const created: SignOrder[] = [];
    try {
      for (const item of ready) {
        const order: SignOrder = {
          ...item.fields,
          fleetNumber: "",
          id: createOrderId(),
          username: username.trim(),
          source: "web",
          createdAt: new Date().toISOString(),
          status: "received",
        };
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });
        const saved = response.ok
          ? ((await response.json()) as SignOrder)
          : order;
        writeLocalOrder(saved);
        created.push(saved);
      }
      clearCart();
      setPlaced(created);
    } catch {
      for (const order of created) writeLocalOrder(order);
      setPlaced(created);
      setFormError("Saved on this device after a network error.");
    } finally {
      setSubmitting(false);
    }
  }

  if (placed.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[var(--forest)]" />
            Order received
          </CardTitle>
          <CardDescription>
            {placed.map((order) => order.id).join(", ")} · two 11×20 doors on a
            24×24 sheet for @{placed[0]?.username}.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-wrap gap-2">
          <Button asChild>
            <Link href={`/admin/print/${placed[0].id}`}>
              Download 24×24 print sheet
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">Admin print desk</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/orders">View shop orders</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!items.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nothing to check out</CardTitle>
          <CardDescription>
            Add a door pair from the print desk first.
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2">
          <Button asChild>
            <Link href="/order">Print desk</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/cart">Open cart</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <section key={item.id} className="space-y-2">
          <div>
            <h2 className="font-heading text-lg font-semibold text-[var(--navy)]">
              {item.fields.companyName.trim().toUpperCase() || "Door pair"} on
              a white Cascadia
            </h2>
            <p className="text-sm text-muted-foreground">
              Logo sits in the lower rounded sleeper hatch. The inset is the
              24×24 so you can read the lettering.
            </p>
          </div>
          <WhiteSemiTruck fields={item.fields} />
        </section>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Send to the shop</CardTitle>
          <CardDescription>
            Tag the ticket. Khurshid prints the pair from this checkout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={checkout} autoComplete="off">
            {formError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Could not finish checkout</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}
            {usernameError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Username not accepted</AlertTitle>
                <AlertDescription>{usernameError}</AlertDescription>
              </Alert>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="checkout-username">Shop username</Label>
              <Input
                id="checkout-username"
                value={username}
                placeholder="elbrus_dispatch"
                autoComplete="username"
                onChange={(event) => {
                  setUsernameDraft(event.target.value);
                  setUsernameError(null);
                }}
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Sending to the shop
                </>
              ) : (
                `Place ${ready.length} vinyl pair${ready.length === 1 ? "" : "s"}`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
