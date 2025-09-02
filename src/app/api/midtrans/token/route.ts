// app/api/midtrans/token/route.ts
import { NextResponse } from "next/server";

// midtrans-client is CJS; require() avoids ESM issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
import midtransClient from "midtrans-client";

export const runtime = "nodejs"; // ensure Node runtime

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { orderId, amount, customer? }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    if (!serverKey || !clientKey) {
      throw new Error("Midtrans serverKey or clientKey is not set in environment variables.");
    }

    const snap = new midtransClient.Snap({
      isProduction: false, // set true for prod
      serverKey,
      clientKey,
    });

    const parameter = {
      transaction_details: {
        order_id: body.orderId ?? `ORDER-${Date.now()}`,
        gross_amount: Number(body.amount ?? 10000), // in IDR
      },
      customer_details: body.customer ?? undefined,
      item_details: body.items ?? undefined,
      credit_card: { secure: true },
    };

    const tx = await snap.createTransaction(parameter);
    // tx: { token, redirect_url, ... }
    return NextResponse.json({ token: tx.token });
  } catch (err: unknown) {
    console.error("Midtrans token error:", err);
    return NextResponse.json({ error: "midtrans_error" }, { status: 500 });
  }
}
