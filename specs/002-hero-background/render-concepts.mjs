import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import sharp from "sharp";

const directory = path.dirname(fileURLToPath(import.meta.url));
const html = await readFile(path.join(directory, "concepts.html"), "utf8");
const scenes = [...html.matchAll(/<svg class="scene" data-scene="([^"]+)"[\s\S]*?<\/svg>/g)];
const output = path.join(directory, "concepts");
await mkdir(output, { recursive: true });

function foreground(width, height) {
  if (width < 500) {
    return `
    <defs><linearGradient id="veil" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#000"/><stop offset=".6" stop-color="#000" stop-opacity=".9"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient></defs>
      <rect width="${width}" height="${height}" fill="url(#veil)"/>
      <text x="24" y="42" fill="#2bcc73" font-size="22" font-weight="700">¯\_(ツ)_/¯</text><text x="120" y="42" fill="white" font-size="18" font-weight="700">ShruggieTech</text>
      <text x="24" y="184" fill="white" font-size="40" font-weight="700">We advance</text><text x="24" y="228" fill="white" font-size="40" font-weight="700">your vision.</text>
      <text x="24" y="278" fill="white" font-size="17">You have a business to run. We handle</text>
      <text x="24" y="305" fill="white" font-size="17">the technology that makes it grow:</text>
      <text x="24" y="332" fill="white" font-size="17">modern websites, marketing engines,</text>
      <text x="24" y="359" fill="white" font-size="17">AI integrations, and custom software,</text>
      <text x="24" y="386" fill="white" font-size="17">shaped around how you actually work.</text>
      <rect x="24" y="427" width="205" height="50" rx="6" fill="#c24000"/><text x="43" y="458" fill="white" font-size="15" font-weight="700">Start a Conversation</text>
      <rect x="24" y="490" width="150" height="50" rx="6" fill="#050505" stroke="white"/><text x="42" y="521" fill="white" font-size="15" font-weight="700">See Our Work</text>`;
  }
  return `
    <defs><linearGradient id="veil" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#000"/><stop offset=".26" stop-color="#000"/><stop offset=".48" stop-color="#000" stop-opacity=".94"/><stop offset=".68" stop-color="#000" stop-opacity=".65"/><stop offset=".9" stop-color="#000" stop-opacity="0"/></linearGradient></defs>
    <rect width="${width}" height="${height}" fill="url(#veil)"/>
    <text x="111" y="42" fill="#2bcc73" font-size="22" font-weight="700">¯\_(ツ)_/¯</text><text x="207" y="42" fill="white" font-size="18" font-weight="700">ShruggieTech</text>
    <text x="111" y="228" fill="white" font-size="65" font-weight="700">We advance your vision.</text>
    <text x="111" y="293" fill="white" font-size="18">You have a business to run. We handle the technology that makes it grow:</text>
    <text x="111" y="324" fill="white" font-size="18">modern websites, marketing engines, AI integrations, and custom software,</text>
    <text x="111" y="355" fill="white" font-size="18">shaped around how you actually work.</text>
    <rect x="111" y="394" width="205" height="50" rx="6" fill="#c24000"/><text x="130" y="425" fill="white" font-size="15" font-weight="700">Start a Conversation</text>
    <rect x="332" y="394" width="150" height="50" rx="6" fill="#050505" stroke="white"/><text x="350" y="425" fill="white" font-size="15" font-weight="700">See Our Work</text>`;
}

for (const [rawScene, name] of scenes) {
  for (const [size, width, height] of [["desktop", 1280, 690], ["mobile", 390, 844]]) {
    for (const [phase, opacity] of [["first", 0.07], ["active", 0.55], ["settled", 1]]) {
      const scene = rawScene
        .replace(/<svg class="scene"[^>]*>/, size === "mobile"
          ? '<svg x="0" y="540" width="390" height="304" viewBox="680 100 550 490" preserveAspectRatio="xMidYMid meet">'
          : `<svg x="0" y="0" width="${width}" height="${height}" viewBox="0 0 1280 690" preserveAspectRatio="xMidYMid slice">`)
        .replaceAll('class="layer arrival"', `style="opacity:${opacity}"`);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#000"/>${scene}${foreground(width, height)}</svg>`;
      await sharp(Buffer.from(svg)).png().toFile(path.join(output, `${name}-${size}-${phase}.png`));
    }
  }
}

console.log(`Rendered ${scenes.length * 6} concept states to ${output}`);
