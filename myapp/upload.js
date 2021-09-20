import express from 'express';
import multer from "multer";

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public");
    },
    filename: (req, file, cb) => {
      cb(null, Dete.new() + "--" + file.originalname);
    },
  });

export const upload = multer({ storage });