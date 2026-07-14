import { ZodError } from "zod";

export interface ContentIssue {
  filePath: string;
  field: string;
  message: string;
}

function normalizePath(filePath: string): string {
  const cwd = process.cwd();
  return filePath.startsWith(cwd) ? filePath.slice(cwd.length + 1) : filePath;
}

export function issue(
  filePath: string,
  field: string,
  message: string
): ContentIssue {
  return { filePath: normalizePath(filePath), field, message };
}

export function issuesFromZodError(
  filePath: string,
  error: ZodError
): ContentIssue[] {
  return error.issues.map((entry) =>
    issue(
      filePath,
      entry.path.length > 0 ? entry.path.join(".") : "Inhalt",
      entry.message
    )
  );
}

export function formatContentIssues(issues: ContentIssue[]): string {
  const grouped = new Map<string, ContentIssue[]>();

  for (const contentIssue of issues) {
    const current = grouped.get(contentIssue.filePath) ?? [];
    current.push(contentIssue);
    grouped.set(contentIssue.filePath, current);
  }

  const sections = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "de"))
    .map(([filePath, fileIssues]) => {
      const details = fileIssues
        .sort((a, b) => a.field.localeCompare(b.field, "de"))
        .map((entry) => `  - ${entry.field}: ${entry.message}`)
        .join("\n");
      return `${filePath}\n${details}`;
    });

  return `Content validation failed\n\n${sections.join("\n\n")}`;
}

export class ContentValidationError extends Error {
  readonly issues: ContentIssue[];

  constructor(issues: ContentIssue[]) {
    super(formatContentIssues(issues));
    this.name = "ContentValidationError";
    this.issues = issues;
  }
}
