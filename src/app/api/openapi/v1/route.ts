import spec from "@/src/docs/openapi.v1.generated.json";

export async function GET() {
  return Response.json(spec);
}
