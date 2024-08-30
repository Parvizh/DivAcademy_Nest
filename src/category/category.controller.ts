import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryEntity } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

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
}
