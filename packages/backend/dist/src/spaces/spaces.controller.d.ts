import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
export declare class SpacesController {
    private readonly spacesService;
    constructor(spacesService: SpacesService);
    create(createSpaceDto: CreateSpaceDto): Promise<{
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
            space_id: string;
        })[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
    }>;
    update(id: string, updateSpaceDto: UpdateSpaceDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
    }>;
    updatePut(id: string, updateSpaceDto: UpdateSpaceDto): Promise<{
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
