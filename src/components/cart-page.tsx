"use client";

import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WhiteSemiTruck } from "@/components/white-semi-truck";
import { removeFromCart, useCart } from "@/lib/cart";
import { uiT } from "@/lib/shop-copy";
import { useShopLang } from "@/lib/shop-lang";

export function CartPage() {
  const lang = useShopLang();
  const items = useCart();

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="size-4" />
            {uiT(lang, "cartEmpty")}
          </CardTitle>
          <CardDescription>{uiT(lang, "cartEmptyLead")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/order">{uiT(lang, "keepDesigning")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/print">{uiT(lang, "printDesk")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>
              {item.fields.companyName.trim().toUpperCase() || uiT(lang, "doorPair")}
            </CardTitle>
            <CardDescription>
              {uiT(lang, "setOfTwo")}
              {item.fields.mcNumber
                ? ` · MC ${item.fields.mcNumber}`
                : ""}
              {item.fields.dotNumber ? ` · USDOT ${item.fields.dotNumber}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <WhiteSemiTruck fields={item.fields} />
            <p className="text-sm text-muted-foreground">
              {uiT(lang, "cartItemNote")}
            </p>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/order">{uiT(lang, "editAnother")}</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 className="size-4" />
              {uiT(lang, "remove")}
            </Button>
          </CardFooter>
        </Card>
      ))}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild>
          <Link href="/order">{uiT(lang, "keepDesigning")}</Link>
        </Button>
        <Button asChild>
          <Link href="/checkout">{uiT(lang, "checkoutOnTruck")}</Link>
        </Button>
      </div>
    </div>
  );
}
