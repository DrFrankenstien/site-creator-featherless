import { Router } from "express";
import { createSite, getAllSites, editSite, deploy, getSiteById, getRunningSites, startSiteServer } from "./site.controller.js";
const siteRouter = Router();
siteRouter.post("/create", createSite);
siteRouter.get("/", getAllSites);
siteRouter.get("/running", getRunningSites);
siteRouter.get("/:id", getSiteById);
siteRouter.post("/start", startSiteServer);
siteRouter.post("/edit", editSite);
siteRouter.post("/deploy", deploy);
export default siteRouter;
//# sourceMappingURL=site.route.js.map