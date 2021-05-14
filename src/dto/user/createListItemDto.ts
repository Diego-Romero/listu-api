import { IsDefined, Length } from 'class-validator';

export default class CreateListItemDto {
  @IsDefined()
  @Length(2, 1000)
  name!: string;
}
