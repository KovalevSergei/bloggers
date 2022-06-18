"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bloggersRepository = void 0;
const db_1 = require("./db");
exports.bloggersRepository = {
    getBloggers() {
        return db_1.bloggers;
    },
    getBloggersById(id) {
        const blogger = db_1.bloggers.find(v => v.id === id);
        return blogger;
    },
    deleteBloggersById(id) {
        const index = db_1.bloggers.findIndex(v => v.id === id);
        if (index === -1) {
            return false;
        }
        else {
            db_1.bloggers.splice(index, 1);
            return true;
        }
    },
    createBloggers(name, youtubeUrl) {
        const bloggersnew = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        };
        db_1.bloggers.push(bloggersnew);
        return bloggersnew;
    },
    updateBloggers(id, name, youtubeUrl) {
        const bloggersnew2 = db_1.bloggers.find(v => v.id === id);
        if (!bloggersnew2) {
            return false;
        }
        else {
            const bloggersnew2 = {
                id: id,
                name: name,
                youtubeUrl: youtubeUrl
            };
            return bloggersnew2;
        }
    },
};
//# sourceMappingURL=bloggers-repository.js.map