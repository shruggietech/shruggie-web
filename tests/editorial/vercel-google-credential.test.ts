import { describe, expect, it, vi } from "vitest";

import {
  externalAccountOptions,
  loadVercelGoogleCredentialConfig,
  VercelGoogleCredential,
} from "../../lib/editorial/vercel-google-credential";

const configuration = {
  GCP_PROJECT_NUMBER: "660220401300",
  GCP_SERVICE_ACCOUNT_EMAIL:
    "shruggie-web-vercel-prod@shruggie-web.iam.gserviceaccount.com",
  GCP_WORKLOAD_IDENTITY_POOL_ID: "vercel",
  GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID: "shruggietech",
};

describe("Vercel Google workload identity credential", () => {
  it("builds a bounded external-account exchange configuration", async () => {
    const subjectTokenSupplier = vi.fn().mockResolvedValue("vercel-token");
    const options = externalAccountOptions(configuration, subjectTokenSupplier);

    expect(options).toMatchObject({
      audience:
        "//iam.googleapis.com/projects/660220401300/locations/global/workloadIdentityPools/vercel/providers/shruggietech",
      service_account_impersonation_url:
        "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/shruggie-web-vercel-prod@shruggie-web.iam.gserviceaccount.com:generateAccessToken",
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      token_url: "https://sts.googleapis.com/v1/token",
      type: "external_account",
    });

    await expect(
      options.subject_token_supplier?.getSubjectToken({} as never),
    ).resolves.toBe("vercel-token");
  });

  it("rejects incomplete or malformed production configuration", () => {
    expect(() =>
      loadVercelGoogleCredentialConfig({
        ...configuration,
        GCP_PROJECT_NUMBER: "not-a-project-number",
      }),
    ).toThrow();
    expect(() =>
      loadVercelGoogleCredentialConfig({
        ...configuration,
        GCP_SERVICE_ACCOUNT_EMAIL: undefined,
      }),
    ).toThrow();
  });

  it("adapts Google access tokens to the Firebase Admin credential contract", async () => {
    const client = {
      credentials: { expiry_date: 1_788_610_800_000 },
      getAccessToken: vi.fn().mockResolvedValue({ token: "google-token" }),
    };
    const credential = new VercelGoogleCredential(
      client as never,
      () => 1_788_607_200_000,
    );

    await expect(credential.getAccessToken()).resolves.toEqual({
      access_token: "google-token",
      expires_in: 3_600,
    });
  });

  it("fails closed when Google does not return an access token", async () => {
    const credential = new VercelGoogleCredential({
      credentials: {},
      getAccessToken: vi.fn().mockResolvedValue({ token: null }),
    } as never);

    await expect(credential.getAccessToken()).rejects.toThrow(
      /did not return an access token/,
    );
  });
});
