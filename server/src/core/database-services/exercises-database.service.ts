import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Exercise, ExerciseDocument } from '@schemas/exercise.schema';
import { CreateExerciseDto } from '@modules/exercises/dto/create-exercise.dto';
import { UpdateExerciseDto } from '@modules/exercises/dto/update-exercise.dto';

@Injectable()
export class ExercisesDatabaseService {
  constructor(@InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>) {}

  public async findAll(): Promise<Exercise[]> {
    return this.exerciseModel.find();
  }

  public async findAllWithoutVariants(): Promise<Exercise[]> {
    return this.exerciseModel.find().select(['-variants']);
  }

  public async findBySectionId(sectionId: string): Promise<Exercise[]> {
    return this.exerciseModel.find({ sectionId: sectionId });
  }

  public async findOneByID(id: string): Promise<Exercise> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.exerciseModel.findOne({ _id: objectId });
  }

  public async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const newExercise = new this.exerciseModel(createExerciseDto);
    return newExercise.save();
  }

  public async update(id: string, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.exerciseModel.findByIdAndUpdate(objectId, updateExerciseDto, { new: true });
  }

  public async remove(id: string): Promise<Exercise> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.exerciseModel.findByIdAndRemove(objectId);
  }
}
