"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_1 = require("./db");
const db_2 = require("./db");
exports.postsRepository = {
    getPosts() {
        return db_2.posts;
    },
    getpostsId(id) {
        const postsid = db_2.posts.find(v => v.id === id);
        return postsid;
    },
    updatePostsId(id, title, shortDescription, content, bloggerId) {
        const postsnew = db_2.posts.find(v => v.id === id);
        if (!postsnew) {
            return false;
        }
        else {
            postsnew.title = title;
            postsnew.shortDescription = shortDescription;
            postsnew.content = content;
            postsnew.bloggerId = bloggerId;
            return true;
        }
    },
    createPosts(title, shortDescription, content, bloggerId) {
        const nameblog = db_1.bloggers.find(v => +v.id === +bloggerId);
        console.log(bloggerId, db_1.bloggers.map(v => v.id), nameblog);
        if (nameblog) {
            const postnew = {
                id: +(new Date()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: nameblog.name
            };
            db_2.posts.push(postnew);
            return true;
        }
        else {
            return false;
        }
    },
    deletePosts(id) {
        const isdelete = db_2.posts.findIndex(v => v.id === id);
        if (isdelete === -1) {
            return false;
        }
        else {
            db_2.posts.splice(isdelete, 1);
            return true;
        }
    }
};
//# sourceMappingURL=posts-repository.js.map