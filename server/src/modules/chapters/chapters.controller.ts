import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChapterContentDto } from './dto/chapter-content.dto';
import ChapterDto from './dto/chapter.dto';
import CreateChapterDto from './dto/create-chapter.dto';
import RequestUpdateChapterDto from './dto/request-update-chapter.dto';
import UpdateChapterContentDto from './dto/update-chapter-content.dto';
import UpdateChapterDto from './dto/update-chapter.dto';

@Controller('chapters')
export class ChaptersController {
  constructor(private _chaptersService: ChaptersService) {}

  @Get()
  getAll(@Query('sectionId') sectionId: string): Promise<ChapterDto[]> {
    return this._chaptersService.getChaptersBySection(sectionId);
  }

  @Get('/content/:id')
  getContent(@Param('id') id: string): Promise<ChapterContentDto> {
    return this._chaptersService.getChapterContent(id);
  }

  @Post('/update')
  @HttpCode(200)
  updateSome(@Body() data: { chapters: RequestUpdateChapterDto[] }): Promise<void> {
    return this._chaptersService.updateChapters(data.chapters);
  }

  @Post('/remove')
  @HttpCode(200)
  removeSome(@Body() data: { ids: string[] }): Promise<void> {
    return this._chaptersService.removeChapters(data.ids);
  }

  @Post()
  create(@Body() createChapterDto: CreateChapterDto): Promise<ChapterDto> {
    return this._chaptersService.createChapter(createChapterDto);
  }

  @Put(':id')
  update(@Body() updateGroupDto: UpdateChapterDto, @Param('id') id: string): Promise<void> {
    return this._chaptersService.updateChapter(id, updateGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this._chaptersService.removeChapter(id);
  }
}
