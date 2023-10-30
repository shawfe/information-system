import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChapterDocument = Chapter & Document;

@Schema()
export class Chapter {
  _id: string;

  @Prop()
  title: string;

  @Prop()
  order: number;

  @Prop()
  content: string;

  @Prop()
  sectionId: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
