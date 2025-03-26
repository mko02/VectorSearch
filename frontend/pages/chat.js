import SearchBar from "./searchbar";

function Chat({
	chatText,
	setChatText,
	setShowChatView,
	setDocumentSegments,
	chatHistory,
	setChatHistory,
	disableSearch,
	setDisableSearch,
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "80vh", // Full viewport height
				backgroundColor: "#f0f0f0", // Light gray background
				border: "1px solid #d3d3d3", // Slight border
				borderRadius: "8px", // Rounded corners
				padding: "16px", // Space on all sides
				overflow: "hidden", // Prevent page scroll
			}}
		>
			{/* Thinking Messages in One Box */}
			<div
				style={{
					flex: 1,
					padding: "8px",
					backgroundColor: "#ffffff", // White box for messages
					borderRadius: "8px",
					boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // Subtle shadow for depth
					overflowY: "auto", // Allow vertical scrolling inside this box
					overflowX: "hidden", // Prevent horizontal overflow
					whiteSpace: "pre-wrap", // Preserve line breaks
					wordBreak: "break-word", // Force wrapping for long words
					maxWidth: "100%", // Ensure box does not exceed parent width
					maxHeight: "100%", // Ensure box does not exceed parent height
					height: "30%",
				}}
			>
				{chatText}
			</div>

			{/* SearchBar at the Bottom */}
			<div
				style={{
					position: "absolute",
					bottom: 16,
					maxWidth: "100%",
					width: "45%",
				}}
			>
				<SearchBar
					setChatText={setChatText}
					setShowChatView={setShowChatView}
					setDocumentSegments={setDocumentSegments}
					chatHistory={chatHistory}
					setChatHistory={setChatHistory}
					disableSearch={disableSearch}
					setDisableSearch={setDisableSearch}
				/>
			</div>
		</div>
	);
}

export default Chat;
