import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as ace from 'ace-builds';
import { CodeAnnotation } from 'app/models/editor.data';
import { BehaviorSubject, Observable } from 'rxjs';
import { EditorService } from './editor.service';

// Currently unused (will be needed for code writing)
@Component({
  selector: 'editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editor') private editor: ElementRef<HTMLElement>;

  public isConsoleLogsObservable: Observable<string[]>;

  public isCodeValidObservable: Observable<boolean>;
  private _isCodeValid$: BehaviorSubject<boolean>;

  private _aceEditor;

  constructor(private _editorService: EditorService) {}

  ngOnInit() {
    this.isConsoleLogsObservable = this._editorService.isConsoleLogs();
    this._isCodeValid$ = new BehaviorSubject<boolean>(false);
    this.isCodeValidObservable = this._isCodeValid$.asObservable();
  }

  ngAfterViewInit() {
    this._aceEditor = ace.edit(this.editor.nativeElement);

    this._aceEditor.setTheme('ace/theme/twilight');
    this._aceEditor.session.setMode('ace/mode/javascript');

    this._aceEditor.setOptions({
      fontSize: '14px',
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });

    this._aceEditor.getSession().on('changeAnnotation', () => {
      this._checkCodeAnnotation();
    });
  }

  ngOnDestroy(): void {
    this._editorService.clearConsoleLogs();
  }

  public onCheckCode(executeOnce: boolean = true): void {
    const userCode = this._aceEditor.getValue();
    this._checkCodeAnnotation();

    if (!userCode || !this._isCodeValid$.getValue()) {
      return;
    }

    this._editorService.checkCode(userCode, executeOnce);
  }

  public onReset(): void {}

  private _checkCodeAnnotation(): void {
    const codeAnnotations: Array<CodeAnnotation> = this._aceEditor.getSession().getAnnotations();
    const hasErrors: boolean = codeAnnotations.some(
      (el) => el.type === 'error' || el.type === 'warning'
    );
    this._isCodeValid$.next(!hasErrors);
  }
}
