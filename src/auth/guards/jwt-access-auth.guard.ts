import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "../jwt.service";

@Injectable()
export class JwtAccessAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException();
    }

    const authorizationArray = authorization.split(" ");
    const jwtToken = authorizationArray[1];
    if (!jwtToken) {
      throw new UnauthorizedException();
    }

    const user = this.jwtService.validate(jwtToken, "access");
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = user;

    return true;
  }
}
