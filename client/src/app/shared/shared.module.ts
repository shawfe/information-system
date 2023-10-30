import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdToHtmlPipe } from './pipes/md-to-html.pipe';
import { RichTextToHtml } from './pipes/rich-text-to-html.pipe';
import { GetUrlService } from './services/get-url.service';

@NgModule({
  imports: [CommonModule],
  providers: [GetUrlService],
  declarations: [MdToHtmlPipe, RichTextToHtml],
  exports: [MdToHtmlPipe, RichTextToHtml]
})
export class SharedModule {}
