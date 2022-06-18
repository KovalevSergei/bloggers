import { Request, Response, NextFunction} from "express"
import {validationResult}  from 'express-validator'

export const inputValidation=(req: Request, res: Response, next: NextFunction)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsArray=errors.array({onlyFirstError:true}).map((error)=>{ 
        return {message: error.msg, field: error.param} 
       })
      res.status(404).json({ errorsMessages: errorsArray });
    }else{
        next()
    }

   
  
    }
  