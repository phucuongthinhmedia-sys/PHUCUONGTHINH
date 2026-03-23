import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadFiltersDto } from './dto/lead-filters.dto';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(createLeadDto: CreateLeadDto): Promise<{
        id: string;
        email: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        status: string;
        phone: string | null;
        inquiry_type: string;
        project_details: string | null;
        preferred_date: Date | null;
    }>;
    findAll(filters: LeadFiltersDto): Promise<{
        leads: ({
            products: ({
                product: {
                    id: string;
                    name: string;
                    sku: string;
                };
            } & {
                product_id: string;
                lead_id: string;
            })[];
        } & {
            id: string;
            email: string | null;
            created_at: Date;
            updated_at: Date;
            name: string;
            status: string;
            phone: string | null;
            inquiry_type: string;
            project_details: string | null;
            preferred_date: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            total_pages: number;
        };
    }>;
    findByStatus(status: string): Promise<({
        products: ({
            product: {
                id: string;
                name: string;
                sku: string;
            };
        } & {
            product_id: string;
            lead_id: string;
        })[];
    } & {
        id: string;
        email: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        status: string;
        phone: string | null;
        inquiry_type: string;
        project_details: string | null;
        preferred_date: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        status: string;
        phone: string | null;
        inquiry_type: string;
        project_details: string | null;
        preferred_date: Date | null;
    }>;
    update(id: string, updateLeadDto: UpdateLeadDto): Promise<{
        id: string;
        email: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        status: string;
        phone: string | null;
        inquiry_type: string;
        project_details: string | null;
        preferred_date: Date | null;
    }>;
    updatePut(id: string, updateLeadDto: UpdateLeadDto): Promise<{
        id: string;
        email: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        status: string;
        phone: string | null;
        inquiry_type: string;
        project_details: string | null;
        preferred_date: Date | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        email: string | null;
        created_at: Date;
        updated_at: Date;
        name: string;
        status: string;
        phone: string | null;
        inquiry_type: string;
        project_details: string | null;
        preferred_date: Date | null;
    }>;
    remove(id: string): Promise<void>;
}
