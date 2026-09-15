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
import { SignPreview } from "@/components/sign-preview";
import { removeFromCart, useCart } from "@/lib/cart";

export function CartPage() {
  const items = useCart();

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="size-4" />
            Cart is empty
          </CardTitle>
          <CardDescription>
            Add a ~10×20 door pair from the print desk. You can preview the
            sign here, then check both cab sides at checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/order">Open the print desk</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/samples">Browse samples</Link>
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
              {item.fields.companyName.trim().toUpperCase() || "Door pair"}
            </CardTitle>
            <CardDescription>
              Set of two · ~10×20 in each side
              {item.fields.showMc && item.fields.mcNumber
                ? ` · MC ${item.fields.mcNumber}`
                : ""}
              {item.fields.dotNumber ? ` · USDOT ${item.fields.dotNumber}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-[8.5rem_1fr] sm:items-center">
            <SignPreview
              fields={item.fields}
              className="max-w-[8.5rem]"
              signClassName="max-w-[8.5rem]"
            />
            <p className="text-sm text-muted-foreground">
              Approximately 10×20 in for each side of the cab. Click the sign
              to preview. Unit numbers are a separate small print.
            </p>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/order">Edit another door</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 className="size-4" />
              Remove
            </Button>
          </CardFooter>
        </Card>
      ))}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild>
          <Link href="/order">Keep designing</Link>
        </Button>
        <Button asChild>
          <Link href="/checkout">Checkout on the truck</Link>
        </Button>
      </div>
    </div>
  );
}
