import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        parent_id: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        parent_id: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        parent_id: string | null;
    }>;
    findBySlug(slug: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        parent_id: string | null;
    }>;
    findHierarchy(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        parent_id: string | null;
    }[]>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        parent_id: string | null;
    }>;
    updatePut(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        slug: string;
        parent_id: string | null;
    }>;
    remove(id: string): Promise<void>;
}
