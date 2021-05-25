import { IsDefined, Length } from 'class-validator';

export default class CreateListItemDto {
  @IsDefined()
  @Length(2, 2000)
  name!: string;
}
