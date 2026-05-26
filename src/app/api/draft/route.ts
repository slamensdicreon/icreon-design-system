import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/";

  if (secret !== process.env.OPTIMIZELY_GRAPH_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();
  redirect(path);
}
