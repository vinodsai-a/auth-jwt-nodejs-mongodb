import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: ObjectId;

  @Prop({ required: true, index: { unique: true } })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  passwordSalt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
