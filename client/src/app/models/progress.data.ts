import { SectionType } from './book.data';

export declare type ProgressItemType = 'CHAPTER' | 'EXERCISE';

export interface IProgress {
  id: string;
  lastModifiedDate: string;
  userId: string;
  progressItems: IProgressItem[];
  progressBars: IProgressBar[];
}

export interface IProgressItem {
  sectionType: SectionType;
  type: ProgressItemType;
  finishedDate: string;
  itemData: IProgressExerciseData | IProgressChapterData;
}

export interface IProgressBar {
  sectionType: SectionType;
  finishedProgressItems: number;
  totalProgressItems: number;
}

export interface IProgressExerciseData {
  exerciseId: string;
  title: string;
  earnedPoints: number;
  maxPoints: number;
  mark: number;
}

export interface IProgressChapterData {
  chapterId: string;
  title: string;
}
