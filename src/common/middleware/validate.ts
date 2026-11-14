import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType } from "zod";

export const validateHandler = <
  B extends ZodType,
  P extends ZodType,
  Q extends ZodType,
>(schema: {
  body?: B;
  params?: P;
  query?: Q;
}): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body)
        req.body = schema.body.parse(req.body) as Request["body"];
      if (schema.params)
        req.params = schema.params.parse(req.body) as Request["body"];
      if (schema.query)
        req.query = schema.query.parse(req.query) as Request["body"];

      next();
    } catch (error) {
      next(error);
    }
  };
};
