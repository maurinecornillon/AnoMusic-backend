const multer = require("multer");

module.exports = multer({
  dest: "tempUploads/",
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});
