import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { RefreshTokenExpiresIn } from "../jwt.service";

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
  //userId is used to clear all the sessions of the user
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  refreshToken: string;

  @Prop({
    type: Date,
    default: Date.now,
    index: { expires: RefreshTokenExpiresIn },
  })
  createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
