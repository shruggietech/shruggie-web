import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = new URL("../", import.meta.url);
const projectPath = fileURLToPath(projectRoot);
const globalStyles = readFileSync(
  new URL("styles/globals.css", projectRoot),
  "utf8",
);

function extractBlock(source, selector) {
  const start = source.indexOf(selector);
  assert.notEqual(start, -1, `Missing CSS block: ${selector}`);

  const openingBrace = source.indexOf("{", start);
  let depth = 0;

  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openingBrace + 1, index);
  }

  throw new Error(`Unclosed CSS block: ${selector}`);
}

function readVariable(block, name) {
  const match = block.match(new RegExp(`${name}\\s*:\\s*([^;]+);`, "i"));
  assert.ok(match, `Missing CSS variable: ${name}`);
  return match[1].trim();
}

function resolveVariable(
  name,
  primaryBlock,
  fallbackBlock = primaryBlock,
  seen = new Set(),
) {
  assert.ok(!seen.has(name), `Circular CSS variable reference: ${name}`);
  seen.add(name);

  const primaryMatch = primaryBlock.match(
    new RegExp(`${name}\\s*:\\s*([^;]+);`, "i"),
  );
  const value = primaryMatch
    ? primaryMatch[1].trim()
    : readVariable(fallbackBlock, name);
  const reference = value.match(/^var\((--[a-z0-9-]+)\)$/i);

  return reference
    ? resolveVariable(reference[1], primaryBlock, fallbackBlock, seen)
    : value;
}

function relativeLuminance(hex) {
  const channels = hex
    .replace("#", "")
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  const darker = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  return (lighter + 0.05) / (darker + 0.05);
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return [".ts", ".tsx", ".css"].includes(extname(entry.name)) ? [path] : [];
  });
}

const rootBlock = extractBlock(globalStyles, "\n  :root {");
const darkBlock = extractBlock(globalStyles, "\n  .dark {");

test("light-theme green foreground roles meet WCAG AA", () => {
  const background = resolveVariable("--bg-primary", rootBlock);
  const accessibleGreen = resolveVariable(
    "--brand-green-foreground",
    rootBlock,
  );
  const accent = resolveVariable("--accent-color", rootBlock);
  const accentHover = resolveVariable("--accent-hover-color", rootBlock);
  const focus = resolveVariable("--focus-color", rootBlock);

  assert.equal(accessibleGreen.toUpperCase(), "#037B40");
  assert.equal(accent, accessibleGreen);
  assert.equal(focus, accessibleGreen);
  assert.ok(contrastRatio(accent, background) >= 4.5);
  assert.ok(contrastRatio(accentHover, background) >= 4.5);
  assert.ok(contrastRatio(focus, background) >= 4.5);
});

test("dark-theme identity accent remains bright and accessible", () => {
  const background = resolveVariable("--bg-primary", darkBlock, rootBlock);
  const accessibleGreen = resolveVariable(
    "--brand-green-foreground",
    darkBlock,
    rootBlock,
  );
  const brightGreen = resolveVariable(
    "--brand-green-bright",
    darkBlock,
    rootBlock,
  );
  const accent = resolveVariable("--accent-color", darkBlock, rootBlock);
  const focus = resolveVariable("--focus-color", darkBlock, rootBlock);

  assert.equal(accessibleGreen.toUpperCase(), "#037B40");
  assert.equal(brightGreen.toUpperCase(), "#2BCC73");
  assert.equal(accent, brightGreen);
  assert.equal(focus, brightGreen);
  assert.ok(contrastRatio(accent, background) >= 4.5);
  assert.ok(contrastRatio(focus, background) >= 4.5);
});

test("accent-filled controls use a foreground that passes in each theme", () => {
  const lightAccent = resolveVariable("--accent-color", rootBlock);
  const darkAccent = resolveVariable("--accent-color", darkBlock, rootBlock);

  assert.ok(contrastRatio("#FFFFFF", lightAccent) >= 4.5);
  assert.ok(contrastRatio("#000000", darkAccent) >= 4.5);

  for (const relativePath of [
    "components/blog/Pagination.tsx",
    "components/ui/SkipLink.tsx",
  ]) {
    const source = readFileSync(join(projectPath, relativePath), "utf8");
    assert.match(source, /bg-accent[^"\n]*text-white[^"\n]*dark:text-black/);
  }
});

test("foreground and focus utilities do not use the static bright token", () => {
  const violations = ["app", "components"]
    .flatMap((directory) => sourceFiles(join(projectPath, directory)))
    .flatMap((path) => {
      const source = readFileSync(path, "utf8");
      return /(?:text|focus(?:-visible)?:(?:outline|ring))-brand-green-bright/.test(
        source,
      )
        ? [path]
        : [];
    });

  assert.deepEqual(violations, []);
});
