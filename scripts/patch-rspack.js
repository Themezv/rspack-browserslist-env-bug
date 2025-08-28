const fs = require("fs");
const path = require("path");

const rspackIndexPath = path.join(
  __dirname,
  "../node_modules/@rspack/core/dist/index.js"
);

try {
  // Read the file
  let content = fs.readFileSync(rspackIndexPath, "utf8");

  // Find the line with loadBrowserslist
  const targetLine =
    "browsers = binding_default().loadBrowserslist(inlineQuery, context);";
  const newLine = "console.log('resolved browsers', browsers);\n";

  // Check if our line was already added
  if (content.includes(newLine)) {
    console.log("Patch already applied, skipping...");
    process.exit(0);
  }

  // Replace the line, adding console.log after it
  const replacement = targetLine + "\n                " + newLine;
  const newContent = content.replace(targetLine, replacement);

  // Write back to the file
  fs.writeFileSync(rspackIndexPath, newContent, "utf8");

  console.log("Successfully patched rspack with browsers console.log");
} catch (error) {
  console.error("Error patching rspack:", error.message);
  process.exit(1);
}
