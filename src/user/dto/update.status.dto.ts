import { InputType, Field } from '@nestjs/graphql';
import { Status } from '../../enums';

@InputType()
export class UpdateStatusInput {
  @Field(() => Status)
  status: Status;
}
