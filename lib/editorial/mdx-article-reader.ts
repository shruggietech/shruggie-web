import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import {
  ARTICLE_SCHEMA_VERSION,
  articleSlugSchema,
  parseArticle,
  type Article,
  type AssetReference,
} from "./domain";
import { EditorialValidationError } from "./errors";
import type {
  ArticleListOptions,
  ArticleReader,
  ArticleVisibility,
} from "./ports";
import { validateArticleListLimit } from "./ports";

const frontmatterSchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    modifiedAt: z.string().datetime({ offset: true }).optional(),
    author: z.string().trim().min(2).max(120).default("ShruggieTech"),
    category: z.string().trim().min(2).max(80).default("Announcements"),
    excerpt: z.string().trim().min(10).max(400),
    published: z.boolean().default(true),
    ogImage: z.string().trim().min(1).optional(),
    ogImageAlt: z.string().trim().min(5).max(300).optional(),
    featuredImage: z.string().trim().min(1).optional(),
    featuredImageAlt: z.string().trim().min(5).max(300).optional(),
  })
  .strict();

function identifier(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return normalized || "shruggietech";
}

function legacyAssetReference(
  slug: string,
  role: "featured" | "og",
  deliveryUrl: string | undefined,
  altText: string | undefined,
  title: string,
): AssetReference | null {
  if (!deliveryUrl) return null;
  return {
    assetId: `legacy:${slug}:${role}`,
    deliveryUrl,
    altText: altText ?? title,
  };
}

export class MdxArticleReader implements ArticleReader {
  constructor(
    private readonly postsDirectory = path.join(
      process.cwd(),
      "content",
      "blog",
    ),
  ) {}

  async getById(
    id: string,
    visibility: ArticleVisibility,
  ): Promise<Article | null> {
    if (!id.startsWith("legacy:")) return null;
    return this.getBySlug(id.slice("legacy:".length), visibility);
  }

  async getBySlug(
    slug: string,
    visibility: ArticleVisibility,
  ): Promise<Article | null> {
    const parsedSlug = articleSlugSchema.safeParse(slug);
    if (!parsedSlug.success) return null;

    try {
      const article = await this.readArticle(parsedSlug.data);
      if (visibility === "published" && article.state !== "published") {
        return null;
      }
      return article;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === "ENOENT") return null;
      throw error;
    }
  }

  async list(options: ArticleListOptions): Promise<Article[]> {
    const limit = validateArticleListLimit(options.limit);
    const files = (await readdir(this.postsDirectory))
      .filter((file) => file.endsWith(".mdx"))
      .sort();
    const articles = await Promise.all(
      files.map((file) => this.readArticle(file.replace(/\.mdx$/, ""))),
    );
    const visible = articles
      .filter(
        (article) =>
          options.visibility === "all" || article.state === "published",
      )
      .sort((a, b) => {
        const aDate = a.publishedAt ?? a.modifiedAt;
        const bDate = b.publishedAt ?? b.modifiedAt;
        return bDate.localeCompare(aDate) || a.id.localeCompare(b.id);
      });

    return limit === undefined ? visible : visible.slice(0, limit);
  }

  private async readArticle(slug: string): Promise<Article> {
    const filePath = path.join(this.postsDirectory, `${slug}.mdx`);
    const fileContent = await readFile(filePath, "utf8");
    const parsed = matter(fileContent);
    const frontmatter = frontmatterSchema.safeParse(parsed.data);

    if (!frontmatter.success) {
      throw new EditorialValidationError(
        `Invalid article frontmatter in ${path.basename(filePath)}.`,
        { issues: frontmatter.error.issues },
      );
    }

    const data = frontmatter.data;
    const createdAt = `${data.date}T00:00:00.000Z`;
    const modifiedAt = data.modifiedAt ?? createdAt;
    const state = data.published ? "published" : "draft";

    return parseArticle({
      schemaVersion: ARTICLE_SCHEMA_VERSION,
      id: `legacy:${slug}`,
      slug,
      title: data.title,
      excerpt: data.excerpt,
      author: {
        id: `legacy:${identifier(data.author)}`,
        name: data.author,
      },
      category: data.category,
      body: { format: "markdown", source: parsed.content },
      state,
      createdAt,
      modifiedAt,
      publishedAt: state === "published" ? createdAt : null,
      featuredImage: legacyAssetReference(
        slug,
        "featured",
        data.featuredImage,
        data.featuredImageAlt,
        data.title,
      ),
      ogImage: legacyAssetReference(
        slug,
        "og",
        data.ogImage,
        data.ogImageAlt,
        data.title,
      ),
      revision: {
        number: 1,
        previousNumber: null,
        updatedAt: modifiedAt,
        updatedBy: "legacy:repository-import",
      },
    });
  }
}
