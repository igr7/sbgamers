import { NextRequest, NextResponse } from "next/server";
import { alertQueries, isDatabaseConfigured } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, product_id, target_price, alert_type = "price_drop" } = body;

    if (!email || !product_id) {
      return NextResponse.json(
        { error: "Email and product_id are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!isDatabaseConfigured()) {
      // Return success for demo mode
      return NextResponse.json({
        success: true,
        message: "Alert created (demo mode)",
        data: { email, product_id, alert_type },
      });
    }

    const result = await alertQueries.create({
      email,
      product_id,
      target_price: target_price || undefined,
      alert_type,
    });

    return NextResponse.json({
      success: true,
      message: "Alert created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    // Handle duplicate alert
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You already have an alert for this product" },
        { status: 409 }
      );
    }
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id || !email) {
      return NextResponse.json(
        { error: "Alert ID and email are required" },
        { status: 400 }
      );
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Alert deleted (demo mode)",
      });
    }

    await alertQueries.delete(id, email);

    return NextResponse.json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete alert" },
      { status: 500 }
    );
  }
}
