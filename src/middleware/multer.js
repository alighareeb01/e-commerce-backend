import multer from "multer";

export const upload = () => multer({ storage: multer.memoryStorage() });
// export const upload = (file) => {
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "uploads");
//     },
//     filename: function (req, file, cb) {
//      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

//      const ext = path.extname(file.originalname);

//      cb(null, uniqueName + ext);

//     },
//   });

//   const uploeadInstance = multer({ storage: storage });
//   return uploeadInstance;
// };
