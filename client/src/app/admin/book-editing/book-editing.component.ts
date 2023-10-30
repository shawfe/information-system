import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatTab, MatTabChangeEvent, MatTabGroup, MatTabHeader } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from 'app/components/confirm-dialog/confirm-dialog.service';
import { BookEditingTabType, ISection } from 'app/models/section.data';
import { SectionTypes, SectionType } from 'app/models/book.data';
import { ChapterListData } from 'app/models/chapter.data';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import { BehaviorSubject, merge, Observable, Subject, takeUntil } from 'rxjs';
import { BookEditingService } from './book-editing.service';

const Font = Quill.import('formats/font');
// We do not add Sans Serif since it is the default
Font.whitelist = ['roboto', 'gilroy'];
Quill.register(Font, true);

@Component({
  selector: 'book-editing',
  templateUrl: './book-editing.component.html',
  styleUrls: ['./book-editing.component.scss']
})
export class BookEditingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('quill') quillEditorRef: QuillEditorComponent;
  @ViewChild(MatTabGroup) tabs: MatTabGroup;

  public quillModules: any;
  public isUnsavedChanges$ = new BehaviorSubject<boolean>(false);
  public sectionTypes = SectionTypes;
  public bookSections$: Observable<ISection[]>;
  public structureSectionTypeControl: FormControl;
  public newSectionNameControl: FormControl;
  public renameSectionControl: FormControl;
  public sectionForAddingChapter: FormControl;
  public newChapterNameControl: FormControl;
  public sectionForRenameChapter: FormControl;
  public renameChapterControl: FormControl;
  public contentSectionTypeControl: FormControl;
  public contentSectionControl: FormControl;
  public contentChapterControl: FormControl;
  public chaptersForEditing$ = new BehaviorSubject<ChapterListData[]>([]);
  public chapterContentForEditing$ = new BehaviorSubject<string>('');
  public sectionIdsToRemove: Map<string, ISection>;
  public chapterIdsToRemove: Map<string, ChapterListData>;

  private _currentTab: BookEditingTabType = 'STRUCTURE';
  private _unsubscribe = new Subject<void>();

  constructor(
    private _bookEditingService: BookEditingService,
    private _translateService: TranslateService,
    private _confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.quillModules = this._getQuillEditorModules();
    this._bookEditingService.init();
    this.bookSections$ = this._bookEditingService.getBookSectionsObservable();
    this.sectionIdsToRemove = this._bookEditingService.getSectionsToRemove();
    this.chapterIdsToRemove = this._bookEditingService.getChaptersToRemove();

    this._initializeControls();
    this._initializeSubscriptions();
  }

  ngAfterViewInit() {
    this.tabs._handleClick = this._interceptTabChange.bind(this);
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
    this._bookEditingService.destroy();
  }

  public onAddSection(): void {
    this._bookEditingService.addSection(this.newSectionNameControl.value);
    this.newSectionNameControl.setValue('');
    this.newSectionNameControl.markAsPristine();
    this.newSectionNameControl.markAsUntouched();
    this.newSectionNameControl.updateValueAndValidity();
  }

  public onRenameSection(): void {
    this._bookEditingService.renameSection(this.renameSectionControl.value);
  }

  public onAddChapter(): void {
    this._bookEditingService.addChapter(
      this.newChapterNameControl.value,
      this.sectionForAddingChapter.value
    );
    this.newChapterNameControl.setValue('');
    this.newChapterNameControl.markAsPristine();
    this.newChapterNameControl.markAsUntouched();
    this.newChapterNameControl.updateValueAndValidity();
  }

  public onRenameChapter(): void {
    this._bookEditingService.renameChapter(this.renameChapterControl.value);
  }

  public onTabChanged(event: MatTabChangeEvent) {
    let sectionTypeForChanging: SectionType;
    this.chaptersForEditing$.next([]);

    if (event.tab.textLabel === this._translateService.instant('BOOK_EDIT_STRUCTURE')) {
      this._currentTab = 'STRUCTURE';
      sectionTypeForChanging = this.structureSectionTypeControl.value;
    } else {
      this._currentTab = 'CONTENT';
      sectionTypeForChanging = this.contentSectionTypeControl.value;
    }

    if (this._bookEditingService.getSelectedSectionType() !== sectionTypeForChanging) {
      this._bookEditingService.setSelectedSectionType(sectionTypeForChanging);
      this._bookEditingService.loadSections();
    }
  }

  public onChangeSectionType(sectionType: SectionType) {
    this._bookEditingService.setSelectedSectionType(sectionType);
    this._bookEditingService.loadSections();
  }

  public onContentChanged(event): void {
    if (this.isUnsavedChanges$.getValue() || !this.contentChapterControl.value) {
      return;
    }

    this.isUnsavedChanges$.next(true);
  }

  public onChangeSectionForEditingChapter(section: ISection): void {
    this.quillEditorRef.quillEditor.setText('');
    this.quillEditorRef.content = '';
    this.isUnsavedChanges$.next(false);

    if (!section) {
      this.chaptersForEditing$.next([]);
      return;
    }
    this.chaptersForEditing$.next(this._bookEditingService.getChaptersByBookSectionId(section.id));
  }

  public onChangeChapterForEditing(chapter: ChapterListData): void {
    this.quillEditorRef.quillEditor.setText('');
    this.isUnsavedChanges$.next(false);
    this._bookEditingService.getChapterContentData(chapter.id).subscribe((chapterContentData) => {
      this.quillEditorRef.content = chapterContentData.content ?? '';
      this.quillEditorRef.quillEditor.clipboard.dangerouslyPasteHTML(
        chapterContentData.content ?? ''
      );
      this.isUnsavedChanges$.next(false);
    });
  }

  public onDropChapter(event: CdkDragDrop<ChapterListData[]>): void {
    const chapter = event.container.data.at(event.previousIndex);
    if (event.currentIndex !== event.previousIndex) {
      this.isUnsavedChanges$.next(true);
      this._bookEditingService.changeChapterOrder(chapter, event.previousIndex, event.currentIndex);
    }
  }

  public onSaveChanges(): void {
    this.isUnsavedChanges$.next(false);
    if (this._currentTab === 'STRUCTURE') {
      this._bookEditingService.saveStructureChanges();
      return;
    }

    const chapter: ChapterListData = this.contentChapterControl.value;
    this._bookEditingService.updateChapterContent(
      chapter.id,
      this.quillEditorRef.quillEditor.root.innerHTML
    );
  }

  public onCancelChanges(): void {
    if (this._currentTab === 'STRUCTURE') {
      this._bookEditingService.clearStructureChanges();
      this._bookEditingService.loadSections();
      return;
    } else {
      this.quillEditorRef.quillEditor.setText('');
      this.quillEditorRef.content = '';
    }

    this.isUnsavedChanges$.next(false);
  }

  public onRemoveSection(section: ISection): void {
    this._bookEditingService.markSectionToRemove(section);
    this.isUnsavedChanges$.next(true);
  }

  public onRevertSection(section: ISection): void {
    this._bookEditingService.unmarkSectionToRemove(section);
    this._checkUnsavedChanges();
  }

  public onRemoveChapter(chapter: ChapterListData): void {
    this._bookEditingService.markChapterToRemove(chapter);
    this.isUnsavedChanges$.next(true);
  }

  public onRevertChapter(id: string): void {
    this._bookEditingService.unmarkChapterToRemove(id);
    this._checkUnsavedChanges();
  }

  private _getQuillEditorModules(): any {
    return {
      formula: false,
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: ['', 'roboto', 'gilroy'] }],
        [{ align: [] }],
        ['clean']
      ]
    };
  }

  private _initializeControls(): void {
    // structure controls
    this.structureSectionTypeControl = new FormControl(this.sectionTypes[0]);
    this.newSectionNameControl = new FormControl('', [
      Validators.required,
      this._uniqueSectionName()
    ]);
    this.renameSectionControl = new FormControl('');
    this.sectionForAddingChapter = new FormControl('');
    this.newChapterNameControl = new FormControl('', [
      Validators.required,
      this._uniqueChapterName()
    ]);
    this.sectionForRenameChapter = new FormControl('');
    this.renameChapterControl = new FormControl('');

    // content controls
    this.contentSectionTypeControl = new FormControl(this.sectionTypes[0]);
    this.contentSectionControl = new FormControl();
    this.contentChapterControl = new FormControl();
  }

  private _initializeSubscriptions(): void {
    this.bookSections$.pipe(takeUntil(this._unsubscribe)).subscribe((sections) => {
      if (!sections.length) {
        this.renameSectionControl.setValue('');
        this.renameSectionControl.disable();
        this.sectionForAddingChapter.setValue('');
        this.sectionForAddingChapter.disable();
        this.sectionForRenameChapter.setValue('');
        this.sectionForRenameChapter.disable();
        this.contentSectionControl.setValue('');
        this.contentSectionControl.disable();
        return;
      }

      this.renameSectionControl.enable();
      this.sectionForAddingChapter.enable();
      this.sectionForRenameChapter.enable();
      this.contentSectionControl.enable();
    });

    merge(
      this.contentSectionTypeControl.valueChanges,
      this.structureSectionTypeControl.valueChanges
    ).subscribe((value: SectionType) => {
      this._bookEditingService.setSelectedSectionType(value);
    });

    this.chaptersForEditing$.subscribe((chapters) => {
      if (chapters?.length) {
        this.renameChapterControl.setValue(chapters.at(0));
        this.renameChapterControl.enable();
        this.contentChapterControl.enable();
        return;
      }
      this.renameChapterControl.disable();
      this.contentChapterControl.disable();
    });

    this.chapterContentForEditing$.subscribe((value) => {
      if (!this.quillEditorRef) {
        return;
      }

      if (!value) {
        this.quillEditorRef.quillEditor.disable();
        return;
      }

      this.quillEditorRef.quillEditor.enable();
      this.quillEditorRef.content = value;
    });
  }

  private _uniqueSectionName(): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      return this._bookEditingService
        .getBookSections()
        .some((section) => section.title === control.value)
        ? { nonuniqueName: true }
        : null;
    };
  }

  private _uniqueChapterName(): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      const section = this.sectionForAddingChapter.value as ISection;
      if (!section?.chapters?.length) {
        return null;
      }
      return section.chapters.some((chapter) => chapter.title === control.value)
        ? { nonuniqueName: true }
        : null;
    };
  }

  private _interceptTabChange(tab: MatTab, tabHeader: MatTabHeader, idx: number) {
    if (this.isUnsavedChanges$.getValue()) {
      this._confirmDialogService
        .confirm(
          'BOOK_UNSAVED_CHANGES_TITLE',
          'BOOK_UNSAVED_CHANGES_MESSAGE',
          'CANCEL_CHANGES',
          'SAVE_CHANGES'
        )
        .subscribe((result) => {
          if (!result) {
            this.onCancelChanges();
          } else {
            this.onSaveChanges();
          }

          return MatTabGroup.prototype._handleClick.apply(this.tabs, [tab, tabHeader, idx]);
        });
    } else {
      this.onCancelChanges();
      return MatTabGroup.prototype._handleClick.apply(this.tabs, [tab, tabHeader, idx]);
    }
  }

  private _checkUnsavedChanges(): void {
    this.isUnsavedChanges$.next(
      !!(
        this.chapterIdsToRemove.size ||
        this.sectionIdsToRemove.size ||
        this._bookEditingService.getChaptersToUpdateOrder().size
      )
    );
  }
}
