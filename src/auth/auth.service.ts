import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import {
  AccessTokenExpiresIn,
  JwtService,
  RefreshTokenExpiresIn,
} from "./jwt.service";
import {
  RefreshToken,
  RefreshTokenDocument,
} from "./schema/RefreshToken.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
const crypto = require("crypto");

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      return null;
    }

    const passwordHased = crypto
      .createHash("sha256")
      .update(pass + user.passwordSalt)
      .digest("base64");

    if (user.password === passwordHased) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return { username: result.username, userId: result._id };
    }

    return null;
  }

  async createTokens(user: any, isRefreshToken = true) {
    const payload = { username: user.username, userId: user.userId };
    const accessToken = this.jwtService.sign(payload, "access");

    if (!isRefreshToken) {
      return {
        access_token: accessToken,
        access_token_expires_in: AccessTokenExpiresIn,
      };
    }
    const refreshToken = this.jwtService.sign(payload, "refresh");

    const model = new this.refreshTokenModel({
      userId: user.userId,
      refreshToken,
    });
    await model.save();

    return {
      access_token: accessToken,
      access_token_expires_in: AccessTokenExpiresIn,
      refresh_token: refreshToken,
      refresh_token_expires_in: RefreshTokenExpiresIn,
    };
  }

  async validateRefreshToken(refreshToken: string) {
    const savedToken = await this.refreshTokenModel.findOne({ refreshToken });

    return !!savedToken;
  }

  async logout(refreshToken: string) {
    await this.refreshTokenModel.deleteOne({
      refreshToken,
    });
  }
}
