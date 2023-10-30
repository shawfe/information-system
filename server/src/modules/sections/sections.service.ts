import { ChaptersService } from '@modules/chapters/chapters.service';
import { ExercisesService } from '@modules/exercises/exercises.service';
import { SectionType } from '@modules/users/dto/types.dto';
import { Injectable } from '@nestjs/common';
import { Section } from '@schemas/section.schema';
import { SectionsDatabaseService } from 'src/core/database-services/sections-database.service';
import { SectionWithChaptersExercisesDto } from './dto/section-with-chapters-exercises.dto';
import { SectionWithChaptersDto } from './dto/section-with-chapters.dto';
import { SectionDto } from './dto/section.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    private _sectionsDatabaseService: SectionsDatabaseService,
    private _chaptersService: ChaptersService,
    private _exercisesService: ExercisesService
  ) {}

  public toSectionDto(section: Section): SectionDto {
    return new SectionDto(section);
  }

  public toSectionWithChaptersDto(section: Section): SectionWithChaptersDto {
    return new SectionWithChaptersDto(section);
  }

  public toSectionWithChaptersExercisesDto(section: Section): SectionWithChaptersExercisesDto {
    return new SectionWithChaptersExercisesDto(section);
  }

  public async getSectionsWithChapters(
    sectionType: SectionType
  ): Promise<SectionWithChaptersDto[]> {
    const sectionsDb = await this._sectionsDatabaseService.findAllBySectionType(sectionType);
    const chaptersBySections = await this._chaptersService.getChaptersBySections();
    const sectionsWithChapters: SectionWithChaptersDto[] = [];

    for (const section of sectionsDb) {
      const sectionWithChapters = this.toSectionWithChaptersDto(section);
      sectionWithChapters.chapters = chaptersBySections.get(sectionWithChapters.id) ?? [];
      sectionsWithChapters.push(sectionWithChapters);
    }

    return new Promise((resolve) => {
      resolve(sectionsWithChapters);
    });
  }

  public async getSectionsWithChaptersExercises(
    sectionType: SectionType
  ): Promise<SectionWithChaptersExercisesDto[]> {
    const sectionsDb = await this._sectionsDatabaseService.findAllBySectionType(sectionType);
    const chapters = await this._chaptersService.getChaptersBySections();
    const exercises = await this._exercisesService.getExercisesBySections();
    const resultSections: SectionWithChaptersExercisesDto[] = [];

    for (const section of sectionsDb) {
      const sectionWithChaptersExercises = this.toSectionWithChaptersExercisesDto(section);
      sectionWithChaptersExercises.chapters = chapters.get(sectionWithChaptersExercises.id) ?? [];
      sectionWithChaptersExercises.exercises = exercises.get(sectionWithChaptersExercises.id) ?? [];
      resultSections.push(sectionWithChaptersExercises);
    }

    return new Promise((resolve) => {
      resolve(resultSections);
    });
  }

  public async createSection(createSectionDto: CreateSectionDto): Promise<SectionWithChaptersDto> {
    const createdSection = await this._sectionsDatabaseService.create(createSectionDto);
    return new Promise((resolve) => resolve(this.toSectionWithChaptersDto(createdSection)));
  }

  public async updateSection(id: string, updateSectionDto: UpdateSectionDto): Promise<void> {
    await this._sectionsDatabaseService.update(id, updateSectionDto);
    return new Promise((resolve) => resolve());
  }

  public async removeSection(id: string): Promise<void> {
    await this._sectionsDatabaseService.remove(id);
    return new Promise((resolve) => resolve());
  }

  public async removeSections(ids: string[]): Promise<void> {
    await Promise.allSettled(ids.map((id) => this._sectionsDatabaseService.remove(id)));
    return new Promise((resolve) => resolve());
  }
}
