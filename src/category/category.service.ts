import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/query.dto';
import { CommonQueryDto } from 'src/auth/common/dto/query.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryEntity: Repository<CategoryEntity>
    ) { }

    private async _checkChildren(ids: number[]) {
        if (ids?.length) {
            let error = false;
            for (let index = 0; index < ids.length; index++) {
                const doesCategoryExist = await this.categoryEntity.findOne({ where: { id: ids[index] } })
                if (!doesCategoryExist) {
                    error = true
                    break
                }

            }
            if (error) throw new NotFoundException("This category has not been found")


        }
    }

    async create(body: CreateCategoryDto) {
        try {
            await this._checkChildren(body.parentIds)
            const category = this.categoryEntity.create(body);
            const result = await this.categoryEntity.save(category);
            return result
        } catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async update(body: UpdateCategoryDto, id: number) {
        try {
            const categoryExist = await this.categoryEntity.findOne({ where: { id: id } })
            if (!categoryExist) throw new NotFoundException("This category has not been found")

            await this._checkChildren(body.parentsIds)
            const category = await this.categoryEntity.update(body, categoryExist);
            return category
        } catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOne(id: number): Promise<CategoryEntity> {
        const category = await this.categoryEntity.findOne({ where: { id } })
        return category
    }

    async findAll(query: CategoryQueryDto) {
        const { limit, page, sort, orderBY, searchText, parentId }: CategoryQueryDto = query;
        let categories: CategoryEntity[];
        const skip = (Number(page) - 1) * Number(limit)

        let queryBuilder = this.categoryEntity
            .createQueryBuilder('category')
            .where('category.title LIKE :title', { title: `%${searchText}%` })
            .take(limit)
            .skip(skip)
            .orderBy('category.rate', sort)


        if (parentId) {
            const result = queryBuilder.leftJoinAndSelect('category.children', 'subs')
                .andWhere('subs.parent_id =: parentId', { parentId })
                .select(['category.id', 'subs.id', 'subs.title', 'subs.slug'])
                .getMany()

            categories = [...result[0].subs]
        }
        else {
            categories = await queryBuilder
                .andWhere('category.parentId IS NULL')
                .getMany()
        }

        return { categories }
    }


    async findAllAdmin(query: CommonQueryDto) {
        const { limit, page, sort, orderBY, searchText }: CommonQueryDto = query;

        const skip = (Number(page) - 1) * Number(limit)

        const [result, count] = await this.categoryEntity.findAndCount({
            where: {
                title: ILike(`%${searchText}%`)
            },
            order: orderBY ? { [orderBY as string]: sort } : null,
            take: limit,
            skip,
        })

        return {
            result,
            metadata: {
                limit,
                page,
                count,
                totalPages: count < Number(limit) ? count : Math.ceil(count / Number(limit))
            }
        }

    }

}
