import multer from "multer";

export const upload = (file) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const uploeadInstance = multer({ storage: storage });
  return uploeadInstance;
};
