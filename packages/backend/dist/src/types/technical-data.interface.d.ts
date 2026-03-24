export interface TechnicalData {
    dimensions?: {
        width_mm?: number;
        length_mm?: number;
        thickness_mm?: number;
        weight_kg?: number;
    };
    material?: string;
    performance_specs?: {
        slip_resistance?: string;
        water_absorption?: number;
        frost_resistance?: boolean;
        fire_rating?: string;
        wear_rating?: string;
    };
    installation?: {
        method?: string[];
        tools_required?: string[];
        difficulty_level?: 'easy' | 'medium' | 'hard';
    };
    certifications?: string[];
    warranty_years?: number;
}
