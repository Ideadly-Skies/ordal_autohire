"use client";

import { Button } from "@/components/ui/button";
import { useSubscribePro } from "@/components/payments/use-subscribe-pro";

type Props = {
  amountIdr: number;
  itemName?: string;
  className?: string;
  children?: React.ReactNode;
};

export function SubscribeProCTAButton({
  amountIdr,
  itemName = "Pro Plan (Monthly)",
  className,
  children,
}: Props) {
  const { start, loading } = useSubscribePro({ amountIdr, itemName });

  return (
    <Button className={className} disabled={loading} onClick={() => start()}>
      {loading ? "Processing..." : children ?? "Upgrade to Pro"}
    </Button>
  );
}