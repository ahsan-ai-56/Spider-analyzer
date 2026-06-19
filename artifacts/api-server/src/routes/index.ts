import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import analysisRouter from "./analysis.js";
import historyRouter from "./history.js";
const router: IRouter = Router();
router.use(healthRouter);
router.use(analysisRouter);
router.use(historyRouter);
export default router;
