import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.HUGGINGFACE_API_KEY,
	baseURL:
		"https://ewkdgpm7n2yz9sdg.us-east4.gcp.endpoints.huggingface.cloud/v1",
});

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const stream = await openai.chat.completions.create({
			model: "tgi",
			messages: req.body.messages,
			stream: true,
			top_p: 0.95,
			temperature: 0.4,
		});

		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.setHeader("X-Accel-Buffering", "no");

		for await (const chunk of stream) {
			const text = chunk.choices[0]?.delta?.content || "";
			res.write(text);
			res.flush?.();
		}

		res.end();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to stream from Hugging Face" });
	}
}
