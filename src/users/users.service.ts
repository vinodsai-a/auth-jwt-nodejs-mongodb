import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/User.schema";

export type UserType = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async findOne(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username });

    return !user ? null : user.toJSON();
  }

  async loadDummyUsersToDb(dummyUsers) {
    try {
      await this.userModel.insertMany(dummyUsers);
    } catch (e) {
      console.log(e);
    }
  }
}
