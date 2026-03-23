export declare class UploadMediaDto {
    media_type: string;
    is_cover?: boolean;
}
export declare class GetPresignedUrlDto {
    filename: string;
    media_type: string;
    content_type: string;
}
