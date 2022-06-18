"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidation = void 0;
const express_validator_1 = require("express-validator");
const inputValidation = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true }).map((error) => {
            return { message: error.msg, field: error.param };
        });
        res.status(404).json({ errorsMessages: errorsArray });
    }
    else {
        next();
    }
};
exports.inputValidation = inputValidation;
//# sourceMappingURL=validation.js.map