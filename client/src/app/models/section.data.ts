import { SectionType } from './book.data';
import { ChapterListData } from './chapter.data';
import { IExerciseList } from './exercise.data';

export interface ISection {
  id: string;
  title: string;
  sectionType: SectionType;
  chapters: ChapterListData[];
  order: number;
}

export interface ISectionWithExercises extends ISection {
  exercises: IExerciseList[];
}

export declare type CreateSection = Pick<ISection, 'title' | 'sectionType' | 'order'>;
export declare type UpdateSection = Pick<ISection, 'title' | 'order'>;
export declare type BookEditingTabType = 'STRUCTURE' | 'CONTENT';
