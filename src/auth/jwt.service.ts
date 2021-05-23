import { Inject, Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { CONFIG } from "../config";
import { IConfig } from "config";

type TokenType = "access" | "refresh";
export const RefreshTokenExpiresIn = "1y";
export const AccessTokenExpiresIn = "1h";

@Injectable()
export class JwtService {
  constructor(@Inject(CONFIG) private readonly configProvider: IConfig) {}

  sign(payload: any, tokenType: TokenType) {
    const secret: string = this.getTokenSecret(tokenType);
    const expiresIn: string = this.getTokenExpiresIn(tokenType);

    return jwt.sign(payload, secret, {
      expiresIn: expiresIn,
    });
  }

  validate(token: string, tokenType: TokenType) {
    const secret: string = this.getTokenSecret(tokenType);

    try {
      const user = jwt.verify(token, secret) as {
        username: string;
        userId: string;
      };

      return { username: user.username, userId: user.userId };
    } catch (e) {}

    return false;
  }

  getTokenExpiresIn(tokenType: TokenType): string {
    return tokenType === "access"
      ? AccessTokenExpiresIn
      : RefreshTokenExpiresIn;
  }
  getTokenSecret(tokenType: TokenType): string {
    return this.configProvider.get(
      tokenType === "access"
        ? "jwt.accessToken.secret"
        : "jwt.refreshToken.secret"
    );
  }
}
