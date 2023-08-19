import axios from "axios";

export interface DiscordAuthInterface {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export class Authorization {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly scopes: string[];

  constructor(auth: DiscordAuthInterface) {
    this.clientId = auth.clientId;
    this.clientSecret = auth.clientSecret;
    this.redirectUri = auth.redirectUri;
    this.scopes = auth.scopes;
  }

  async getAccessToken(code: string): Promise<string> {
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: this.redirectUri,
        scope: this.scopes,
      }
    );

    return tokenResponse.data.access_token;
  }
}
