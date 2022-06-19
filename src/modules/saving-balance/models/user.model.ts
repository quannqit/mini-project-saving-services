import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SavingBalanceModel {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  userId: string;

  @Field((type) => Number)
  availableAmount: number;

  @Field((type) => Date)
  createdAt: Date;
}
