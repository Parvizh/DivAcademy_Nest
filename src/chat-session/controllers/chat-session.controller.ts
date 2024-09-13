import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChatSessionService } from '../services/chat-session.service';
import { ChatSessionEntity } from '../chat-session.entity';
import { CreateSessionDto } from '../dto/create-session.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('chat-session')
@ApiTags('Chat Session')
export class ChatSessionController {
    constructor(private sessionService: ChatSessionService) { }

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
}
