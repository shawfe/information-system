import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '@schemas/progress.schema';
import { CreateProgressDto } from '@modules/progress/dto/create-progress.dto';
import { UpdateProgressDto } from '@modules/progress/dto/update-progress.dto';

@Injectable()
export class ProgressDatabaseService {
  constructor(@InjectModel(Progress.name) private progressModel: Model<ProgressDocument>) {}

  public async findOneByUserId(userId: string): Promise<Progress> {
    return this.progressModel.findOne({ userId: userId });
  }

  public async create(createProgressDto: CreateProgressDto): Promise<Progress> {
    const newProgress = new this.progressModel(createProgressDto);
    return newProgress.save();
  }

  public async removeByUserId(userId: string): Promise<Progress> {
    return this.progressModel.remove({ userId: userId });
  }

  public updateProgress(userId: string, updateProgressDto: UpdateProgressDto): Promise<Progress> {
    return this.progressModel
      .findOneAndUpdate(
        { userId: userId },
        {
          $push: { progressItems: updateProgressDto.progressItem },
          progressBars: updateProgressDto.progressBars,
          lastModifiedDate: updateProgressDto.lastModifiedDate
        },
        { new: true }
      )
      .exec();
  }
}
