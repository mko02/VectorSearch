const FUNCTION_CALL_INSTRUCTION =
	"IMPORTANT: When needed, make a function call using the following format:\n" +
	'<functioncall> {"name": "<function_name>", "arguments": "<json_arguments>"} </functioncall>\n' +
	"Ensure that your JSON is valid and includes the required keys. \n" +
	"End the conversation after the function call for it to execute, the user will not see this, but a new conversation will begin for you with its outputs. \n";

const INITIAL_CHAT_INTERACTION = {
	role: "system",
	content:
		FUNCTION_CALL_INSTRUCTION +
		"Feel free to make <functioncall> when needing to access some kind of documents. You are a helpful assistant with access to the following functions. Use them if required -\n" +
		"{\n" +
		'    "name": "search",\n' +
		'    "description": "search for an item in the  database",\n' +
		'    "parameters": {\n' +
		'        "type": "object",\n' +
		'        "properties": {\n' +
		'            "query": {"type": "string", "description": "The search query"}\n' +
		"        },\n" +
		'        "required": ["query"]\n' +
		"    }\n" +
		"}\n",
};

const user_input_pre_prompt =
	"TOOL: This is the result that was returned from the search:\n";
const user_input_post_prompt =
	"Given the information, answer the initial question:";

const user_context =
	"USER CONTEXT: You are a part of a AI search-engine application. Use the search tool to answer queries. ";

function TagsList({
	tags,
	setShowTagModal,
	setShowChatView,
	setChatText,
	setDocumentSegments,
	tagsInformation,
	notification,
	disableSearch,
	setDisableSearch,
	chatHistory,
	setChatHistory,
}) {
	const handleTagClick = async (tag) => {
		if (disableSearch) return;

		setDisableSearch(true);
		setShowChatView(true);

		const userInput =
			"Look for document and summarize the items for the keyword: " + tag.name;

		let updatedHistory = [...chatHistory];

		if (updatedHistory.length === 0) {
			updatedHistory.push(INITIAL_CHAT_INTERACTION);
		}

		const newUserMessage = { role: "user", content: userInput };
		updatedHistory.push(newUserMessage);

		setChatHistory(updatedHistory);

		// either clear chat text, or something
		await handleQuery(updatedHistory, userInput);

		setDisableSearch(false);
	};

	async function handleQuery(updatedHistory, userInput) {
		const response = await fetch("/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ messages: updatedHistory }),
		});

		if (!response.ok) {
			setChatText("Error fetching response.");
			return;
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();

		let partialChunk = "";

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value);

			if (chunk) {
				partialChunk += chunk;
				setChatText((prev) => prev + chunk);
			}

			// if we see the words </think> then clear the chat text
			if (partialChunk.includes("</think>")) {
				setChatText("");
				partialChunk = "";
			}
		}

		setChatHistory((prev) => [
			...prev,
			{ role: "assistant", content: partialChunk },
		]);

		const functionCallRegex = /<functioncall>(.*?)<\/functioncall>/;
		const functionCallMatch = functionCallRegex.exec(partialChunk);

		if (!functionCallMatch) {
			setDisableSearch(false);
			return;
		}

		// make a post request to http://localhost:8080/get_segment using the chat text
		try {
			// extract the query from the function call

			// strip any " or \ characters from the functionCallMatch
			const functionCallMatchCleaned = functionCallMatch[1].replace(
				/\\"/g,
				'"'
			);

			console.log("Function Call Match Cleaned:", functionCallMatchCleaned);

			const regex = /\{"query":\s*"([^"]+)"/;
			const match = regex.exec(functionCallMatchCleaned);

			console.log("Match:", match);

			if (!match) {
				setDisableSearch(false);
				return;
			}

			const query = match[1];

			console.log("Query:", query);

			const segmentResponse = await fetch("http://localhost:8080/get_segment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: query,
					num_results: 3,
				}),
			});

			if (!segmentResponse.ok) {
				console.error("Segment fetch failed");
			} else {
				const data = await segmentResponse.json();

				console.log("Document Segments:", data.document_segments);
				setDocumentSegments(data.document_segments);

				const documentText = data.document_segments
					.map((segment) => segment.text)
					.join("\n\n");

				var newMessage = {
					role: "user",
					content:
						user_context +
						user_input_pre_prompt +
						documentText +
						user_input_post_prompt +
						userInput,
				};

				updatedHistory.push(newMessage);
				setChatHistory(updatedHistory);
				setChatText("");

				await handleQuery(updatedHistory, userInput);
			}
		} catch (error) {
			console.error("Error in segment fetch:", error);
		}
	}

	return (
		<div
			style={{
				width: "300px",
				padding: "30px 20px",
				borderLeft: "1px solid #404040",
				background: "#2d2d2d",
				display: "flex",
				flexDirection: "column",
				gap: "20px",
			}}
		>
			<button
				onClick={() => setShowTagModal(true)}
				style={{
					padding: "12px",
					borderRadius: "8px",
					background: "transparent",
					color: "white",
					border: "1px solid #4ade80",
					cursor: "pointer",
					fontSize: "16px",
				}}
			>
				Add Tags +
			</button>

			<div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
				{tags.map((tag, index) => (
					<button
						key={index}
						onClick={() => handleTagClick(tag)}
						style={{ ...tagStyle(tag.color), position: "relative" }}
					>
						{tag.name}
						{notification && index == 0 && (
							<span
								style={{
									position: "absolute",
									top: "5px",
									right: "5px",
									width: "10px",
									height: "10px",
									backgroundColor: "red",
									borderRadius: "50%",
								}}
							/>
						)}
					</button>
				))}
			</div>
		</div>
	);
}

export default TagsList;

const tagStyle = (color) => ({
	padding: "12px 20px",
	borderRadius: "8px",
	border: "none",
	background: color,
	color: "white",
	cursor: "pointer",
	textAlign: "left",
	fontSize: "16px",
	fontWeight: "500",
});
