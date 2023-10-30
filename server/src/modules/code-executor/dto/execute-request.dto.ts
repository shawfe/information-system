import { IsNotEmpty } from 'class-validator';

export class ExecuteRequestDto {
  @IsNotEmpty()
  source_code: any;

  @IsNotEmpty()
  language_id: string;

  number_of_runs: null;

  @IsNotEmpty()
  stdin: any;

  expected_output: string | null;

  @IsNotEmpty()
  cpu_time_limit: string | null;

  @IsNotEmpty()
  cpu_extra_time: string | null;

  @IsNotEmpty()
  wall_time_limit: string | null;

  @IsNotEmpty()
  memory_limit: string | null;

  @IsNotEmpty()
  stack_limit: string | null;

  @IsNotEmpty()
  max_processes_and_or_threads: string | null;

  @IsNotEmpty()
  enable_per_process_and_thread_time_limit: boolean | null;

  @IsNotEmpty()
  enable_per_process_and_thread_memory_limit: boolean | null;

  @IsNotEmpty()
  max_file_size: string | null;

  @IsNotEmpty()
  enable_network: boolean | null;
}

export default ExecuteRequestDto;
