export interface CodeAnnotation {
  text: string;
  type: CodeAnnotationType;
}

export declare type CodeAnnotationType = 'error' | 'warning' | 'info';