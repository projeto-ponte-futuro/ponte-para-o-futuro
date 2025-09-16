const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "uploads"); // uploads na raiz

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nomeArquivo = Date.now() + ext;
    cb(null, nomeArquivo);
  },
});

const upload = multer({ storage });

module.exports = upload;
