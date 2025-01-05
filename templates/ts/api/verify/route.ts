import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    // Check for the Authorization header.
    const authorizationHeader = req.headers.get("authorization");
    if (!authorizationHeader) {
      return NextResponse.json(
        { msg: "Missing Authorization header" },
        { status: 401 }
      );
    }

    // Extract the API key from the header.
    const apiKey = authorizationHeader.split("Bearer ")[1];
    if (!apiKey) {
      return NextResponse.json(
        { msg: "Invalid Authorization header format" },
        { status: 401 }
      );
    }

    // Retrieve the stored API key from the .env file.
    const storedApiKey = process.env.DROPLERT_KEY;
    if (!storedApiKey) {
      return NextResponse.json(
        { msg: "Server misconfiguration: API key is missing" },
        { status: 500 }
      );
    }

    // Compare the provided API key with the stored API key.
    if (apiKey !== storedApiKey) {
      return NextResponse.json(
        { msg: "Invalid API key" },
        { status: 403 }
      );
    }

    // Extract the base URL of the website dynamically from the request headers.
    const websiteUrl = new URL(req.url).origin; // This gives us the base URL (protocol + hostname + port)

    // Send a request to the WebSocket server's /verify endpoint to add the website to the user’s subscriptions
    const wsServerUrl = `${process.env.NEXT_PUBLIC_WS_SERVER_URL}/set`; 

    // Send verification request to WebSocket server
    let response;
    try {
      response = await axios.post(
        wsServerUrl,
       {
          droplertId: process.env.NEXT_PUBLIC_DROPLERT_ID, // Use the droplertId from your environment or logic
          websiteUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "apiKey":process.env.DROPLERT_KEY, // Include the API key from the .env file
          },
        }
      );
    } catch (err) {
      console.error("Error during WebSocket verification request:", err);
      return NextResponse.json(
        { msg: "Failed to connect to WebSocket server" },
        { status: 502 }
      );
    }

    // Check WebSocket server response status
    if (response && response.status === 200) {
      return NextResponse.json(
        { msg: "API Key validation successful, website subscribed to WebSocket server" },
        { status: 200 }
      );
    } else {
      console.error("WebSocket server failed to subscribe the website:", response?.data || "No response data");
      return NextResponse.json(
        { msg: "Failed to subscribe website to WebSocket server" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);

    // Return a generic error response.
    return NextResponse.json(
      { msg: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
