import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";

import dashboardService from "./dashboard.service";

class DashboardController {
  async getSummary(req: Request, res: Response) {
    const summary = await dashboardService.getSummary();

    return new AppResponse({
      message: "Fetch dashboard summary successfully",
      statusCode: HttpStatusCode.OK,
      data: summary,
    }).sendResponse(res);
  }

  async getRevenueByMonth(req: Request, res: Response) {
    const year = req.query.year ? Number(req.query.year) : undefined;
    const revenue = await dashboardService.getRevenueByMonth(year);

    return new AppResponse({
      message: "Fetch dashboard revenue successfully",
      statusCode: HttpStatusCode.OK,
      data: revenue,
    }).sendResponse(res);
  }

  async getTopTours(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const topTours = await dashboardService.getTopTours(limit);

    return new AppResponse({
      message: "Fetch top tours successfully",
      statusCode: HttpStatusCode.OK,
      data: topTours,
    }).sendResponse(res);
  }
}

export default new DashboardController();
