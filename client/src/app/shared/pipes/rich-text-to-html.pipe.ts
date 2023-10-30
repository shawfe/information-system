import { Pipe, PipeTransform } from '@angular/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

@Pipe({
  name: 'richTextToHtml'
})
export class RichTextToHtml implements PipeTransform {
  constructor() {}
  transform(richText: any): any {
    if (richText === undefined || richText === null || richText.nodeType !== 'document') {
      return;
    }

    return documentToHtmlString(richText);
  }
}
