export class ExecuteResultDto {
  stdout: string;
  time: string;
  memory: number;
  stderr: string;
  token: string;
  compile_output: string;
  message: string;
  status: ExecuteStatusDto;
}

class ExecuteStatusDto {
  id: number;
  description: ExecuteStatusDescriptionType;
}

declare type ExecuteStatusDescriptionType = 'Accepted' | 'Wrong Answer' | 'Runtime Error (NZEC)';

export default ExecuteResultDto;
