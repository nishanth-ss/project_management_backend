import type { Response, Request } from "express";
import { companyRegistrationSchema } from "../validators/company.validator.js";
import { createCompany } from "../services/company.service.js";


export const createCompanyController = async (req: Request, res: Response) => {
    try {
        const result = companyRegistrationSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        const company = await createCompany(req.body);
        return res.status(201).json({
            message: "Company registered successfully",
            data: company
        });
    } catch (error) {
        console.error("Failed to delete workspace:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : String(error),
        });
    }
}