import { SectionType } from '@modules/users/dto/types.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SectionDocument = Section & Document;

@Schema()
export class Section {
  _id: string;

  @Prop()
  title: string;

  @Prop()
  sectionType: SectionType;

  @Prop()
  order: number;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
