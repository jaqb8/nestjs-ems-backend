import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export class SecretsReader {
  private secretManagerServiceClient: SecretManagerServiceClient;

  constructor() {
    this.secretManagerServiceClient = new SecretManagerServiceClient();
  }

  async getSecretValue(secret: string, version: string) {
    const [vs] = await this.secretManagerServiceClient.accessSecretVersion({
      name: `projects/205126765903/secrets/${secret}/versions/${version}`,
    });

    const payload = vs.payload.data.toString();
    return payload;
  }
}
