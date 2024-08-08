import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from '../../enums';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Name is required if provided' })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @Field(() => Role, { nullable: true })
  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role' })
  role?: Role;
}
