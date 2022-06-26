"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentValidation = exports.shortDescriptionValidation = exports.titleValidation = exports.postsRouter = void 0;
const express_1 = require("express");
exports.postsRouter = (0, express_1.Router)();
const validation_1 = require("../middleware/validation");
const express_validator_1 = require("express-validator");
const basicAuth_1 = __importDefault(require("../middleware/basicAuth"));
const posts_servis_1 = require("../domain/posts-servis");
const titleValidation = (0, express_validator_1.body)("title")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 30 })
    .isString();
exports.titleValidation = titleValidation;
const shortDescriptionValidation = (0, express_validator_1.body)("shortDescription")
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 100 });
exports.shortDescriptionValidation = shortDescriptionValidation;
const contentValidation = (0, express_validator_1.body)("content")
    .exists()
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 1000 });
exports.contentValidation = contentValidation;
exports.postsRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = Number(req.query.PageNumber) || 1;
    const pageSize = Number(req.query.PageSize) || 10;
    const getPosts = yield posts_servis_1.postsServis.getPosts(pageNumber, pageSize);
    res.status(200).send(getPosts);
}));
exports.postsRouter.get("/:postsid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postsid = yield posts_servis_1.postsServis.getpostsId(+req.params.postsid);
    if (!postsid) {
        res.sendStatus(404);
    }
    else {
        res.status(200).json(postsid);
    }
}));
exports.postsRouter.put("/:id", basicAuth_1.default, titleValidation, shortDescriptionValidation, contentValidation, validation_1.inputValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postsnew = yield posts_servis_1.postsServis.updatePostsId(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId);
    if (postsnew === false) {
        res.sendStatus(404);
    }
    else if (postsnew === null) {
        res
            .status(400)
            .send({ errorsMessages: [{ message: "bloger", field: "bloggerId" }] });
    }
    else {
        res.status(204).send(postsnew);
    }
    /*     let title= req.body.title;
    let title2= req.body.shortDescription;
    let title3= req.body.content;
    let title4= req.body.bloggerId;
    const errs2=[]
  
    }
  
    }
    if (!title3 || typeof title3 !=='string' || !title3.trim() || title3.length > 1000){
      errs2.push({message: 'content', field: 'content'})
    }
    if(errs2.length>0)
      {
          res.status(400).send({
            errorsMessages: errs2
          })
          return
        }
        const nameblog=bloggers.find(v=> v.id===title4)
        if (! nameblog){
        
        res.status(400).send({ errorsMessages: [{ message: 'bloger', field: "bloggerId" }] })
        return
      }
   */
}));
exports.postsRouter.post("/", basicAuth_1.default, titleValidation, shortDescriptionValidation, contentValidation, validation_1.inputValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postnew = yield posts_servis_1.postsServis.createPosts(req.body.title, req.body.shortDescription, req.body.content, +req.body.bloggerId);
    if (postnew) {
        res.status(201).send(postnew);
    }
    else {
        res
            .status(400)
            .send({ errorsMessages: [{ message: "bloger", field: "bloggerId" }] });
    }
    /* let title= req.body.title;
    let title2= req.body.shortDescription;
    let title3= req.body.content;
    let title4= req.body.bloggerId;
    const errs2=[]
  
    if (!title || typeof title !=='string' || !title.trim() || title.length > 30){
      errs2.push({message: 'title', field: 'title'})
    }
    if (!title2 || typeof title2 !=='string' || !title2.trim() || title2.length > 100 ){
      errs2.push({message: 'shortDes', field: 'shortDescription'})
    }
    if (!title3 || typeof title3 !=='string' || !title3.trim() || title3.length > 1000){
      errs2.push({message: 'content', field: 'content'})
    }
    if(errs2.length>0)
      {
          res.status(400).send({
            errorsMessages: errs2
          })
          return
        } */
}));
exports.postsRouter.delete("/:id", basicAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isdelete = yield posts_servis_1.postsServis.deletePosts(+req.params.id);
    if (isdelete) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
/*   export const bloggerIdValidation = body('bloggerId')
   .trim().notEmpty().withMessage('Missing a required parameter')
   .custom(async (value, {req}) => {
       const isBloggerExists = await postsService.isUserExists(+req.body.bloggerId)
       if (!isBloggerExists) {
           throw new Error(`Blogger with id ${req.body.bloggerId} doesn't exist`);
       }
       return true;
   }); */
//# sourceMappingURL=posts-router.js.map