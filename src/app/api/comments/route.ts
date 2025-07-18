import { getAuthHeaders } from "@/lib/nextwp/api/get-auth-headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post, author_name, author_email, content, parent = 0 } = body;

    // Validate required fields
    if (!post || !author_name || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get WordPress site URL from environment
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL;
    if (!wpUrl) {
      return NextResponse.json(
        { error: "WordPress URL not configured" },
        { status: 500 }
      );
    }

    // Prepare comment data for WordPress
    const commentData = {
      post,
      author_name,
      author_email: author_email || "",
      content,
      parent,
      status: "unapproved", // You might want to change this to 'pending' for moderation
    };

    const getAuthHeader = getAuthHeaders();

    // Submit comment to WordPress REST API
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader,
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("WordPress API error:", errorData);
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const newComment = await response.json();

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
