import { parseBulkUserDataAdvanced } from "@/app/utils/parser";
import { getLocation } from "@/app/utils/pincode";

export async function POST(req: Request) {
  const body = await req.json();
  const text: string = body.text;

  const parsedRows = parseBulkUserDataAdvanced(text);

  const rows = await Promise.all(
    parsedRows.map(async (parsed) => {
      const location = await getLocation(parsed.pincode);

      return {
        ...parsed,
        ...location,
      };
    })
  );

  return Response.json(rows);
}
