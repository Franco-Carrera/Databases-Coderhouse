import { fileURLToPath } from "url";
import { dirname } from "path";

const filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(filename);

export const authMiddleware = (req, res, next) => {
  if (!req.auth) {
    res.status(403).send({
      error: -1,
      description: `Path ${req.originalUrl} with method ${req.method} are Not Authorised `,
    });
    console.log(
      `Path ${req.originalUrl} with method ${req.method} are Not Authorised `
    );
  } else {
    next();
  }
};
