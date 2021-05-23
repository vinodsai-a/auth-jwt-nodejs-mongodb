import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "../auth.service";
import { JwtService } from "../jwt.service";

@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.body.refresh_token;

    if (
      !refreshToken ||
      !(await this.authService.validateRefreshToken(refreshToken))
    ) {
      throw new UnauthorizedException();
    }

    const user = this.jwtService.validate(refreshToken, "refresh");
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = user;

    return true;
  }
}
