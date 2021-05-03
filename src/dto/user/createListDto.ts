import { IsDefined, Length } from 'class-validator';

export default class CreateListDto {
  @IsDefined()
  @Length(2, 50)
  name!: string;
}
