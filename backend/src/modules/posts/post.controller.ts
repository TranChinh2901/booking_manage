import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

import { CreatePostDto, PostQueryDto, UpdatePostDto } from "./dto/post.dto";
import { toPostResponseDto } from "./post.mapper";
import postService from "./post.service";

class PostController {
  async getAll(req: Request, res: Response) {
    const publishedOnly = req.baseUrl.includes("/api/v1/posts");
    const result = await postService.getAll(
      {
        keyword: req.query.keyword as string | undefined,
        status: req.query.status as PostQueryDto["status"],
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      },
      publishedOnly
    );

    return new AppResponse({
      message: SuccessMessages.POST.POST_GET,
      statusCode: HttpStatusCode.OK,
      data: {
        items: result.items.map(toPostResponseDto),
        meta: result.meta,
      },
    }).sendResponse(res);
  }

  async getBySlug(req: Request, res: Response) {
    const publishedOnly = req.baseUrl.includes("/api/v1/posts");
    const post = await postService.getBySlug(req.params.slug, publishedOnly);

    return new AppResponse({
      message: SuccessMessages.POST.POST_GET,
      statusCode: HttpStatusCode.OK,
      data: toPostResponseDto(post),
    }).sendResponse(res);
  }

  async getById(req: Request, res: Response) {
    const post = await postService.getById(Number(req.params.id));

    return new AppResponse({
      message: SuccessMessages.POST.POST_GET,
      statusCode: HttpStatusCode.OK,
      data: toPostResponseDto(post),
    }).sendResponse(res);
  }

  async create(req: Request, res: Response) {
    const post = await postService.create(req.body as CreatePostDto);

    return new AppResponse({
      message: SuccessMessages.POST.POST_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: toPostResponseDto(post),
    }).sendResponse(res);
  }

  async update(req: Request, res: Response) {
    const post = await postService.update(
      Number(req.params.id),
      req.body as UpdatePostDto
    );

    return new AppResponse({
      message: SuccessMessages.POST.POST_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: toPostResponseDto(post),
    }).sendResponse(res);
  }

  async delete(req: Request, res: Response) {
    await postService.delete(Number(req.params.id));

    return new AppResponse({
      message: SuccessMessages.POST.POST_DELETED,
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }
}

export default new PostController();
