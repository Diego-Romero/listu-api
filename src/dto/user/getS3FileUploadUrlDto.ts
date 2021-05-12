import { IsDefined } from 'class-validator';

export default class GetS3FileUploadUrlDTO {
  @IsDefined()
  name!: string;
}
