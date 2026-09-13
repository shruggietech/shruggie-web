import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  loadRepositoryMigrationManifest,
  migrateRepositoryBlog,
  parseRepositoryMigrationManifest,
  repositoryMigrationSummary,
} from "../../lib/editorial/repository-migration";
import {
  InMemoryArticleRepository,
  InMemoryAssetStore,
} from "../../lib/editorial/memory-adapter";
import { MdxArticleReader } from "../../lib/editorial/mdx-article-reader";

const repositoryRoot = process.cwd();
const manifestPath = path.join(
  repositoryRoot,
  "docs",
  "editorial",
  "blog-migration-manifest.json",
);

async function migrate(
  apply: boolean,
  articles = new InMemoryArticleRepository(),
  assets = new InMemoryAssetStore(),
) {
  const manifest = await loadRepositoryMigrationManifest(manifestPath);
  const report = await migrateRepositoryBlog({
    apply,
    articleRepository: articles,
    assetStore: assets,
    manifest,
    repositoryRoot,
    siteOrigin: "https://shruggie.tech",
  });
  return { articles, assets, manifest, report };
}

describe("repository blog migration", () => {
  it("accounts for the complete repository corpus and reports a non-mutating dry run", async () => {
    const { articles, assets, report } = await migrate(false);
    const summary = repositoryMigrationSummary(report);

    expect(summary).toMatchObject({
      mode: "dry-run",
      articleCount: 2,
      articlesToCreate: 2,
      assetsToCreate: 2,
      verifiedArticles: 0,
    });
    await expect(articles.exportAll()).resolves.toEqual([]);
    await expect(assets.exportAll()).resolves.toEqual([]);
  });

  it("migrates articles and assets, verifies them, and becomes a no-op on rerun", async () => {
    const first = await migrate(true);
    expect(repositoryMigrationSummary(first.report)).toMatchObject({
      mode: "apply",
      articleCount: 2,
      articlesToCreate: 2,
      assetsToCreate: 2,
      verifiedArticles: 2,
    });

    const storedArticles = await first.articles.exportAll();
    const storedAssets = await first.assets.exportAll();
    expect(storedArticles).toHaveLength(2);
    expect(storedAssets).toHaveLength(2);
    expect(storedArticles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "article:multi-agent-coding-workflows",
          slug: "multi-agent-coding-workflows",
          author: { id: "team:william", name: "William Thompson" },
          state: "published",
          featuredImage: expect.objectContaining({
            assetId: "asset:repository:multi-agent-coding-workflows:featured",
          }),
        }),
        expect.objectContaining({
          id: "article:your-website-is-not-a-brochure-anymore",
          slug: "your-website-is-not-a-brochure-anymore",
          author: { id: "team:natalie", name: "Natalie Thompson" },
          state: "published",
        }),
      ]),
    );

    const sourceArticles = await new MdxArticleReader().list({
      visibility: "all",
    });
    for (const source of sourceArticles) {
      const target = storedArticles.find(({ slug }) => slug === source.slug);
      expect(target).toBeDefined();
      expect(target).toMatchObject({
        slug: source.slug,
        title: source.title,
        excerpt: source.excerpt,
        author: { name: source.author.name },
        category: source.category,
        body: source.body,
        state: source.state,
        createdAt: source.createdAt,
        modifiedAt: source.modifiedAt,
        publishedAt: source.publishedAt,
        featuredImage: expect.objectContaining({
          altText: source.featuredImage?.altText,
        }),
      });
      const sourceAsset = first.manifest.articles
        .find(({ slug }) => slug === source.slug)!
        .assets.find(({ role }) => role === "featured")!;
      const migratedBytes = await first.assets.read(
        target!.featuredImage!.assetId,
      );
      expect(migratedBytes?.asset.checksumSha256).toBe(
        sourceAsset.sourceSha256,
      );
    }

    const second = await migrate(true, first.articles, first.assets);
    expect(repositoryMigrationSummary(second.report)).toMatchObject({
      articlesToCreate: 0,
      assetsToCreate: 0,
      verifiedArticles: 2,
    });
    await expect(first.articles.exportAudit()).resolves.toHaveLength(2);
  });

  it("refuses changed source bytes instead of migrating an unreviewed corpus", async () => {
    const manifest = structuredClone(
      await loadRepositoryMigrationManifest(manifestPath),
    );
    manifest.articles[0].sourceSha256 = "0".repeat(64);

    await expect(
      migrateRepositoryBlog({
        apply: false,
        articleRepository: new InMemoryArticleRepository(),
        assetStore: new InMemoryAssetStore(),
        manifest,
        repositoryRoot,
        siteOrigin: "https://shruggie.tech",
      }),
    ).rejects.toThrow(/source hash changed/);
  });

  it("rejects incomplete, duplicate, and incorrectly assigned manifests before mutation", async () => {
    const manifest = structuredClone(
      await loadRepositoryMigrationManifest(manifestPath),
    );
    const incomplete = { ...manifest, articles: manifest.articles.slice(0, 1) };
    await expect(
      migrateRepositoryBlog({
        apply: true,
        articleRepository: new InMemoryArticleRepository(),
        assetStore: new InMemoryAssetStore(),
        manifest: parseRepositoryMigrationManifest(incomplete),
        repositoryRoot,
        siteOrigin: "https://shruggie.tech",
      }),
    ).rejects.toThrow(/does not account for every repository blog article/);

    const duplicate = structuredClone(manifest);
    duplicate.articles.push(structuredClone(duplicate.articles[0]));
    expect(() => parseRepositoryMigrationManifest(duplicate)).toThrow(
      /Migration manifest validation failed/,
    );

    const wrongRole = structuredClone(manifest);
    wrongRole.articles[0].assets[0].role = "body";
    await expect(
      migrateRepositoryBlog({
        apply: true,
        articleRepository: new InMemoryArticleRepository(),
        assetStore: new InMemoryAssetStore(),
        manifest: parseRepositoryMigrationManifest(wrongRole),
        repositoryRoot,
        siteOrigin: "https://shruggie.tech",
      }),
    ).rejects.toThrow(/body asset role does not match/);
  });
});
