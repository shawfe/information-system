export const TaskTypes = ['PICK_ONE', 'PICK_SOME', 'MATCH'] as const;
export declare type TaskType = typeof TaskTypes[number];
export declare type PickTaskType = Extract<TaskType, 'PICK_ONE' | 'PICK_SOME'>;

export interface IExercise {
  id: string;
  title: string;
  variants: IVariant[];
  sectionId: string;
}

export interface IExerciseList {
  id: string;
  title: string;
  sectionId: string;
}

export class Exercise {
  id: string;
  title: string;
  variants: IVariant[];
  sectionId: string;

  constructor(data?: Partial<IExercise>) {
    this.id = data?.id ?? '';
    this.title = data?.title ?? '';
    this.variants = data?.variants ?? [];
    this.sectionId = data?.sectionId ?? '';
  }
}

export declare type CreateExerciseData = Omit<IExercise, 'id'>;
export declare type UpdateExerciseData = Partial<Pick<IExercise, 'title' | 'variants'>>;

export interface IVariant {
  uuid: string;
  tasks: (IPickTask | IMatchTask)[];
}

export class Variant {
  uuid: string;
  tasks: (IPickTask | IMatchTask)[];

  constructor(data?: Partial<IVariant>) {
    this.uuid = data?.uuid ?? '';
    this.tasks = data?.tasks ?? [];
  }
}

export interface IPickTask {
  uuid: string;
  question: string;
  type: TaskType;
  answers: IPickAnswer[];
}

export class PickTask {
  uuid: string;
  question: string;
  type: TaskType;
  answers: IPickAnswer[];

  constructor(data?: Partial<IPickTask>) {
    this.uuid = data?.uuid ?? '';
    this.question = data?.question ?? '';
    this.type = data?.type ?? 'PICK_ONE';
    this.answers = data?.answers ?? [];
  }
}

export interface IPickAnswer {
  uuid: string;
  text: string;
  isRight: boolean;
}

export class PickAnswer {
  uuid: string;
  text: string;
  isRight: boolean;

  constructor(data?: Partial<IPickAnswer>) {
    this.uuid = data?.uuid ?? '';
    this.text = data?.text ?? '';
    this.isRight = data?.isRight ?? false;
  }
}

export interface IMatchTask {
  uuid: string;
  type: TaskType;
  answers: IMatchAnswer[];
}

export class MatchTask {
  uuid: string;
  type: TaskType;
  answers: IMatchAnswer[];

  constructor(data?: Partial<IMatchTask>) {
    this.uuid = data?.uuid ?? '';
    this.type = data?.type ?? 'MATCH';
    this.answers = data?.answers ?? [];
  }
}

export interface IMatchAnswer {
  uuid: string;
  leftPart: string;
  rightPart: string;
}

export class MatchAnswer {
  uuid: string;
  leftPart: string;
  rightPart: string;

  constructor(data?: Partial<IMatchAnswer>) {
    this.uuid = data?.uuid ?? '';
    this.leftPart = data?.leftPart ?? '';
    this.rightPart = data?.rightPart ?? '';
  }
}
