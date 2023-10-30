import { Injectable } from '@angular/core';
import { ISectionWithExercises } from 'app/models/section.data';
import { SectionType } from 'app/models/book.data';
import { ChapterListData } from 'app/models/chapter.data';
import { IExercise, IExerciseList } from 'app/models/exercise.data';
import { BookSectionsRequestsService } from 'app/services/book-sections-requests.service';
import { ChaptersRequestsService } from 'app/services/chapters-requests.service';
import { ExerciseRequestsService } from 'app/services/exercise-requests.service';
import { ProgressRequestsService } from 'app/services/progress-requests.service';
import { StateManagerAppService } from 'app/state-manger/state.manager.app.service';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

@Injectable()
export class BookService {
  private _bookSections$ = new BehaviorSubject<ISectionWithExercises[]>([]);
  private _filteredBookSections$ = new BehaviorSubject<ISectionWithExercises[]>([]);
  private _selectedChapter$ = new BehaviorSubject<ChapterListData>(null);
  private _selectedExercise$ = new BehaviorSubject<IExerciseList>(null);
  private _selectedChapterContent$ = new BehaviorSubject<string>('');
  private _selectedExerciseWithContent$ = new BehaviorSubject<IExercise>(null);
  private _finishedItemIds$ = new BehaviorSubject<Set<string>>(new Set<string>());
  private _unsubscribe = new Subject<void>();

  constructor(
    private _bookSectionsRequestsService: BookSectionsRequestsService,
    private _chaptersRequestsService: ChaptersRequestsService,
    private _stateManagerAppService: StateManagerAppService,
    private _exerciseRequestsService: ExerciseRequestsService,
    private _progressRequestsService: ProgressRequestsService
  ) {}

  init(): void {
    this.loadFinishedItems();
    this.loadBookData();
    this.getSelectedChapterObservable()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((chapter) => {
        if (chapter?.id) {
          this.loadChapterContent(chapter.id);
          return;
        }
        this.setSelectedChapterContent('');
      });

    this.getSelectedExerciseObservable()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((exercise) => {
        if (exercise?.id) {
          this.loadExerciseData(exercise.id);
          return;
        }
        this.setSelectedExerciseWithContent(null);
      });
  }

  destroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
    this._clearData();
    this.setBookSections([]);
    this.setSelectedChapter(null);
    this.setSelectedChapterContent('');
  }

  public getBookSections(): ISectionWithExercises[] {
    return this._bookSections$.getValue();
  }

  public setBookSections(value: ISectionWithExercises[]): void {
    this._bookSections$.next(value);
  }

  public getBookSectionsObservable(): Observable<ISectionWithExercises[]> {
    return this._bookSections$.asObservable();
  }

  public getFilteredBookSections(): ISectionWithExercises[] {
    return this._filteredBookSections$.getValue();
  }

  public setFilteredBookSections(value: ISectionWithExercises[]): void {
    this._filteredBookSections$.next(value);
  }

  public getFilteredBookSectionsObservable(): Observable<ISectionWithExercises[]> {
    return this._filteredBookSections$.asObservable();
  }

  public getSelectedChapter(): ChapterListData {
    return this._selectedChapter$.getValue();
  }

  public setSelectedChapter(value: ChapterListData): void {
    this._selectedChapter$.next(value);
  }

  public getSelectedChapterObservable(): Observable<ChapterListData> {
    return this._selectedChapter$.asObservable();
  }

  public getSelectedExercise(): IExerciseList {
    return this._selectedExercise$.getValue();
  }

  public setSelectedExercise(value: IExerciseList): void {
    this._selectedExercise$.next(value);
  }

  public getSelectedExerciseObservable(): Observable<IExerciseList> {
    return this._selectedExercise$.asObservable();
  }

  public getSelectedChapterContent(): string {
    return this._selectedChapterContent$.getValue();
  }

  public setSelectedChapterContent(value: string): void {
    this._selectedChapterContent$.next(value);
  }

  public getSelectedChapterContentObservable(): Observable<string> {
    return this._selectedChapterContent$.asObservable();
  }

  public getSelectedExerciseWithContent(): IExercise {
    return this._selectedExerciseWithContent$.getValue();
  }

  public setSelectedExerciseWithContent(value: IExercise): void {
    this._selectedExerciseWithContent$.next(value);
  }

  public getSelectedExerciseWithContentObservable(): Observable<IExercise> {
    return this._selectedExerciseWithContent$.asObservable();
  }

  public getFinishedItems(): Set<string> {
    return this._finishedItemIds$.getValue();
  }

  public getFinishedItemsObservable(): Observable<Set<string>> {
    return this._finishedItemIds$.asObservable();
  }

  public loadBookData(): void {
    let sectionType: SectionType = 'JAVASCRIPT';

    if (this._stateManagerAppService.getActiveAppSection() === 'TYPESCRIPT') {
      sectionType = 'TYPESCRIPT';
    }

    this._bookSectionsRequestsService
      .requestBookSectionsWithExercises(sectionType)
      .subscribe((sections) => {
        if (sections.length && sections.at(0).chapters.length) {
          this.setSelectedChapter(sections.at(0).chapters.at(0));
        }
        this.setFilteredBookSections(sections);
        this.setBookSections(sections);

        for (const section of sections) {
          this._checkSectionFinished(section);
        }
      });
  }

  public loadChapterContent(id: string): void {
    this._chaptersRequestsService.requestChapterContent(id).subscribe((contentData) => {
      this.setSelectedChapterContent(contentData.content);
    });
  }

  public loadExerciseData(id: string): void {
    this._exerciseRequestsService.requestExercise(id).subscribe((exerciseData) => {
      this.setSelectedExerciseWithContent(exerciseData);
    });
  }

  public loadFinishedItems(): void {
    this._progressRequestsService.requestFinishedItems().subscribe((data) => {
      this._finishedItemIds$.next(new Set<string>(data.finishedItems));
    });
  }

  public getSectionType(): SectionType {
    const bookSection = this._stateManagerAppService.getActiveAppSection();
    switch (bookSection) {
      case 'JAVASCRIPT':
      case 'TYPESCRIPT': {
        return bookSection;
      }

      default: {
        return 'JAVASCRIPT';
      }
    }
  }

  public filterSections(value: string): void {
    let sections: ISectionWithExercises[] = JSON.parse(JSON.stringify(this.getBookSections()));
    for (const section of sections) {
      section.chapters = section.chapters.filter((chapter) =>
        chapter.title.toLowerCase().includes(value.toLowerCase())
      );
    }

    sections = sections.filter((section) => section.chapters.length);
    this.setFilteredBookSections(sections);
  }

  public chapterFinished(): void {
    const finishedChapter = this.getSelectedChapter();
    if (this.getFinishedItems().has(finishedChapter.id)) {
      this._findNextChapter(finishedChapter);
      return;
    }

    this._progressRequestsService.requestUpdateProgressChapter(finishedChapter.id).subscribe(() => {
      this._findNextChapter(finishedChapter);
    });
  }

  public exerciseFinished(finishedExercise: IExercise): void {
    if (this.getFinishedItems().has(finishedExercise.id)) {
      this._findNextExercise(finishedExercise);
      return;
    }
    this._progressRequestsService.requestUpdateProgressExercise(finishedExercise).subscribe(() => {
      this._findNextExercise(finishedExercise);
    });
  }

  private _clearData(): void {
    this.setBookSections([]);
    this.setFilteredBookSections([]);
    this.setSelectedChapter(null);
    this.setSelectedExercise(null);
    this.setSelectedChapterContent('');
    this.setSelectedExerciseWithContent(null);
    this.getFinishedItems().clear();
  }

  private _checkSectionFinished(section: ISectionWithExercises): void {
    const finishedItems = this.getFinishedItems();
    const chaptersFinished = section.chapters.every((chapter) => finishedItems.has(chapter.id));
    const exercisesFinished = section.exercises.every((exercise) => finishedItems.has(exercise.id));

    if (chaptersFinished && exercisesFinished) {
      finishedItems.add(section.id);
    }
  }

  private _findNextChapter(finishedChapter: ChapterListData): void {
    const sections = this.getBookSections();
    const sectionIndex = this.getBookSections().findIndex(
      (section) => section.id === finishedChapter.sectionId
    );
    const finishedChapterIndex = sections
      .at(sectionIndex)
      .chapters.findIndex((chapter) => chapter.id === finishedChapter.id);

    this.getFinishedItems().add(finishedChapter.id);
    this.setSelectedChapter(null);
    this.setSelectedExercise(null);
    this._findAndSetNextItem(sectionIndex, finishedChapterIndex, 'CHAPTER');
  }

  private _findNextExercise(finishedExercise: IExercise): void {
    const sections = this.getBookSections();
    const sectionIndex = this.getBookSections().findIndex(
      (section) => section.id === finishedExercise.sectionId
    );
    const finishedExerciseIndex = sections
      .at(sectionIndex)
      .exercises.findIndex((exercise) => exercise.id === finishedExercise.id);

    this.getFinishedItems().add(finishedExercise.id);
    this.setSelectedChapter(null);
    this.setSelectedExercise(null);
    this._findAndSetNextItem(sectionIndex, finishedExerciseIndex, 'EXERCISE');
  }

  private _findAndSetNextItem(
    sectionIndex: number,
    itemIndex: number,
    itemType: 'CHAPTER' | 'EXERCISE'
  ): void {
    const sections = this.getBookSections();
    let skipChapters = itemType === 'EXERCISE';

    for (let i = sectionIndex; i < sections.length; i++) {
      if (!this.getFinishedItems().has(sections.at(i).id)) {
        this._checkSectionFinished(sections.at(i));
      }
      const chapters = sections.at(i).chapters;
      const exercises = sections.at(i).exercises;
      const initialChapterIndex = itemType === 'CHAPTER' && i === sectionIndex ? itemIndex + 1 : 0;
      const initialExerciseIndex =
        itemType === 'EXERCISE' && i === sectionIndex ? itemIndex + 1 : 0;

      if (!skipChapters) {
        for (let j = initialChapterIndex; j < chapters.length; j++) {
          this.setSelectedChapter(chapters.at(j));
          return;
        }
      }

      for (let j = initialExerciseIndex; j < exercises.length; j++) {
        this.setSelectedExercise(exercises.at(j));
        return;
      }

      skipChapters = false;
    }
  }
}
