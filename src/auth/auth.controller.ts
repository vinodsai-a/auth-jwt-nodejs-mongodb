import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthService } from "../auth/auth.service";
import { JwtAccessAuthGuard } from "./guards/jwt-access-auth.guard";
import { LocalAuthGuard } from "../auth/guards/local-auth.guard";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { UserDto } from "./dto/user.dto";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: UserDto })
  @ApiTags("auth")
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req) {
    return this.authService.createTokens(req.user);
  }

  @ApiTags("auth")
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAccessAuthGuard)
  @Get("validate")
  validate(@Request() req) {
    return req.user;
  }

  @ApiTags("auth")
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshAuthGuard)
  @Post("logout")
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    await this.authService.logout(refreshTokenDto.refresh_token);
    return { message: "success" };
  }

  @ApiTags("auth")
  @ApiUnauthorizedResponse()
  @ApiBody({ type: RefreshTokenDto })
  @UseGuards(JwtRefreshAuthGuard)
  @Post("refresh")
  refresh(@Request() req) {
    return this.authService.createTokens(req.user, false);
  }
}
