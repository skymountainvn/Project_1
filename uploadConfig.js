const multer = require('multer');
 const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './public'),
    filename: (req, file, cb) => cb(null, Date.now() + '.png')
});
 const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
        // return cb(null, false);
        return cb(new Error('File type error.'))
    }
    cb(null, true);
}
 const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 } });
 module.exports = upload;