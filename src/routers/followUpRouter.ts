import { Router } from "express";
import { globalErrorHandel } from "../middlewares/globalErrorHandel";
import { createFollowUp, getFollowUp, getFollowUps, updateFollowUp } from "../handlers/followUpHandler";
import * as followUpValidationIN from "../validations/followUpValidation";
import * as followUpValidationDB from "../validationsDB/followUpValidation";
const router = Router();

router.get("/", getFollowUps);

router.get("/:followUpId", getFollowUp);

router.post("/", followUpValidationIN.createFollowUp, followUpValidationDB.createFollowUp, createFollowUp);

router.put("/:followUpId", updateFollowUp);

router.use(globalErrorHandel);

export default router;
