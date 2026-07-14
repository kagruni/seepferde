import { ContentValidationError, validateAllContent } from "../src/lib/content";

try {
  validateAllContent({ validateAdmin: true });
  console.log("Content validation passed.");
} catch (error) {
  if (error instanceof ContentValidationError) {
    console.error(error.message);
    process.exitCode = 1;
  } else {
    throw error;
  }
}
