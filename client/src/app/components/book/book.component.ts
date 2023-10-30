import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ISectionWithExercises } from 'app/models/section.data';
import { BookEvents, SectionType } from 'app/models/book.data';
import { ChapterListData } from 'app/models/chapter.data';
import { IExercise, IExerciseList } from 'app/models/exercise.data';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { BookService } from './book.service';

@Component({
  selector: 'book',
  templateUrl: 'book.component.html',
  styleUrls: ['./book.component.scss'],
  animations: [
    trigger('animationWidth', [
      state(
        'open',
        style({
          width: '256px'
        })
      ),
      state(
        'close',
        style({
          width: '20px'
        })
      ),
      transition('open <=> close', animate('400ms 0ms ease-in-out'))
    ]),

    trigger('animationMargin', [
      state(
        'open',
        style({
          marginLeft: '256px'
        })
      ),
      state(
        'close',
        style({
          marginLeft: '20px'
        })
      ),
      transition('open <=> close', animate('400ms 0ms ease-in-out'))
    ])
  ]
})
export class BookComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bookContent') bookContentRef: ElementRef<HTMLElement>;

  public fileredBookSections$: Observable<ISectionWithExercises[]>;
  public selectedChapter$: Observable<ChapterListData>;
  public selectedChapterContent$: Observable<string>;
  public selectedChapterId: string;
  public selectedExerciseId: string;
  public selectedExercise$: Observable<IExerciseList>;
  public selectedExerciseWithContent$: Observable<IExercise>;
  public chaptersType: SectionType;
  public exerciseListBySectionsMap = new Map<string, IExerciseList[]>();
  public searchControl = new FormControl('');
  public currentTaskIndex = 0;
  public finishedItemIds: Set<string>;

  private _unsubscribe = new Subject<void>();

  constructor(private _bookService: BookService) {}

  ngOnInit(): void {
    this._bookService.init();
    this.fileredBookSections$ = this._bookService.getFilteredBookSectionsObservable();
    this.selectedChapter$ = this._bookService.getSelectedChapterObservable();
    this.selectedChapterContent$ = this._bookService.getSelectedChapterContentObservable();
    this.selectedExercise$ = this._bookService.getSelectedExerciseObservable();
    this.selectedExerciseWithContent$ =
      this._bookService.getSelectedExerciseWithContentObservable();
    this.chaptersType = this._bookService.getSectionType();
    this.selectedChapter$.pipe(takeUntil(this._unsubscribe)).subscribe((chapter) => {
      if (!chapter) {
        this.selectedChapterId = null;
        return;
      }
      this.selectedChapterId = chapter.id;
    });

    this._bookService
      .getSelectedExerciseObservable()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((exercise) => {
        if (!exercise) {
          this.selectedExerciseId = null;
          return;
        }
        this.selectedExerciseId = exercise.id;
      });

    this.searchControl.valueChanges.pipe(debounceTime(10)).subscribe((value) => {
      this._bookService.filterSections(value);
    });

    this._bookService
      .getFinishedItemsObservable()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((data) => {
        this.finishedItemIds = data;
      });
  }

  ngAfterViewInit(): void {
    this._initBookEvents();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
    this._bookService.destroy();
  }

  public onChapterSelected(chapter: ChapterListData): void {
    if (chapter.id === this.selectedChapterId) {
      return;
    }
    this._bookService.setSelectedExercise(null);
    this._bookService.setSelectedChapter(chapter);
  }

  public onExerciseSelected(exercise: IExerciseList): void {
    if (exercise.id === this.selectedExerciseId) {
      return;
    }
    this._bookService.setSelectedChapter(null);
    this._bookService.setSelectedExercise(exercise);
  }

  public onExerciseFinished(data: IExercise): void {
    this._bookService.exerciseFinished(data);
  }

  public onTaskIndexChanged(index: number): void {
    this.currentTaskIndex = index;
  }

  public onChapterFinished(): void {
    this._bookService.chapterFinished();
  }

  private _initBookEvents() {
    for (const event of BookEvents) {
      this.bookContentRef.nativeElement.addEventListener(event, (e) => {
        e.preventDefault();
      });
    }
  }
}
