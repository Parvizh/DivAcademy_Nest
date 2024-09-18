import { Body, Controller, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChatSessionService } from '../services/chat-session.service';
import { ChatSessionEntity } from '../chat-session.entity';
import { CreateSessionDto } from '../dto/create-session.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { MessageEntity } from '../message.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageService } from '../services/message.service';

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
        return this.messageService.create(req.sub, sessionId, body);
    }
}
