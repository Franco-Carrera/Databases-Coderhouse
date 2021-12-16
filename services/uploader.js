import multer from "multer";
import { __dirname } from "../utils.js";

const getRandomFileName = (file) => {
  const randomString =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const randomUppercaseLowercaseString = randomString
    .split("")
    .map((v) => (Math.round(Math.random()) ? v.toUpperCase() : v.toLowerCase()))
    .join("");
  const extensionFile =
    "." +
    file.originalname.substring(
      file.originalname.lastIndexOf(".") + 1,
      file.originalname.length
    );

  return randomUppercaseLowercaseString + extensionFile;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, getRandomFileName(file));
  },
});

const upload = multer({ storage: storage });

export default upload;
