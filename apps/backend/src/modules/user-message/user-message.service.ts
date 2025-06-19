import { Injectable, NotFoundException } from '@nestjs/common';
import { UserMessageRepository } from './user-message.repository';
import {
  CreateUserMessageDto,
  GetUserMessagesDto,
  PaginatedUserMessagesResponseDto,
  UserMessageResponseDto,
} from './dto/user-message.dto';

@Injectable()
export class UserMessageService {
  constructor(private readonly userMessageRepository: UserMessageRepository) {}

  async create(
    createUserMessageDto: CreateUserMessageDto
  ): Promise<UserMessageResponseDto> {
    const userMessage = await this.userMessageRepository.create(
      createUserMessageDto
    );
    return this.toResponseDto(userMessage);
  }

  async findAll(
    params: GetUserMessagesDto
  ): Promise<PaginatedUserMessagesResponseDto> {
    const result = await this.userMessageRepository.findAll(params);

    return {
      ...result,
      data: result.data.map((message) => this.toResponseDto(message)),
    };
  }

  async findById(id: number): Promise<UserMessageResponseDto> {
    const userMessage = await this.userMessageRepository.findById(id);
    if (!userMessage) {
      throw new NotFoundException(`User message with ID ${id} not found`);
    }
    return this.toResponseDto(userMessage);
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.userMessageRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User message with ID ${id} not found`);
    }
  }

  private toResponseDto(userMessage: any): UserMessageResponseDto {
    return {
      id: userMessage.id,
      name: userMessage.name,
      email: userMessage.email,
      message: userMessage.message,
      createdAt: userMessage.createdAt,
      updatedAt: userMessage.updatedAt,
    };
  }
}
