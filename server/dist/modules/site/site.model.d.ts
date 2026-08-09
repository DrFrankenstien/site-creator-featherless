import { Schema } from "mongoose";
export declare const siteModel: import("mongoose").Model<{
    name: string;
    isDeployed: boolean;
    terminals: string[];
    phone?: string | null;
    port?: number | null;
}, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    name: string;
    isDeployed: boolean;
    terminals: string[];
    phone?: string | null;
    port?: number | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    name: string;
    isDeployed: boolean;
    terminals: string[];
    phone?: string | null;
    port?: number | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    name: string;
    isDeployed: boolean;
    terminals: string[];
    phone?: string | null;
    port?: number | null;
}, import("mongoose").Document<unknown, {}, {
    name: string;
    isDeployed: boolean;
    terminals: string[];
    phone?: string | null;
    port?: number | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    name: string;
    isDeployed: boolean;
    terminals: string[];
    phone?: string | null;
    port?: number | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    isDeployed: boolean;
    terminals: string[];
    phone?: string | null;
    port?: number | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    isDeployed: boolean;
    terminals: string[];
    phone?: string | null;
    port?: number | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=site.model.d.ts.map