import { IsDefined, Length } from 'class-validator';

export default class CreateListDto {
  @IsDefined()
  @Length(2, 2000)
  name!: string;
}
