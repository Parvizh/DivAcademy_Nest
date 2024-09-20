import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChatSessionService } from '../services/chat-session.service';
import { ChatSessionEntity } from '../chat-session.entity';
import { CreateSessionDto } from '../dto/create-session.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { MessageEntity } from '../message.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageService } from '../services/message.service';
import { CommonQueryDto } from 'src/auth/common/dto/query.dto';
import { MessageUpdateSeenDto } from '../dto/message-seen.dto';

@Controller('chat-session')
@ApiTags('Chat Session')
export class ChatSessionController {
    constructor(
        private sessionService: ChatSessionService,
        private messageService: MessageService
    ) { }

    @Post('')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Create Chat Session',
        type: ChatSessionEntity,
        isArray: false,
    })
    create(@Body() body: CreateSessionDto,
        @Request() req) {
        return this.sessionService.create(req.user.sub, body);
    }

    @Post(':id/messages')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Create Message',
        type: MessageEntity,
        isArray: false,
    })
    createMessage(@Body() body: CreateMessageDto,
        @Param("id") sessionId: number,
        @Request() req) {
        return this.messageService.create(req.user.sub, sessionId, body);
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    @ApiOkResponse({
        description: 'Get user chat sessions',
        type: ChatSessionEntity,
        isArray: true,
    })
    async findOneSocial(
        @Query() queryDto:CommonQueryDto,
        @Req() req
    ) {
        return this.sessionService.findAll(req.user?.sub, queryDto);
    }

    @Put(':id/has-seen')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Update message seen',
    })
    messageSeen(@Body() body: MessageUpdateSeenDto,
        @Param("id") sessionId: number,
        @Request() req) {
        return this.messageService.messageSeen(req.user.sub, sessionId);
    }

}
