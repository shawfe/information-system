import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs';
import ExecuteRequestDto from './dto/execute-request.dto';
import ExecuteResultDto from './dto/execute-result.dto';

@Injectable()
export class CodeExecutorService {
  private _executionUrl: string;
  private _executionQueue: Map<string, string>;

  constructor(private readonly _configService: ConfigService, private readonly _http: HttpService) {
    this._executionUrl = this._getExecutionUrl();
    this._executionQueue = new Map<string, string>();
    process.on('uncaughtException', function (err) {});
  }

  public async executeCode(code: string) {
    const data = this._createExecutionData(
      this._prepareCodeForExecution(code, 'test'),
      '63',
      `[{"a": 2}]`,
      'answ'
    );
    data.stdin = '{ "a": 2, "b": "answ", "pamams": { "d": 3 } }';

    this._http
      .post(`http://${this._executionUrl}/submissions`, data, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        })
      )
      .subscribe({
        next: (data: { token: string }) => {
          this._executionQueue.set(data.token, 'userID');

          setTimeout(() => {
            this._getExecutionResult(data.token);
          }, 2000);
        },
        error: (err) => {}
      });
  }

  private _getExecutionResult(token: string) {
    this._http
      .get(`http://${this._executionUrl}/submissions/${token}`)
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        })
      )
      .subscribe({
        next: (result: ExecuteResultDto) => {
          // Actual result

          if (result.stderr) {
            // Execution error
            return;
          }

          if (result.status.description === 'Wrong Answer') {
            // Wrong answer
            return;
          }

          // Right answer
        }
      });
  }
  private _prepareCodeForExecution(initialCode: string, functionName: string): string {
    const code = `${initialCode} process.stdin.on("data", data => {
        console.log(${functionName}(JSON.parse(data)))
       });`;
    return code;
  }

  private _createExecutionData(
    code: string,
    language_id: string,
    inputData: string,
    expectedOutput: string
  ): ExecuteRequestDto {
    const executionData: ExecuteRequestDto = {
      source_code: code,
      language_id: language_id,
      number_of_runs: null,
      stdin: inputData,
      expected_output: expectedOutput,
      cpu_time_limit: null,
      cpu_extra_time: null,
      wall_time_limit: null,
      memory_limit: null,
      stack_limit: null,
      max_processes_and_or_threads: null,
      enable_per_process_and_thread_time_limit: null,
      enable_per_process_and_thread_memory_limit: null,
      max_file_size: null,
      enable_network: null
    };

    return executionData;
  }
  private _getExecutionUrl(): string {
    const url = this._configService.get('CODE_EXECUTION_URL');
    const port = this._configService.get('CODE_EXECUTION_PORT');

    return `${url}${port ? ':' : ''}${port}`;
  }
}
