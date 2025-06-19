import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateUserMessageDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  message: string;
}

export class GetUserMessagesDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 3;

  @IsOptional()
  @IsIn(['createdAt', 'name', 'email'])
  sortBy?: 'createdAt' | 'name' | 'email' = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class UserMessageResponseDto {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedUserMessagesResponseDto {
  data: UserMessageResponseDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
