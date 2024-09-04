import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CategoryEntity, CategoryWithHooks } from './category.entity';
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
            let categories: CategoryEntity[] = [];
            for (let index = 0; index < ids.length; index++) {
                const categoryExist = await this.categoryEntity.findOne({ where: { id: ids[index] }, select: ['id'] })
                if (!categoryExist) {
                    error = true
                    break
                }
                categories.push(categoryExist)
            }
            if (error) throw new NotFoundException("This category has not been found")

            return categories
        }
    }

    async create(body: CreateCategoryDto) {
        try {
            body.parents = await this._checkChildren(body.parentIds)
            const category = this.categoryEntity.create(body);
            const result = await this.categoryEntity.save(category);
            return result
        } catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async update(body: UpdateCategoryDto, id: number) {
        try {
            const categoryExist = await this.categoryEntity.findOne({ where: { id }, relations: ['parents'] })
            if (!categoryExist) throw new NotFoundException("This category has not been found")
                console.log(body.parentsIds)
                body.parents = await this._checkChildren(body.parentsIds)
            
            const category: CategoryWithHooks = Object.assign(
                categoryExist,
                body
            );

            const result = await this.categoryEntity.save(category)
            return result
        } catch (error) {
            return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOne(id: number): Promise<CategoryEntity> {
        const category = await this.categoryEntity.findOne({ where: { id } })
        return category
    }

    async findAll(query: CategoryQueryDto) {
        const { limit, page, sort, searchText, parentId }: CategoryQueryDto = query;
        const skip = (Number(page) - 1) * Number(limit)

        let queryBuilder = this.categoryEntity
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.parents', 'parent')
            .select(['category.id', 'category.title', 'category.slug', 'category.rate'])
            .take(limit)
            .skip(skip)
            .orderBy('category.rate', sort)

        if (searchText) {
            queryBuilder = queryBuilder.where('LOWER(category.title) LIKE :title', { title: `%${searchText.toLowerCase()}%` })
        }

        if (parentId) {
            queryBuilder = queryBuilder
                .andWhere('parent.id = :parentId', { parentId })
        }
        else {
            queryBuilder = queryBuilder
                .andWhere('parent.id IS NULL')
        }

        const [categories, count] = await queryBuilder.getManyAndCount()
        return {
            categories,
            metadata: {
                limit,
                page,
                count,
                totalPages: Math.ceil(count / Number(limit))
            }
        }
    }


    async findAllAdmin(query: CommonQueryDto) {
        const { limit, page, sort, orderBy, searchText }: CommonQueryDto = query;

        const skip = (Number(page) - 1) * Number(limit)

        const [result, count] = await this.categoryEntity.findAndCount({
            where: {
                title: ILike(`%${searchText}%`)
            },
            order: orderBy ? { [orderBy as string]: sort } : null,
            take: limit,
            skip,
        })

        return {
            result,
            metadata: {
                limit,
                page,
                count,
                totalPages: Math.ceil(count / Number(limit))
            }
        }

    }

    async delete(id: number) {
        try {
            const category = await this.categoryEntity.findOne({ where: { id } })

            if (!category) throw new NotFoundException();

            await this.categoryEntity.softDelete(id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
