import multer from "multer";

const storage = multer.memoryStorage(); // Store in memory, or configure disk storage
const upload = multer({ storage });

export default upload;
