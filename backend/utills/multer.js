const multer = require('multer');


var multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

//MULTER FILTER
const multerFilter = (req, file, cb) => {
    //octet-stream
    let fileextion = ["png", "jpg", "jpeg", "svg", "vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    if (fileextion.includes(file.mimetype.split("/")[1])) { //  file.mimetype.split("/")[1] === "png" ||
        cb(null, true);
    } else {
        cb(new Error("Not a valid File!!"), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});



module.exports = upload