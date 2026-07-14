import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { issue, type ContentIssue } from "./errors";

export interface ImageMetadata {
  width: number;
  height: number;
  type?: string;
  bytes: number;
}

export const MAX_UPLOADED_IMAGE_BYTES = 2_500_000;

export function resolvePublicImagePath(src: string): string {
  return path.join(process.cwd(), "public", src.replace(/^\//, ""));
}

export function inspectImage(src: string): ImageMetadata {
  const filePath = resolvePublicImagePath(src);
  const stats = fs.statSync(filePath);
  const dimensions = imageSize(fs.readFileSync(filePath));

  if (!dimensions.width || !dimensions.height) {
    throw new Error("Die Bildabmessungen konnten nicht gelesen werden.");
  }

  return {
    width: dimensions.width,
    height: dimensions.height,
    type: dimensions.type,
    bytes: stats.size,
  };
}

export function validateImage(
  src: string,
  ownerFilePath: string,
  field: string
): { metadata?: ImageMetadata; issues: ContentIssue[] } {
  const issues: ContentIssue[] = [];

  if (!src.startsWith("/images/")) {
    issues.push(
      issue(
        ownerFilePath,
        field,
        "Bilder müssen aus dem öffentlichen Verzeichnis /images/ stammen."
      )
    );
    return { issues };
  }

  const imagePath = resolvePublicImagePath(src);
  if (!fs.existsSync(imagePath)) {
    issues.push(issue(ownerFilePath, field, `Die Bilddatei ${src} fehlt.`));
    return { issues };
  }

  try {
    const metadata = inspectImage(src);
    if (
      src.startsWith("/images/uploads/") &&
      metadata.bytes > MAX_UPLOADED_IMAGE_BYTES
    ) {
      issues.push(
        issue(
          ownerFilePath,
          field,
          `Das hochgeladene Bild ist größer als 2,5 MB (${Math.ceil(
            metadata.bytes / 1_000
          )} KB).`
        )
      );
    }
    return { metadata, issues };
  } catch (error) {
    issues.push(
      issue(
        ownerFilePath,
        field,
        error instanceof Error
          ? `Die Bilddatei kann nicht gelesen werden: ${error.message}`
          : "Die Bilddatei kann nicht gelesen werden."
      )
    );
    return { issues };
  }
}
