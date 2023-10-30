import { Injectable } from '@nestjs/common';
import { Chapter } from '@schemas/chapter.schema';
import { ChaptersDatabaseService } from 'src/core/database-services/chapters-database.service';
import { ChapterContentDto } from './dto/chapter-content.dto';
import ChapterDto from './dto/chapter.dto';
import CreateChapterDto from './dto/create-chapter.dto';
import RequestUpdateChapterDto from './dto/request-update-chapter.dto';
import UpdateChapterOrderDto from './dto/update-chapter-data.dto';
import UpdateChapterDto from './dto/update-chapter.dto';

@Injectable()
export class ChaptersService {
  constructor(private _chaptersDatabaseService: ChaptersDatabaseService) {}

  public toChapterDto(chapter: Chapter): ChapterDto {
    return new ChapterDto(chapter);
  }

  public toChapterContentDto(chapter: Chapter): ChapterContentDto {
    return new ChapterContentDto(chapter);
  }

  public async getChaptersBySection(sectionId: string): Promise<ChapterDto[]> {
    const chaptersDb = await this._chaptersDatabaseService.findBySectionId(sectionId);
    chaptersDb.sort((a, b) => a.order - b.order);

    return new Promise((resolve) => {
      resolve(chaptersDb.map((chapter) => this.toChapterDto(chapter)));
    });
  }

  public async getChaptersBySections(): Promise<Map<string, ChapterDto[]>> {
    const chaptersBySection = new Map<string, ChapterDto[]>();
    const chaptersDb = await this._chaptersDatabaseService.findAll();
    chaptersDb.sort((a, b) => a.order - b.order);

    for (const chapter of chaptersDb) {
      if (chaptersBySection.has(chapter.sectionId)) {
        chaptersBySection.get(chapter.sectionId).push(this.toChapterDto(chapter));
      } else {
        chaptersBySection.set(chapter.sectionId, [this.toChapterDto(chapter)]);
      }
    }

    return new Promise((resolve) => {
      resolve(chaptersBySection);
    });
  }

  public async getChapterContent(id: string): Promise<ChapterContentDto> {
    const chapterDb = await this._chaptersDatabaseService.findOneByID(id);

    return new Promise((resolve) => {
      resolve(this.toChapterContentDto(chapterDb));
    });
  }

  public async createChapter(createChapterDto: CreateChapterDto): Promise<ChapterDto> {
    const createdChapter = await this._chaptersDatabaseService.create(createChapterDto);
    return new Promise((resolve) => resolve(this.toChapterDto(createdChapter)));
  }

  public async updateChapter(id: string, updateChapterDto: UpdateChapterDto): Promise<void> {
    await this._chaptersDatabaseService.update(id, updateChapterDto);
    return new Promise((resolve) => resolve());
  }

  public async updateChapters(chaptersData: RequestUpdateChapterDto[]): Promise<void> {
    await Promise.allSettled(
      chaptersData.map((dataEl) => {
        const updateChapterOrderDto: UpdateChapterOrderDto = {
          order: dataEl.order
        };
        return this._chaptersDatabaseService.update(dataEl.id, updateChapterOrderDto);
      })
    );

    return new Promise((resolve) => resolve());
  }

  public async removeChapter(id: string): Promise<void> {
    await this._chaptersDatabaseService.remove(id);
    return new Promise((resolve) => resolve());
  }

  public async removeChapters(ids: string[]): Promise<void> {
    await Promise.allSettled(ids.map((id) => this._chaptersDatabaseService.remove(id)));
    return new Promise((resolve) => resolve());
  }
}
