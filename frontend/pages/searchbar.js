import React, { useState } from "react";

function SearchBar() {
	const [chatInput, setChatInput] = useState("");

	const handleSearchSubmit = async (e) => {
		e.preventDefault();
		console.log("Search submitted:", chatInput);

		try {
			const response = await fetch("http://localhost:8080/search_query", {
				method: "POST", // Changed from GET to POST
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query: chatInput }), // Sending data in body
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Search Results:", data);

			const thinking = data.thinking;

			// Start the recursive search_continue calls
			await handleSearchContinue();
		} catch (error) {
			console.error("Error fetching search results:", error);
		}
	};

	const handleSearchContinue = async () => {
		try {
			const response = await fetch("http://localhost:8080/search_continue", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: null,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Search Continue Response:", data);

			if (data.message === "end") {
				console.log("Final Thoughts:", data.thinking);
				console.log("Final Answer:", data.answer);
			} else {
				console.log("Continuing search...");
				console.log("Thinking:", data.thinking);
				console.log("Next Query:", data.query);

				// Continue search with the next query
				await handleSearchContinue();
			}
		} catch (error) {
			console.error("Error in search_continue:", error);
		}
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
					backgroundColor: "#007bff",
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
