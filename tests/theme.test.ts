import { describe, expect, it } from "vitest";

import {
  isDarkModeForced,
  isLightModeAvailable,
  LIGHT_MODE_ROOT_PATH,
} from "../lib/route-theme";
import { getThemeScript } from "../lib/theme";

describe("route theme policy", () => {
  it("makes light mode available only on the blog reading surface", () => {
    expect(LIGHT_MODE_ROOT_PATH).toBe("/blog");
    expect(isLightModeAvailable("/blog")).toBe(true);
    expect(isLightModeAvailable("/blog/multi-agent-coding-workflows")).toBe(
      true,
    );

    for (const pathname of [
      "/",
      "/products",
      "/skills",
      "/skills/shruggie-bash",
      "/research/rustif",
      "/admin",
      "/privacy",
    ]) {
      expect(isLightModeAvailable(pathname)).toBe(false);
      expect(isDarkModeForced(pathname)).toBe(true);
    }
  });

  it("defaults blog pages to dark and ignores preferences elsewhere", () => {
    const script = getThemeScript();

    expect(script).toContain('var blogRoot = "/blog"');
    expect(script).toContain("if (!lightModeAvailable)");
    expect(script).toContain("document.documentElement.classList.add('dark')");
    expect(script).toContain("var theme = cookie ? cookie[1] : 'dark'");
    expect(script).not.toContain("prefers-color-scheme");
  });
});
