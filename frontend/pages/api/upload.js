import formidable from "formidable";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	console.log("Upload request received");

	// Ensure uploads directory exists
	const uploadDir = path.join(process.cwd(), "public", "uploads");
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

	const options = {
		uploadDir,
		keepExtensions: true,
		maxFileSize: 10 * 1024 * 1024, // 10MB limit
		filename: (name, ext, part, form) => {
			return part.originalFilename; // Keep original filename
		},
	};

	try {
		const form = formidable(options);

		// Parse the form
		const [fields, files] = await new Promise((resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) {
					console.error("Form parse error:", err);
					reject(err);
				}
				resolve([fields, files]);
			});
		});

		console.log("Files received:", files);

		// Handle file
		const file = Array.isArray(files.file) ? files.file[0] : files.file;
		if (!file) {
			throw new Error("No file uploaded");
		}

		const filename = file.originalFilename;
		const filepath = file.filepath;

		const fileContent = await extractTextFromFile(filepath);

		// send post @app.route("/add_document", methods=["POST"])

		const flaskResponse = await fetch("http://localhost:8080/add_document", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				filename,
				content: fileContent,
			}),
		});

		console.log("Flask response:", flaskResponse);

		// Try to send to Flask backend
		try {
			const flaskResponse = await fetch("http://localhost:8080/add_document", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					filename,
					content: fileContent,
				}),
			});

			console.log("Flask response status:", flaskResponse.status);
		} catch (flaskError) {
			console.error("Flask API error:", flaskError);
			// Continue even if Flask API fails
		}

		// Return success response
		console.log("Upload successful:", filename);
		return res.status(200).json({
			filename: filename,
			path: `/uploads/${filename}`,
		});
	} catch (error) {
		console.error("Upload error:", error);
		return res.status(500).json({
			error: "Upload failed",
			details: error.message,
		});
	}
}

async function extractTextFromFile(filepath) {
	// if pdf
	if (filepath.endsWith(".pdf")) {
		const pdfBuffer = fs.readFileSync(filepath);
		const pdfData = await pdfParse(pdfBuffer);
		return pdfData.text;
	}
}
