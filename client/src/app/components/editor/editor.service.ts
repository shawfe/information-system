import { Injectable } from '@angular/core';
import { CodeExecutionResponse } from 'app/models/code-execution.data';
import { EditorRequestsService } from 'app/services/editor-requests.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class EditorService {
  private _consoleLogs$: BehaviorSubject<string[]>;

  constructor(private _editorRequestsService: EditorRequestsService) {
    this._consoleLogs$ = new BehaviorSubject<string[]>([]);
  }

  isConsoleLogs(): Observable<string[]> {
    return this._consoleLogs$.asObservable();
  }

  clearConsoleLogs(): void {
    this._consoleLogs$.next([]);
  }

  checkCode(code: string, executeOnce: boolean = true): void {
    const waitingLog = executeOnce ? 'Code is under checking...' : 'Code is testing...';
    this._addLogItem(waitingLog);
    this._editorRequestsService
      .executeCode(code, executeOnce)
      .subscribe((result: CodeExecutionResponse) => {
        this._addLogItem(result.message);
      });
  }

  private _addLogItem(message: string): void {
    this._consoleLogs$.next([...this._consoleLogs$.getValue(), message]);
  }
}
