
import { Body, Controller, Post, HttpCode, HttpStatus, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { UserEntity } from 'src/user/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from './decorators/role.decorator';
import { RolesEnum } from 'src/enum/role.enum';
import { RolesGuard } from './guard/role.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('signup')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Sign up end-point',
        type: UserEntity,
        isArray: false,
    })
    signUp(@Body() body: SignUpDto) {
        return this.authService.signUp(body);
    }

    @Post('login')
    @ApiOkResponse({
        description: 'Sign up end-point',
        isArray: false,
    })
    @HttpCode(HttpStatus.OK)
    login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @Get('account')
    @Roles(RolesEnum.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        description: 'Return current user',
        isArray: false,
    })
    @HttpCode(HttpStatus.OK)
    getUser(@Request() req) {
        return req.user
    }

}