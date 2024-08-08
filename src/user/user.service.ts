import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UserInput } from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums';
import { UpdateUserInput } from './dto/update.user.dto';
import { ResetPasswordInput } from './dto/reset.password.dto';
import { UpdateStatusInput } from './dto/update.status.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userInput: UserInput): Promise<User> {
    const existingUser = await this.findByEmail(userInput.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(userInput.password, 10);
    const role = userInput.role.toLowerCase();
    console.log('-hre----------', role);
    // Check if the uppercase role exists in the Role enum
    if (!(role.toUpperCase() in Role)) {
      throw new BadRequestException('Invalid role');
    }
    const newUser = new this.userModel({ ...userInput, password: hashedPassword, role });
    return newUser.save();
  }

  async update(id: string, userInput: UpdateUserInput): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, userInput, { new: true }).exec();
  }

  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async resetPassword(id: string, input: ResetPasswordInput): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, { password: input.newPassword }, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async updateStatus(id: string, input: UpdateStatusInput): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, { status: input.status }, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async countUsersByRole(role: Role): Promise<number> {
    const data = await this.userModel.find({ role }).countDocuments();
    return data;
  }

  async getUserCounts() {
    const totalUsers = await this.userModel.countDocuments();
    const staffCount = await this.countUsersByRole(Role.STAFF);
    const directorCount = await this.countUsersByRole(Role.DIRECTOR);
    const adminCount = await this.countUsersByRole(Role.ADMIN);

    return {
      totalUsers,
      staffCount,
      directorCount,
      adminCount,
    };
  }
}
