import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadFiltersDto } from './dto/lead-filters.dto';
import { Lead } from '@prisma/client';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createLeadDto: CreateLeadDto): Promise<Lead>;
    findAll(filters?: LeadFiltersDto): Promise<{
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
    findOne(id: string): Promise<Lead>;
    update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead>;
    remove(id: string): Promise<void>;
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
    updateStatus(id: string, status: string): Promise<Lead>;
}
