import { VariantDto } from '@modules/exercises/dto/variant.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExerciseDocument = Exercise & Document;

@Schema()
export class Exercise {
  _id: string;

  @Prop()
  title: string;

  @Prop()
  variants: VariantDto[];

  @Prop()
  sectionId: string;

  @Prop()
  order: number;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
