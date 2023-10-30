import { SectionType } from '@modules/users/dto/types.dto';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionWithChaptersExercisesDto } from './dto/section-with-chapters-exercises.dto';
import { SectionWithChaptersDto } from './dto/section-with-chapters.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Controller('sections')
export class SectionController {
  constructor(private _sectionsService: SectionsService) {}

  @Get()
  getAll(
    @Query('sectionType') sectionType: SectionType,
    @Query('withExercises') withExercises: boolean
  ): Promise<SectionWithChaptersDto[] | SectionWithChaptersExercisesDto[]> {
    if (withExercises) {
      return this._sectionsService.getSectionsWithChaptersExercises(sectionType);
    }
    return this._sectionsService.getSectionsWithChapters(sectionType);
  }

  @Post('/remove')
  @HttpCode(200)
  removeSome(@Body() data: { ids: string[] }): Promise<void> {
    return this._sectionsService.removeSections(data.ids);
  }

  @Post()
  create(@Body() createSectionDto: CreateSectionDto): Promise<SectionWithChaptersDto> {
    return this._sectionsService.createSection(createSectionDto);
  }

  @Put(':id')
  update(@Body() updateSectionDto: UpdateSectionDto, @Param('id') id: string): Promise<void> {
    return this._sectionsService.updateSection(id, updateSectionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this._sectionsService.removeSection(id);
  }
}
