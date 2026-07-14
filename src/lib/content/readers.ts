import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

export interface JsonDocument {
  data: unknown;
  filePath: string;
  relativePath: string;
}

export interface MarkdownDocument extends JsonDocument {
  body: string;
  slug: string;
}

export function contentPath(relativePath: string): string {
  return path.join(CONTENT_ROOT, relativePath);
}

export function readJsonDocument(relativePath: string): JsonDocument {
  const filePath = contentPath(relativePath);
  const raw = fs.readFileSync(filePath, "utf8");
  return { data: JSON.parse(raw), filePath, relativePath };
}

export function readOptionalJsonDocument(
  relativePath: string
): JsonDocument | undefined {
  return fs.existsSync(contentPath(relativePath))
    ? readJsonDocument(relativePath)
    : undefined;
}

export function readMarkdownDocument(relativePath: string): MarkdownDocument {
  const filePath = contentPath(relativePath);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  return {
    data: parsed.data,
    body: parsed.content.trim(),
    filePath,
    relativePath,
    slug: path.basename(relativePath, path.extname(relativePath)),
  };
}

export function readMarkdownCollection(directory: string): MarkdownDocument[] {
  return listMarkdownFiles(directory).map(readMarkdownDocument);
}

export function listMarkdownFiles(directory: string): string[] {
  const fullDirectory = contentPath(directory);
  if (!fs.existsSync(fullDirectory)) return [];

  return fs
    .readdirSync(fullDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(directory, entry.name))
    .sort((a, b) => a.localeCompare(b, "de"));
}

export function filenameSlugIsValid(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
