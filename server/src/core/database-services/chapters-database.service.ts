import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Chapter, ChapterDocument } from '@schemas/chapter.schema';
import CreateChapterDto from '@modules/chapters/dto/create-chapter.dto';
import UpdateChapterOrderDto from '@modules/chapters/dto/update-chapter-data.dto';
import UpdateChapterDto from '@modules/chapters/dto/update-chapter.dto';

@Injectable()
export class ChaptersDatabaseService {
  constructor(@InjectModel(Chapter.name) private chapterModel: Model<ChapterDocument>) {}

  public async findAll(): Promise<Chapter[]> {
    return this.chapterModel.find();
  }

  public async findAllWithoutContent(): Promise<Chapter[]> {
    return this.chapterModel.find().select(['-content']);
  }

  public async findBySectionId(sectionId: string): Promise<Chapter[]> {
    return this.chapterModel.find({ sectionId: sectionId });
  }

  public async findOneByID(id: string): Promise<Chapter> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.chapterModel.findOne({ _id: objectId });
  }

  public async findOneByName(name: string): Promise<Chapter> {
    return await this.chapterModel.findOne({ name });
  }

  public async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
    const newChapter = new this.chapterModel(createChapterDto);
    return newChapter.save();
  }

  public async update(
    id: string,
    updateChapterDto: UpdateChapterOrderDto | UpdateChapterDto
  ): Promise<Chapter> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.chapterModel.findByIdAndUpdate(objectId, updateChapterDto, { new: true });
  }

  public async remove(id: string): Promise<Chapter> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.chapterModel.findByIdAndRemove(objectId);
  }
}
