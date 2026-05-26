import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token") || searchParams.get("secret");
  const path = searchParams.get("path") || searchParams.get("url") || "/";
  const key = searchParams.get("key");

  if (token && token !== process.env.OPTIMIZELY_GRAPH_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  const redirectPath = key ? `${path}?preview=true&key=${key}` : path;
  redirect(redirectPath);
}
