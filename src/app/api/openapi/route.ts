import spec from "@/src/docs/openapi.generated.json";

export async function GET() {
  return Response.json(spec);
}
