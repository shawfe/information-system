import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
  constructor(private _translateService: TranslateService) {}

  changes = new Subject<void>();
  firstPageLabel = this._translateService.instant('FIRST_PAGE');
  lastPageLabel = this._translateService.instant('LAST_PAGE');
  itemsPerPageLabel = `${this._translateService.instant('ELEMENTS_PER_PAGE')}:`;

  nextPageLabel = this._translateService.instant('NEXT_PAGE');
  previousPageLabel = this._translateService.instant('PREVIOUS_PAGE');

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `${this._translateService.instant('PAGE')} 1 ${this._translateService.instant(
        'FROM'
      )} 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `${this._translateService.instant('PAGE')} ${page + 1} ${this._translateService.instant(
      'FROM'
    )} ${amountPages}`;
  }
}
