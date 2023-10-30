import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  UnprocessableEntityException
} from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new UnprocessableEntityException(this._handleError(e));
      }
    }
  }

  private _handleError(error) {
    return `Bad Request: ${
      error.response?.message?.join(', ') || error.response?.message || error.response || error
    }`;
  }
}
