export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	const { text } = req.body;

	// Split the text into segments
	const segments = text.split(".");

	// Return the segments
	res.status(200).json({ segments });
}
