import { corsHeaders, handleCorsResponse, addCorsHeaders } from "@/lib/cors";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

async function checkAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  return user.email === process.env.ADMIN_EMAIL;
}

// Handle CORS preflight requests
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return handleCorsResponse(origin);
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_category")
    .select("*, event(count)")
    .order("category_id", { ascending: true });

  if (error) {
    const response = NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
    return addCorsHeaders(response, origin);
  }

  const formattedData = data.map((cat: any) => ({
    ...cat,
    event_count: cat.event?.[0]?.count || 0,
  }));

  const response = NextResponse.json({ categories: formattedData });
  return addCorsHeaders(response, origin);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const supabase = (await createClient()) as any;

  if (!(await checkAdmin(supabase))) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return addCorsHeaders(response, origin);
  }

  try {
    const body = await request.json();

    if (!body.category_name) {
      const response = NextResponse.json(
        { error: "Category Name is required" },
        { status: 400 }
      );
      return addCorsHeaders(response, origin);
    }

    const { data, error } = await supabase
      .from("event_category")
      .insert({
        category_name: body.category_name,
        description: body.description || null,
        category_image: body.category_image || null,
      })
      .select()
      .single();

    if (error) throw error;

    const response = NextResponse.json(
      { success: true, category: data },
      { status: 201 }
    );
    return addCorsHeaders(response, origin);
  } catch (error: any) {
    const response = NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
    return addCorsHeaders(response, origin);
  }
}

//remove category
export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  const supabase = (await createClient()) as any;

  if (!(await checkAdmin(supabase))) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return addCorsHeaders(response, origin);
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      const response = NextResponse.json(
        { error: "ID required" },
        { status: 400 }
      );
      return addCorsHeaders(response, origin);
    }

    const { error } = await supabase
      .from("event_category")
      .delete()
      .eq("category_id", Number(id));

    if (error) throw error;

    const response = NextResponse.json({ success: true });
    return addCorsHeaders(response, origin);
  } catch (error: any) {
    const response = NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
    return addCorsHeaders(response, origin);
  }
}

// update category details
export async function PUT(request: Request) {
  const origin = request.headers.get("origin");
  const supabase = (await createClient()) as any;

  if (!(await checkAdmin(supabase))) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return addCorsHeaders(response, origin);
  }

  try {
    const body = await request.json();

    if (!body.category_id) {
      const response = NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
      return addCorsHeaders(response, origin);
    }

    const updates: any = {};

    if (body.category_name) updates.category_name = body.category_name;
    if (body.description) updates.description = body.description;
    if (body.category_image) updates.category_image = body.category_image;

    const { data, error } = await supabase
      .from("event_category")
      .update(updates)
      .eq("category_id", Number(body.category_id))
      .select()
      .single();

    if (error) throw error;

    const response = NextResponse.json({ success: true, category: data });
    return addCorsHeaders(response, origin);
  } catch (error: any) {
    console.error("Update Category Error:", error);
    const response = NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
    return addCorsHeaders(response, origin);
  }
}
