export interface IChapter {
  id: string;
  title: string;
  order: number;
  content: string;
  sectionId: string;
}

export declare type CreateChapterData = Pick<IChapter, 'title' | 'sectionId' | 'order'>;
export declare type UpdateChapter = Pick<IChapter, 'title' | 'content'>;
export declare type UpdateChapterOrder = Pick<IChapter, 'id' | 'order'>;
export declare type ChapterListData = Omit<IChapter, 'content'>;
export declare type ChapterContent = Pick<IChapter, 'id' | 'content'>;
