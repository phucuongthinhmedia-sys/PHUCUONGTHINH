import { StylesService } from './styles.service';
import { CreateStyleDto } from './dto/create-style.dto';
import { UpdateStyleDto } from './dto/update-style.dto';
export declare class StylesController {
    private readonly stylesService;
    constructor(stylesService: StylesService);
    create(createStyleDto: CreateStyleDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
    }>;
    findAll(): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
    }[]>;
    findOne(id: string): Promise<{
        products: ({
            product: {
                id: string;
                name: string;
                sku: string;
            };
        } & {
            product_id: string;
            style_id: string;
        })[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
    }>;
    update(id: string, updateStyleDto: UpdateStyleDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
    }>;
    updatePut(id: string, updateStyleDto: UpdateStyleDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
    }>;
}
