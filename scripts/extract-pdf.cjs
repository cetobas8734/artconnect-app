// Simple PDF text extractor
// Usage: node scripts/extract-pdf.cjs <input.pdf> [output.txt]

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function main() {
  const [, , inputPath, outputArg] = process.argv;
  if (!inputPath) {
    console.error('Usage: node scripts/extract-pdf.cjs <input.pdf> [output.txt]');
    process.exit(1);
  }
  if (!fs.existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}`);
    process.exit(1);
  }
  const defaultOut = inputPath.replace(/\.pdf$/i, '.txt');
  const outputPath = outputArg || defaultOut;

  try {
    const dataBuffer = fs.readFileSync(inputPath);
    const data = await pdf(dataBuffer);
    fs.writeFileSync(outputPath, data.text || '', 'utf8');
    console.log(`Extracted ${data.numpages || '?'} pages -> ${outputPath}`);
  } catch (err) {
    console.error('Failed to extract PDF:', err.message || err);
    process.exit(1);
  }
}

main();
