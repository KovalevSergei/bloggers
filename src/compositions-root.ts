import { BloggersRepository } from "./repositories/bloggers-repository";
import { BloggersService } from "./domain/bloggers-servis";
import { BloggersController } from "./route/bloggers-routes";
import { PostsRepository } from "./repositories/posts-repository";
import { PostsService } from "./domain/posts-servis";
import { CommentsService } from "./domain/comments-servis";
import { CommentsRepository } from "./repositories/comments-repository";
import { CommentsController } from "./route/comments-routes";
import { AuthService } from "./domain/auth-servis";
import { UsersRepository } from "./repositories/users-repository";
import { AuthController } from "./route/auth-router";
import { UsersService } from "./domain/Users-servis";
import { UserController } from "./route/users-routes";
import { container } from "./ioc-container";
import { PostController } from "./route/posts-router";

//const bloggerRepositiry = new BloggersRepository();
//const bloggersServis = new BloggersService(bloggerRepositiry);
//export const bloggersControllerInstans = new BloggersController(bloggersServis);

/* const commentsRepository = new CommentsRepository();
const commentsService = new CommentsService(commentsRepository);
export const commentInstance = new CommentsController(commentsService);

const postsRepository = new PostsRepository();
const postsService = new PostsService(postsRepository, bloggerRepositiry);
export const postControllerInstans = new PostController(
  postsService,
  commentsService
);

console.log(postControllerInstans);

const usersRepository = new UsersRepository();
const usersServis = new UserService(usersRepository);
export const userInstance = new UserController(usersServis);

const authService = new AuthService(usersRepository, usersServis);
export const authControllerInstans = new AuthController(
  usersServis,
  authService
);
 */
