import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryEntity } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryQueryDto } from './dto/query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
    constructor(private service: CategoryService) { }


    @Post('')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Create Category',
        type: CategoryEntity,
        isArray: false,
    })
    create(@Body() body: CreateCategoryDto) {
        return this.service.create(body);
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Find all Categories',
        type: CategoryEntity,
        isArray: true,
    })
    findAll(@Query() query: CategoryQueryDto) {
        return this.service.findAll(query);
    }


    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Soft Delete category',
    })
    delete(@Param('id') id: number) {
        this.service.delete(id);
        return { message: 'Category deleted succesfully' }
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Soft Delete category',
        type: CategoryEntity,
        isArray: false
    })
    update(
        @Param('id') id: number,
        @Body() body: UpdateCategoryDto) {
        return this.service.update(body, id);
    }
}
