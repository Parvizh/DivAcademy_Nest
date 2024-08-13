import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userEntity: Repository<UserEntity>
    ) { }

    async create(body: Partial<UserEntity>) {
        const user = this.userEntity.create(body);
        const result = await this.userEntity.save(user);

        return result
    }
}
