import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  UserMessage,
  UserMessageCreationAttributes,
} from '../../database/models/user-message.model';
import {
  GetUserMessagesDto,
  PaginatedUserMessagesResponseDto,
} from './dto/user-message.dto';

@Injectable()
export class UserMessageRepository {
  constructor(
    @InjectModel(UserMessage)
    private userMessageModel: typeof UserMessage
  ) {}

  async create(data: UserMessageCreationAttributes): Promise<UserMessage> {
    return await this.userMessageModel.create(data);
  }

  async findById(id: number): Promise<UserMessage | null> {
    return await this.userMessageModel.findByPk(id);
  }

  async findAll(
    params: GetUserMessagesDto
  ): Promise<PaginatedUserMessagesResponseDto> {
    // Ensure parameters are properly converted to numbers
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 3;
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'DESC';

    const offset = (page - 1) * limit;

    console.log('Query params:', { page, limit, sortBy, sortOrder, offset });

    const { rows: data, count: totalItems } =
      await this.userMessageModel.findAndCountAll({
        offset: offset,
        limit: limit, // Now guaranteed to be a number
        order: [[sortBy, sortOrder]],
      });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async delete(id: number): Promise<boolean> {
    const deletedCount = await this.userMessageModel.destroy({
      where: { id },
    });
    return deletedCount > 0;
  }
}
