import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

import { toCategoryResponseDto } from "./category.mapper";
import categoryService from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

class CategoryController {
  async getAll(req: Request, res: Response) {
    const activeOnly = req.baseUrl.includes("/api/v1/categories");
    const includeInactive = req.query.includeInactive === "true";
    const categories = await categoryService.getAll(activeOnly, includeInactive);

    return new AppResponse({
      message: SuccessMessages.CATEGORY.CATEGORY_GET,
      statusCode: HttpStatusCode.OK,
      data: categories.map(toCategoryResponseDto),
    }).sendResponse(res);
  }

  async create(req: Request, res: Response) {
    const category = await categoryService.create(req.body as CreateCategoryDto);

    return new AppResponse({
      message: SuccessMessages.CATEGORY.CATEGORY_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: toCategoryResponseDto(category),
    }).sendResponse(res);
  }

  async update(req: Request, res: Response) {
    const category = await categoryService.update(
      Number(req.params.id),
      req.body as UpdateCategoryDto
    );

    return new AppResponse({
      message: SuccessMessages.CATEGORY.CATEGORY_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: toCategoryResponseDto(category),
    }).sendResponse(res);
  }

  async delete(req: Request, res: Response) {
    await categoryService.delete(Number(req.params.id));

    return new AppResponse({
      message: SuccessMessages.CATEGORY.CATEGORY_DELETED,
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }
}

export default new CategoryController();
