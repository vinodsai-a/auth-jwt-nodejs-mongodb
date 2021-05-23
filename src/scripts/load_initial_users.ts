import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app/app.module";
import { UsersService } from "../users/users.service";
const crypto = require("crypto");

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get<UsersService>(UsersService);
  const users = [
    {
      username: "vinod",
      password: "password@123",
      passwordSalt: randomString(10),
    },
    {
      username: "sai",
      password: "password@123",
      passwordSalt: randomString(10),
    },
    {
      username: "sreenivas",
      password: "password@123",
      passwordSalt: randomString(10),
    },
  ].map((user) => {
    const passwordHased = crypto
      .createHash("sha256")
      .update(user.password + user.passwordSalt)
      .digest("base64");

    return { ...user, password: passwordHased };
  });

  await service.loadDummyUsersToDb(users);
  await app.close();
}

function randomString(length) {
  const result = [];
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

bootstrap();
