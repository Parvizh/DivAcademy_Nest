import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcryptjs"
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userEntity: Repository<UserEntity>,
        private jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async signUp(body: SignUpDto) {
        const isUserExist = await this.userEntity.findOne({ where: { email: body.email } })
        if (isUserExist) throw new HttpException("This user already exist with this email", HttpStatus.BAD_REQUEST);

        const result = await this.userService.create(body);

        return result
    }

    async login(body: LoginDto) {
        const user = await this.userEntity.findOne({
            where: { email: body.email },
            select: ['id', 'email', 'password', 'role']
        });
        if (!user) throw new HttpException("This credentials is invalid", HttpStatus.BAD_REQUEST)

        const isValidPass = await bcrypt.compare(body.password, user.password);

        if (!isValidPass) throw new HttpException("This credentials is invalid", HttpStatus.BAD_REQUEST)

        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
