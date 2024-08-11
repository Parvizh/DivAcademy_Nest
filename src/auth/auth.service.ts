import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcryptjs"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userEntity: Repository<UserEntity>,
        private jwtService: JwtService
    ) { }

    async signUp(body: SignUpDto) {
        const isUserExist = await this.userEntity.findOne({ where: { email: body.email } })
        if (isUserExist) throw new HttpException("This user already exist with this email", HttpStatus.BAD_REQUEST);

        const user = this.userEntity.create(body)
        const result = await this.userEntity.save(user);

        return result
    }

    async login(body: LoginDto) {
        const user = await this.userEntity.findOne({
            where: { email: body.email },
            select: ['id', 'email', 'password']
        });
        if (!user) throw new HttpException("This creadentials is invalid", HttpStatus.BAD_REQUEST)

        const isValidPass = await bcrypt.compare(body.password, user.password);

        if (!isValidPass) throw new HttpException("This creadentials is invalid", HttpStatus.BAD_REQUEST)

        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
