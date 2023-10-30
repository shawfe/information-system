import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { SectionType } from '@modules/users/dto/types.dto';
import { Section, SectionDocument } from '@schemas/section.schema';
import { UpdateSectionDto } from '@modules/sections/dto/update-section.dto';
import { CreateSectionDto } from '@modules/sections/dto/create-section.dto';

@Injectable()
export class SectionsDatabaseService {
  constructor(@InjectModel(Section.name) private sectionModel: Model<SectionDocument>) {}

  public async findAll(): Promise<Section[]> {
    return this.sectionModel.find();
  }

  public async findAllBySectionType(sectionType: SectionType): Promise<Section[]> {
    return this.sectionModel.find({ sectionType: sectionType });
  }

  public async findOneByID(id: string): Promise<Section> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.sectionModel.findOne({ _id: objectId });
  }

  public async findOneByName(name: string): Promise<Section> {
    return await this.sectionModel.findOne({ name });
  }

  public async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const newSection = new this.sectionModel(createSectionDto);
    return newSection.save();
  }

  public async update(id: string, updateSectionDto: UpdateSectionDto): Promise<Section> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.sectionModel.findByIdAndUpdate(objectId, updateSectionDto, { new: true });
  }

  public async remove(id: string): Promise<Section> {
    const objectId = new mongoose.Types.ObjectId(id.trim());
    return this.sectionModel.findByIdAndRemove(objectId);
  }
}
