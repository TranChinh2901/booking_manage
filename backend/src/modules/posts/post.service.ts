import { Brackets, Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { slugify } from "@/helpers/slugify";

import { CreatePostDto, PostQueryDto, UpdatePostDto } from "./dto/post.dto";
import { Post, PostStatus } from "./entities/post.entity";

export class PostService {
  private postRepository: Repository<Post>;

  constructor() {
    this.postRepository = AppDataSource.getRepository(Post);
  }

  async getAll(query: PostQueryDto = {}, publishedOnly = false) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 10;

    const queryBuilder = this.postRepository
      .createQueryBuilder("post")
      .orderBy("post.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    if (publishedOnly) {
      queryBuilder.andWhere("post.status = :status", {
        status: PostStatus.PUBLISHED,
      });
    } else if (query.status) {
      queryBuilder.andWhere("post.status = :status", { status: query.status });
    }

    if (query.keyword) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where("post.title LIKE :keyword", {
            keyword: `%${query.keyword}%`,
          }).orWhere("post.excerpt LIKE :keyword", {
            keyword: `%${query.keyword}%`,
          });
        })
      );
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new AppError(
        ErrorMessages.POST_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.POST_NOT_FOUND
      );
    }

    return post;
  }

  async getBySlug(slug: string, publishedOnly = true): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: publishedOnly ? { slug, status: PostStatus.PUBLISHED } : { slug },
    });

    if (!post) {
      throw new AppError(
        ErrorMessages.POST_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.POST_NOT_FOUND
      );
    }

    return post;
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const slug = dto.slug || slugify(dto.title);
    await this.ensureSlugAvailable(slug);

    const post = this.postRepository.create({
      ...dto,
      slug,
    });

    return await this.postRepository.save(post);
  }

  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.getById(id);
    const slug = dto.slug || (dto.title ? slugify(dto.title) : undefined);

    if (slug && slug !== post.slug) {
      await this.ensureSlugAvailable(slug);
      post.slug = slug;
    }

    this.postRepository.merge(post, {
      ...dto,
      slug: post.slug,
    });

    return await this.postRepository.save(post);
  }

  async delete(id: number): Promise<void> {
    const post = await this.getById(id);
    post.status = PostStatus.HIDDEN;
    await this.postRepository.save(post);
  }

  private async ensureSlugAvailable(slug: string): Promise<void> {
    const exists = await this.postRepository.count({ where: { slug } });
    if (exists > 0) {
      throw new AppError(
        ErrorMessages.SLUG_EXISTS,
        HttpStatusCode.CONFLICT,
        ErrorCode.SLUG_ALREADY_EXISTS
      );
    }
  }
}

export default new PostService();
