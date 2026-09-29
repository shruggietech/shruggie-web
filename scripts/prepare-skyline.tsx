/** Generate/check the exact desktop and mobile artwork; no runtime dependency. */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import KnoxvilleSkylineArt from "../components/home/KnoxvilleSkylineArt";

async function main() {
  for (const mobile of [false, true]) {
    const destination = resolve(
      `public/images/knoxville-skyline${mobile ? "-mobile" : ""}.svg`,
    );
    const markup =
      renderToStaticMarkup(<KnoxvilleSkylineArt mobile={mobile} />) + "\n";
    if (process.argv.includes("--check")) {
      if ((await readFile(destination, "utf8")) !== markup) {
        throw new Error(
          `Skyline asset differs from its authoritative artwork: ${destination}`,
        );
      }
    } else {
      await writeFile(destination, markup);
    }
    console.log(
      `${process.argv.includes("--check") ? "Verified" : "Generated"} ${destination}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
