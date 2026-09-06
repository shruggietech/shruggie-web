import "server-only";

import { getVercelOidcToken } from "@vercel/oidc";
import type { Credential, GoogleOAuthAccessToken } from "firebase-admin/app";
import {
  ExternalAccountClient,
  type BaseExternalAccountClient,
  type IdentityPoolClientOptions,
} from "google-auth-library";
import { z } from "zod";

const configurationSchema = z.object({
  GCP_PROJECT_NUMBER: z.string().regex(/^\d+$/),
  GCP_SERVICE_ACCOUNT_EMAIL: z.string().email(),
  GCP_WORKLOAD_IDENTITY_POOL_ID: z.string().regex(/^[a-z0-9-]+$/),
  GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID: z.string().regex(/^[a-z0-9-]+$/),
});

export type VercelGoogleCredentialConfig = z.infer<typeof configurationSchema>;

export function loadVercelGoogleCredentialConfig(
  environment: Record<string, string | undefined> = process.env,
): VercelGoogleCredentialConfig {
  return configurationSchema.parse(environment);
}

export function externalAccountOptions(
  configuration: VercelGoogleCredentialConfig,
  subjectTokenSupplier = getVercelOidcToken,
): IdentityPoolClientOptions {
  const {
    GCP_PROJECT_NUMBER: projectNumber,
    GCP_SERVICE_ACCOUNT_EMAIL: serviceAccountEmail,
    GCP_WORKLOAD_IDENTITY_POOL_ID: poolId,
    GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID: providerId,
  } = configuration;

  return {
    type: "external_account",
    audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
    subject_token_supplier: {
      getSubjectToken: () => subjectTokenSupplier(),
    },
  };
}

type ExternalTokenClient = Pick<
  BaseExternalAccountClient,
  "credentials" | "getAccessToken"
>;

export class VercelGoogleCredential implements Credential {
  constructor(
    private readonly client: ExternalTokenClient,
    private readonly now = Date.now,
  ) {}

  async getAccessToken(): Promise<GoogleOAuthAccessToken> {
    const result = await this.client.getAccessToken();
    if (!result.token) {
      throw new Error("Google did not return an access token for Vercel OIDC.");
    }

    const expiryDate = this.client.credentials.expiry_date;
    const expiresIn = expiryDate
      ? Math.max(1, Math.floor((expiryDate - this.now()) / 1_000))
      : 3_600;

    return {
      access_token: result.token,
      expires_in: expiresIn,
    };
  }
}

export function createVercelGoogleCredential(
  environment: Record<string, string | undefined> = process.env,
): Credential {
  return new VercelGoogleCredential(
    createVercelExternalAccountClient(environment),
  );
}

export function createVercelExternalAccountClient(
  environment: Record<string, string | undefined> = process.env,
): BaseExternalAccountClient {
  const options = externalAccountOptions(
    loadVercelGoogleCredentialConfig(environment),
  );
  const client = ExternalAccountClient.fromJSON(options);
  if (!client) {
    throw new Error("Unable to initialize Vercel workload identity.");
  }

  return client;
}
