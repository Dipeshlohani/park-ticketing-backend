import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.schema';
import { UserInput } from './dto/create.user.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from 'src/common/validation-exception.factory';
import { Public } from 'src/auth/public.decorator';
import { UpdateUserInput } from './dto/update.user.dto';
import { ResetPasswordInput } from './dto/reset.password.dto';
import { UpdateStatusInput } from './dto/update.status.dto';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Query(() => User)
  async getUserById(@Args('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  @UsePipes(new ValidationPipe(validationPipeOptions))
  async createUser(@Args('input') input: UserInput): Promise<User> {
    return this.userService.create(input);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(id, input);
  }

  @Mutation(() => User)
  async deleteUser(@Args('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }

  @Mutation(() => User)
  async resetPassword(
    @Args('id') id: string,
    @Args('input') input: ResetPasswordInput,
  ): Promise<User> {
    return this.userService.resetPassword(id, input);
  }

  @Mutation(() => User)
  async updateStatus(
    @Args('id') id: string,
    @Args('input') input: UpdateStatusInput,
  ): Promise<User> {
    return this.userService.updateStatus(id, input);
  }

  @Query(() => Counts)
  async getUserCounts() {
    return this.userService.getUserCounts();
  }
}

// Define the Counts type

@ObjectType()
class Counts {
  @Field()
  totalUsers: number;

  @Field()
  staffCount: number;

  @Field()
  directorCount: number;

  @Field()
  adminCount: number;
}
