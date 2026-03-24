export declare class ProtectedController {
    getAuthenticatedData(user: any): {
        message: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    };
    getAdminOnlyData(user: any): {
        message: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
        adminData: {
            systemStats: string;
            userCount: number;
        };
    };
    getManagementData(user: any): {
        message: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
        managementData: {
            reports: string;
            analytics: string;
        };
    };
}
