import { Injectable } from '@angular/core';
import { LoadingOverlayService } from '@shared/services';
import { RenameDialogService } from 'app/components/rename-dialog/rename-dialog.service';
import { ISection } from 'app/models/section.data';
import { SectionType } from 'app/models/book.data';
import { ChapterContent, ChapterListData, UpdateChapterOrder } from 'app/models/chapter.data';
import { BookSectionsRequestsService } from 'app/services/book-sections-requests.service';
import { ChaptersRequestsService } from 'app/services/chapters-requests.service';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';

@Injectable()
export class BookEditingService {
  private _bookSections$ = new BehaviorSubject<ISection[]>([]);
  private _selectedSectionType$ = new BehaviorSubject<SectionType>('JAVASCRIPT');
  private _chaptersToUpdateOrderMap = new Map<string, UpdateChapterOrder>();
  private _chapterIdsToRemove = new Map<string, ChapterListData>();
  private _sectionIdsToRemove = new Map<string, ISection>();

  constructor(
    private _bookSectionsRequestsService: BookSectionsRequestsService,
    private _chaptersRequestsService: ChaptersRequestsService,
    private _renameDialogService: RenameDialogService,
    private _loadingOverlayService: LoadingOverlayService
  ) {}

  init(): void {
    this.setSelectedSectionType('JAVASCRIPT');
    this.loadSections();
  }

  destroy(): void {
    this.setBookSections([]);
    this.clearStructureChanges();
  }

  public getBookSections(): ISection[] {
    return this._bookSections$.getValue();
  }

  public setBookSections(value: ISection[]): void {
    this._bookSections$.next(value);
  }

  public getBookSectionsObservable(): Observable<ISection[]> {
    return this._bookSections$.asObservable();
  }

  public getChaptersByBookSectionId(id: string): ChapterListData[] {
    return this.getBookSections().find((section) => section.id === id).chapters;
  }

  public getSelectedSectionType(): SectionType {
    return this._selectedSectionType$.getValue();
  }

  public setSelectedSectionType(value: SectionType): void {
    this._selectedSectionType$.next(value);
  }

  public getChaptersToRemove(): Map<string, ChapterListData> {
    return this._chapterIdsToRemove;
  }

  public getSectionsToRemove(): Map<string, ISection> {
    return this._sectionIdsToRemove;
  }

  public getChaptersToUpdateOrder(): Map<string, UpdateChapterOrder> {
    return this._chaptersToUpdateOrderMap;
  }

  public markChapterToRemove(chapter: ChapterListData): void {
    const parentSection = this.getBookSections().find(
      (section) => section.id === chapter.sectionId
    );
    this._chapterIdsToRemove.set(chapter.id, chapter);
    if (parentSection.chapters.every((chapter) => this._chapterIdsToRemove.has(chapter.id))) {
      this.markSectionToRemove(parentSection, false);
    }
  }

  public unmarkChapterToRemove(id: string): void {
    this._chapterIdsToRemove.delete(id);
  }

  public markSectionToRemove(section: ISection, withChapters = true): void {
    if (withChapters) {
      for (const chapter of section.chapters) {
        this.markChapterToRemove(chapter);
      }
    }

    this._sectionIdsToRemove.set(section.id, section);
  }

  public unmarkSectionToRemove(section: ISection): void {
    for (const chapter of section.chapters) {
      this.unmarkChapterToRemove(chapter.id);
    }

    this._sectionIdsToRemove.delete(section.id);
  }

  public loadSections(): void {
    this._bookSectionsRequestsService
      .requestBookSections(this.getSelectedSectionType())
      .subscribe((sections) => {
        this.setBookSections(sections);
      });
  }

  public getChapterContentData(id: string): Observable<ChapterContent> {
    return this._chaptersRequestsService.requestChapterContent(id);
  }

  public addSection(name: string): void {
    const selectedSectionType = this.getSelectedSectionType();
    this._bookSectionsRequestsService
      .requestCreateBookSection({
        title: name,
        order: this.getBookSections().length + 1,
        sectionType: selectedSectionType
      })
      .subscribe((createdSection) => {
        if (selectedSectionType !== this.getSelectedSectionType()) {
          return;
        }

        const sections = this.getBookSections();
        sections.push(createdSection);
        this.setBookSections(sections);
      });
  }

  public renameSection(section: ISection): void {
    this._renameDialogService
      .rename(
        'RENAME_SETION_TITLE',
        section.title,
        this.getBookSections().map((section) => section.title)
      )
      .subscribe((newName) => {
        if (!newName) {
          return;
        }

        this._bookSectionsRequestsService
          .requestUpdateBookSection(section.id, {
            title: section.title
          })
          .subscribe(() => {
            section.title = newName;
          });
      });
  }

  public addChapter(name: string, sectionToModify: ISection) {
    this._chaptersRequestsService
      .requestCreateChapter({
        title: name,
        sectionId: sectionToModify.id,
        order: sectionToModify.chapters.length + 1
      })
      .subscribe((createdChapter) => {
        const sections = this.getBookSections();
        const sectionIndex = sections.findIndex((section) => section.id === sectionToModify.id);

        if (sectionIndex === -1) {
          return;
        }

        sections.at(sectionIndex).chapters.push(createdChapter);
        this.setBookSections(sections);
      });
  }

  public renameChapter(chapter: ChapterListData): void {
    const usedNames = this.getBookSections()
      .find((section) => section.id === chapter.sectionId)
      .chapters.map((chapter) => chapter.title);
    this._renameDialogService
      .rename('RENAME_CHAPTER_TITLE', chapter.title, usedNames)
      .subscribe((newName) => {
        if (!newName) {
          return;
        }

        this._chaptersRequestsService
          .requestUpdateChapter(chapter.id, { title: newName })
          .subscribe(() => {
            chapter.title = newName;
          });
      });
  }

  public updateChapterContent(id: string, content: string): void {
    this._chaptersRequestsService.requestUpdateChapter(id, { content: content }).subscribe();
  }

  public changeChapterOrder(chapter: ChapterListData, oldIndex: number, newIndex: number): void {
    const sections = this.getBookSections();
    const chapterSectionIndex = sections.findIndex((section) => section.id === chapter.sectionId);

    if (chapterSectionIndex === -1) {
      return;
    }

    const chapterSection = sections.at(chapterSectionIndex);

    const chapterToMove = chapterSection.chapters.at(oldIndex);
    chapterSection.chapters.splice(oldIndex, 1);
    chapterSection.chapters.splice(newIndex, 0, chapterToMove);

    for (let i = 0; i < chapterSection.chapters.length; i++) {
      chapterSection.chapters.at(i).order = i + 1;
    }

    this._addChaptersToUpdateOrder(chapterSection.chapters);
  }

  public saveStructureChanges(): void {
    this._loadingOverlayService.showSpinner();
    const sections = this.getBookSections();
    for (const section of sections) {
      if (this._sectionIdsToRemove.has(section.id)) {
        for (const chapter of section.chapters) {
          this._chaptersToUpdateOrderMap.delete(chapter.id);
        }
        continue;
      }

      this._recalculateSectionChaptersOrder(section);
    }

    const requests: Observable<any>[] = [];

    if (this._sectionIdsToRemove.size) {
      requests.push(
        this._bookSectionsRequestsService.requestRemoveBookSections([
          ...this.getSectionsToRemove().keys()
        ])
      );
    }

    if (this._chapterIdsToRemove.size) {
      requests.push(
        this._chaptersRequestsService.requestRemoveChapters([...this.getChaptersToRemove().keys()])
      );
    }

    if (this._chaptersToUpdateOrderMap.size) {
      requests.push(
        this._chaptersRequestsService.requestUpdateChapters([
          ...this._chaptersToUpdateOrderMap.values()
        ])
      );
    }

    forkJoin(requests).subscribe(() => {
      this.loadSections();
      this._loadingOverlayService.hideSpinner();
      this.clearStructureChanges();
    });
  }

  public clearStructureChanges(): void {
    this._chapterIdsToRemove.clear();
    this._sectionIdsToRemove.clear();
    this._chaptersToUpdateOrderMap.clear();
  }

  private _addChaptersToUpdateOrder(chapters: ChapterListData[]): void {
    for (const chapter of chapters) {
      this._chaptersToUpdateOrderMap.set(chapter.id, { id: chapter.id, order: chapter.order });
    }
  }

  private _recalculateSectionChaptersOrder(section: ISection) {
    const chaptersToRemove = this.getChaptersToRemove();
    let newOrder = 1;
    const chaptersToUpdate: ChapterListData[] = [];
    for (const chapter of section.chapters) {
      if (chaptersToRemove.has(chapter.id)) {
        this._chaptersToUpdateOrderMap.delete(chapter.id);
        continue;
      }

      if (chapter.order !== newOrder) {
        chapter.order = newOrder;
        chaptersToUpdate.push(chapter);
      }
      newOrder += 1;
    }
    this._addChaptersToUpdateOrder(chaptersToUpdate);
  }
}
