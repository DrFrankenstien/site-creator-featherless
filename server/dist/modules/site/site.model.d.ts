import { Schema } from "mongoose";
export declare const siteModel: import("mongoose").Model<{
    name: string;
    terminals: string[];
    phone?: string | null;
    isDeployed?: boolean | null;
}, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    name: string;
    terminals: string[];
    phone?: string | null;
    isDeployed?: boolean | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    name: string;
    terminals: string[];
    phone?: string | null;
    isDeployed?: boolean | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    name: string;
    terminals: string[];
    phone?: string | null;
    isDeployed?: boolean | null;
}, import("mongoose").Document<unknown, {}, {
    name: string;
    terminals: string[];
    phone?: string | null;
    isDeployed?: boolean | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    name: string;
    terminals: string[];
    phone?: string | null;
    isDeployed?: boolean | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    terminals: string[];
    phone?: string | null;
    isDeployed?: boolean | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    terminals: string[];
    phone?: string | null;
    isDeployed?: boolean | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=site.model.d.ts.map