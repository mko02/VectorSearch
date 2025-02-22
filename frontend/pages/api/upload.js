import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Ensure uploads directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const options = {
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
    filename: (name, ext, part, form) => {
      return part.originalFilename; // Keep original filename
    }
  };

  try {
    const form = formidable(options);
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // files.file is an array in newer versions of formidable
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!file) {
      throw new Error('No file uploaded');
    }

    const filename = file.originalFilename;
    
    console.log('File uploaded:', {
      filename,
      filepath: file.filepath,
      uploadDir
    });

    return res.status(200).json({ 
      filename: filename,
      path: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Error uploading file: ' + error.message });
  }
} 