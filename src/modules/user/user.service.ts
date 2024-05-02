import { HttpException, Injectable } from '@nestjs/common';
import { ResponseCode } from '../../exceptions/index';
import type { Optional } from '../../types';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { responseSuccessMessage } from 'src/constants/responce';
import { EntityManager } from 'typeorm';
import { RevisedPasswordDto } from './dto/account-revised-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}
  // Find By Email
  async findByEmail(
    options: Partial<{ users_email: string }>,
  ): Promise<Optional<User>> {
    const users_email = options.users_email;
    const user: any = await this.userRepository
      .findOne({
        where: { users_email },
      })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return user;
  }
  /**
   * create single user
   *
   *
   */
  async createUser(userRegisterDto: Partial<User>): Promise<any> {
    try {
      // Check User Email duplication!
      const hashedPassword = await bcrypt.hash(
        userRegisterDto.users_password,
        10,
      );
      userRegisterDto.users_password = hashedPassword;
      userRegisterDto.registerDate = new Date();
      return await this.entityManager.save(User, userRegisterDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'This email address already exists.',
          ResponseCode.BAD_REQUEST,
        );
      } else {
        const create = await this.userRepository.create(userRegisterDto);
        await this.userRepository.save(create).catch((err) => {
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
        return create;
      }
    }
  }
  // Fond One User
  async findOne(findData: any): Promise<User | null> {
    const user: any = await this.userRepository
      .findOne({
        where: findData,
      })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return user;
  }
  // Reset Password
  async resetPassword(userDto: User, userId: any): Promise<any> {
    try {
      const user: any = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (user === null) {
        throw new HttpException(
          'User not Exist with this email!',
          ResponseCode.BAD_REQUEST,
        );
      } else {
        const id = userId;
        const hashedPassword = await bcrypt.hash(userDto.users_password, 10);
        await this.userRepository.update(id, {
          users_password: hashedPassword,
        });
        return responseSuccessMessage(
          'Your password updated successfully!',
          user,
          200,
        );
      }
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }
  // Update User
  async updateUser(id: any, userDto: User): Promise<any> {
    try {
      if (userDto.users_password) {
        const hashedPassword = await bcrypt.hash(userDto.users_password, 10);
        userDto.users_password = hashedPassword;
      }
      await this.userRepository.update(id, userDto);
      const updatedUser: any = await this.userRepository.findOne({
        where: { id: id },
      });
      delete updatedUser.users_password;
      return responseSuccessMessage(
        'Account updated successfully!',
        updatedUser,
        200,
      );
    } catch (err) {
      console.log(err.message);
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }
  // Account Revised Password
  async rewisedPassword(
    id: any,
    passwordDto: RevisedPasswordDto,
  ): Promise<any> {
    try {
      const user: any = await this.userRepository.findOne({
        where: { id: id },
      });
      if (
        await bcrypt.compare(passwordDto.current_password, user.users_password)
      ) {
        const hashedPassword = await bcrypt.hash(passwordDto.new_password, 10);
        await this.userRepository.update(id, {
          users_password: hashedPassword,
        });
        delete user.users_password;
        return responseSuccessMessage(
          'Account Password updated successfully!',
          user,
          200,
        );
      } else {
        throw new HttpException(
          'Incorrect current Password!',
          ResponseCode.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }

  // Get Users List Register Date
  async getList(): Promise<any> {
    try {
      const users: any[] = await this.userRepository.find({
        order: {
          registerDate: 'DESC',
        },
        select: [
          'id',
          'users_email',
          'firstName',
          'lastName',
          'companyName',
          'phone',
          'address',
          'city',
          'zipCode',
          'role',
          'address2',
          'faxNumber',
          'country',
          'customerType',
          'customerDiscount',
          'rewardPoints',
          'hearFrom',
          'referredBy',
          'newsletter',
          'registerDate',
        ],
      });
      return responseSuccessMessage('Users List!', users, 200);
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }

  // Get Sorted Users List registerDate

  async getSortedList(
    sortBy: string,
    sortOrder: any,
    keyword: string,
  ): Promise<any> {
    try {
      let orderOptions: { [key: string]: 'ASC' | 'DESC' } = {};

      // Define the default sorting order for each field
      const defaultSortOrder: { [key: string]: 'ASC' | 'DESC' } = {
        firstName: 'ASC',
        lastName: 'ASC',
        users_email: 'ASC',
        companyName: 'ASC',
        phone: 'ASC',
        registerDate: 'DESC', // Default to sorting by registration date in descending order
      };

      // Toggle sorting order if the same field is clicked again
      if (sortBy && sortOrder && defaultSortOrder[sortBy]) {
        orderOptions[sortBy] = sortOrder === 'ASC' ? 'DESC' : 'ASC';
      } else {
        // Use the default sorting order for the selected field
        orderOptions = { [sortBy]: defaultSortOrder[sortBy] };
      }

      // Define search criteria based on the keyword
      const searchCriteria = [
        { firstName: Like(`%${keyword}%`) },
        { lastName: Like(`%${keyword}%`) },
        { users_email: Like(`%${keyword}%`) },
      ];

      // Fetch sorted users from the database based on the generated order options and search criteria
      const users: any[] = await this.userRepository.find({
        where: searchCriteria,
        order: orderOptions,
      });

      // Remove sensitive information before sending the response
      users.forEach((user) => delete user.users_password);

      return responseSuccessMessage('Sorted Users List!', users, 200);
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }

  async getSearchList(keyword: string): Promise<any> {
    try {
      // Fetch sorted and filtered users from the database based on the keyword and sorting order
      const users: any[] = await this.userRepository.find({
        where: [
          { firstName: Like(`%${keyword}%`) },
          { lastName: Like(`%${keyword}%`) },
          { users_email: Like(`%${keyword}%`) },
          { phone: Like(`%${keyword}%`) },
          { companyName: Like(`%${keyword}%`) },
        ],
        order: {
          registerDate: 'ASC',
        },
      });

      // Remove sensitive information before sending the response
      users.forEach((user) => delete user.users_password);

      return responseSuccessMessage('Sorted Users List!', users, 200);
    } catch (err) {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    }
  }
}
