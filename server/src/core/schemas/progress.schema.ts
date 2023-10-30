import { ProgressBarDto } from '@modules/progress/dto/progress-bar.dto';
import { ProgressItemDto } from '@modules/progress/dto/progress-item.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema()
export class Progress {
  _id: string;

  @Prop({ default: null })
  lastModifiedDate: string;

  @Prop()
  userId: string;

  @Prop({ default: [] })
  progressItems: ProgressItemDto[];

  @Prop()
  progressBars: ProgressBarDto[];
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
