import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      hasDbUrl: Boolean(process.env.DATABASE_URL),
      nodeEnv: process.env.NODE_ENV,
    }
  });
}
