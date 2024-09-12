import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CacheKeyEnum } from 'src/enum/cache-key.enum';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { SocketKeyEnum } from './enums/socket-key.enum';
import { CreateMessageDto } from './dto/create-message.dto';
import { ISocketUser } from './interfaces/socket-user.interface';

@WebSocketGateway(80, {
    cors: {
        origin: '*',
    },
    transports: ['websocket'],
})
export class SocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private readonly cacheService: RedisCacheService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log('WebSocket Gateway initialized');
    }

    async handleConnection(client: Socket) {
        const { socketUser, userId, key } = await this.getUserFromCache(client.handshake.headers.token as string)


        if (socketUser) {
            socketUser.socketIds.push(client.id)
            await this.cacheService.setCache(key, socketUser)
        } else {
            const value = { userId, socketIds: [client.id] }
            await this.cacheService.setCache(key, value)
        }
        console.log(`Client connected: ${client.id},userId:${userId}`);
    }

    async handleDisconnect(client: Socket) {
        const { socketUser, userId, key } = await this.getUserFromCache(client.handshake.headers.token as string)
        console.log(socketUser)
        if (socketUser) {
            socketUser.socketIds = socketUser.socketIds.filter(data => data != client.id)
            await this.cacheService.setCache(key, socketUser)
        }
        console.log(`Client disconnected: ${client.id}, userId:${userId}`);
    }

    @SubscribeMessage(SocketKeyEnum.MESSAGE)
    async handleMessage(@MessageBody() body: CreateMessageDto) {
        const key = `${CacheKeyEnum.GET_SOCKET_USER}-${body.userTo}`
        const socketUser: ISocketUser = await this.cacheService.getCacheByKey(key)
        if (socketUser) {
            socketUser.socketIds.map(socketId => {
                this.server.to(socketId).emit(SocketKeyEnum.MESSAGE, body);
            })
        }
    }

    private async getUserFromCache(token: string) {

        const payload = await this.jwtService.verifyAsync(
            token,
            {
                secret: this.configService.get<string>('JWT_SECRET_KEY')
            }
        );

        const userId = payload.sub;

        const key = `${CacheKeyEnum.GET_SOCKET_USER}-${userId}`

        const socketUser: ISocketUser = await this.cacheService.getCacheByKey(key)

        return { socketUser, userId, key };
    }

}