import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { UserMessageService } from './user-message.service';
import {
  CreateUserMessageDto,
  GetUserMessagesDto,
} from './dto/user-message.dto';

@Controller('user-messages')
export class UserMessageController {
  constructor(private readonly userMessageService: UserMessageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) createUserMessageDto: CreateUserMessageDto) {
    return this.userMessageService.create(createUserMessageDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() query: GetUserMessagesDto) {
    return this.userMessageService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userMessageService.findById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userMessageService.delete(id);
  }
}
