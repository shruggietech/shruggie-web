import { describe, expect, it } from "vitest";

import { generateBlogPostSchema } from "../lib/schema";
import {
  TEAM_AUTHORS,
  getAuthorByReference,
  getAuthorReferenceByEmail,
} from "../lib/team";

describe("registered blog authors", () => {
  it("resolves every selectable author to a complete public profile", () => {
    expect(TEAM_AUTHORS).toHaveLength(3);
    for (const author of TEAM_AUTHORS) {
      const profile = getAuthorByReference(author);
      expect(profile).toMatchObject({
        name: author.name,
        title: expect.any(String),
        description: expect.any(String),
        image: expect.any(String),
        socials: expect.any(Array),
      });
    }
  });

  it("maps staff email identities without accepting aliases or other domains", () => {
    expect(getAuthorReferenceByEmail(" Natalie@Shruggie.Tech ")).toEqual({
      id: "team:natalie",
      name: "Natalie Thompson",
    });
    expect(getAuthorReferenceByEmail("editor@shruggie.tech")).toBeNull();
    expect(getAuthorReferenceByEmail("natalie@example.com")).toBeNull();
  });

  it("uses the same profile for BlogPosting author metadata", () => {
    const schema = generateBlogPostSchema({
      title: "A test article",
      date: "2026-09-07",
      author: "Natalie Thompson",
      excerpt: "A test article with a registered author profile.",
      slug: "test-article",
    });

    expect(schema.author).toMatchObject({
      "@type": "Person",
      name: "Natalie Thompson",
      jobTitle: "Co-Founder & COO",
      image: expect.stringContaining("natalie-thompson"),
      sameAs: expect.arrayContaining([
        "https://www.linkedin.com/in/cryptasian/",
      ]),
    });
  });
});
