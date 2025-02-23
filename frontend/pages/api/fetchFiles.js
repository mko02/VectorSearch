import fs from "fs";
import path from "path";

export default function fetchFiles(req, res) {
	const uploadDir = path.join(process.cwd(), "public", "uploads");

	fs.readdir(uploadDir, (err, files) => {
		if (err) {
			console.error("Error reading upload directory:", err);
			return res.status(500).json({ error: "Unable to read files" });
		}
		res.status(200).json({ files });
	});
}
