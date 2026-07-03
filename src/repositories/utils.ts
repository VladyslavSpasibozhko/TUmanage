import fs from "node:fs/promises";
import { join } from "node:path";

export async function readJson<T>(path: string): Promise<T | null> {
  const content = await fs.readFile(join(process.cwd(), path), "utf-8");
  if (!content.trim()) return null;
  return JSON.parse(content) as T;
}

export async function writeJson<T>(path: string, data: T): Promise<void> {
  await fs.writeFile(
    join(process.cwd(), path),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}
