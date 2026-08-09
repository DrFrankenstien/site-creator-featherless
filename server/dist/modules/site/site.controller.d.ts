import type { Request, Response } from "express";
export declare const createSite: (req: Request<{}, {}, {
    name: string;
    phone: string;
}>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllSites: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSiteById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const startSiteServer: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const editSite: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deploy: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getRunningSites: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=site.controller.d.ts.map