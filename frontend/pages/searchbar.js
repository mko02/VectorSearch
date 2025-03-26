import React, { useState } from "react";

const FUNCTION_CALL_INSTRUCTION =
	"IMPORTANT: When needed, make a function call using the following format:\n" +
	'<functioncall> {"name": "<function_name>", "arguments": "<json_arguments>"} </functioncall>\n' +
	"Ensure that your JSON is valid and includes the required keys. \n" +
	"End the conversation after the function call for it to execute, the user will not see this, but a new conversation will begin for you with its outputs. \n";

const INITIAL_CHAT_INTERACTION = {
	role: "system",
	content:
		FUNCTION_CALL_INSTRUCTION +
		"You are a helpful assistant with access to the following functions. Use them if required -\n" +
		"{\n" +
		'    "name": "search",\n' +
		'    "description": "search for an item in the internal company database",\n' +
		'    "parameters": {\n' +
		'        "type": "object",\n' +
		'        "properties": {\n' +
		'            "query": {"type": "string", "description": "The search query"}\n' +
		"        },\n" +
		'        "required": ["query"]\n' +
		"    }\n" +
		"}\n",
};

function SearchBar({
	setChatText,
	setShowChatView,
	setDocumentSegments,
	chatHistory,
	setChatHistory,
	disableSearch,
	setDisableSearch,
}) {
	const [chatInput, setChatInput] = useState("");

	// const handleSearchSubmit = async (e) => {
	// 	e.preventDefault();
	// 	console.log("Search submitted:", chatInput);
	// 	setShowChatView(true);

	// 	// set 0.5 second delay
	// 	await new Promise((resolve) => setTimeout(resolve, 500));

	// 	try {
	// 		const response = await fetch("http://localhost:8080/search_query", {
	// 			method: "POST", // Changed from GET to POST
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({ query: chatInput }), // Sending data in body
	// 		});

	// 		if (!response.ok) {
	// 			throw new Error(`HTTP error! Status: ${response.status}`);
	// 		}

	// 		const data = await response.json();
	// 		console.log("Search Results:", data);

	// 		// append to the document segments array
	// 		const documentSegments = data.document_segments;
	// 		setDocumentSegments([...documentSegments]);

	// 		const thinking = data.thinking;
	// 		// add thinking to the thinking array
	// 		setChatText([...thinking]);

	// 		// Start the recursive search_continue calls
	// 		await handleSearchContinue();
	// 	} catch (error) {
	// 		console.error("Error fetching search results:", error);
	// 	}
	// };

	// const handleSearchContinue = async () => {
	// 	try {
	// 		const response = await fetch("http://localhost:8080/search_continue", {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: null,
	// 		});

	// 		if (!response.ok) {
	// 			throw new Error(`HTTP error! Status: ${response.status}`);
	// 		}

	// 		const data = await response.json();
	// 		console.log("Search Continue Response:", data);

	// 		const thinking = data.thinking;
	// 		// add thinking to the thinking array
	// 		setChatText([...thinking]);

	// 		if (data.message === "end") {
	// 			console.log("Final Thoughts:", data.thinking);
	// 			console.log("Final Answer:", data.answer);
	// 		} else {
	// 			console.log("Continuing search...");
	// 			console.log("Thinking:", data.thinking);
	// 			console.log("Next Query:", data.query);

	// 			// append to the document segments array
	// 			const documentSegments = data.document_segments;
	// 			setDocumentSegments([...documentSegments]);

	// 			// Continue search with the next query
	// 			await handleSearchContinue();
	// 		}
	// 	} catch (error) {
	// 		console.error("Error in search_continue:", error);
	// 	}
	// };

	const handleSearchSubmit = async () => {
		if (!chatInput.trim()) return;

		if (disableSearch) return;

		setDisableSearch(true);
		setShowChatView(true);
		setChatInput("");

		let updatedHistory = [...chatHistory];

		if (updatedHistory.length === 0) {
			updatedHistory.push(INITIAL_CHAT_INTERACTION);
		}

		const newUserMessage = { role: "user", content: chatInput };
		updatedHistory.push(newUserMessage);

		setChatHistory(updatedHistory);

		// either clear chat text, or something

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
		}

		setChatHistory((prev) => [
			...prev,
			{ role: "assistant", content: partialChunk },
		]);

		// make a post request to http://localhost:8080/get_segment using the chat text
		try {
			// extract <functioncall> {"name": "search", "arguments": {"query": "this work"}} </functioncall>

			const functionCallRegex = /<functioncall>(.*?)<\/functioncall>/g;
			const functionCallMatch = functionCallRegex.exec(partialChunk);

			// extract the query from the function call
			const queryRegex = /"query": "(.*?)"/g;
			const queryMatch = queryRegex.exec(functionCallMatch[1]);
			const query = queryMatch[1];

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
			}
		} catch (error) {
			console.error("Error in segment fetch:", error);
		}

		setDisableSearch(false);
	};

	return (
		<div style={{ position: "relative", width: "100%" }}>
			<input
				type="text"
				placeholder="Search"
				value={chatInput}
				onChange={(e) => setChatInput(e.target.value)}
				style={{
					padding: "15px 60px 15px 25px",
					borderRadius: "30px",
					border: "none",
					width: "100%",
					fontSize: "16px",
					backgroundColor: "white",
					boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
				}}
			/>
			<button
				onClick={handleSearchSubmit}
				style={{
					position: "absolute",
					right: "10px", // Adjust position inside the input
					top: "50%",
					transform: "translateY(-50%)",
					backgroundColor: "#d3d3d3",
					color: "white",
					border: "none",
					borderRadius: "50%",
					width: "35px",
					height: "35px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: "pointer",
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
				}}
			></button>
		</div>
	);
}

export default SearchBar;
