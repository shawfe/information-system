import { ConfirmationStatus, AccountType } from '@modules/users/dto/types.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: string;

  @Prop()
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  password: string;

  @Prop({ default: 'REGISTERED' })
  confirmationStatus: ConfirmationStatus;

  @Prop({ default: false })
  isEmailConfirmed: boolean;

  @Prop({ default: null })
  groupId: string;

  @Prop({ default: 'USER' })
  accountType: AccountType;

  @Prop({ default: null })
  lastActiveDate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
