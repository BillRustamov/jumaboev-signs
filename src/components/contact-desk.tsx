"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { shopT } from "@/lib/shop-entry";
import { useShopLang } from "@/lib/shop-lang";
import { TELEGRAM_BOT_URL } from "@/lib/telegram";

export function ContactDesk() {
  const lang = useShopLang();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{shopT(lang, "contactTitle")}</CardTitle>
        <CardDescription>{shopT(lang, "contactBody")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button asChild>
          <a href={TELEGRAM_BOT_URL} target="_blank" rel="noreferrer">
            <MessageCircle className="size-4" />
            Telegram
          </a>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">{shopT(lang, "backToMenu")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
