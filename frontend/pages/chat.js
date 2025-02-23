import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Chat() {
	const [chatInput, setChatInput] = useState("");
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { file } = router.query; // Get the file from URL query

	const handleChatSubmit = async (e) => {
		e.preventDefault();
		if (!chatInput.trim()) return;

		const userMessage = chatInput.trim();
		setChatInput("");

		setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
		setIsLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: userMessage,
					currentFile: file,
				}),
			});

			const data = await response.json();
			setMessages((prev) => [...prev, { type: "bot", content: data.response }]);
		} catch (error) {
			console.error("Chat error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100vh",
				background: "#1a1a1a",
			}}
		>
			{/* Navigation Bar */}
			<nav
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "1rem 2rem",
					background: "#2d2d2d",
					borderBottom: "1px solid #404040",
				}}
			>
				<div style={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>
					Vector Space
				</div>
				<div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
					<button style={navButtonStyle}>View Tags</button>
					<button style={navButtonStyle}>Past Searches</button>
					<button
						style={{
							...navButtonStyle,
							color: "#4ade80",
							textDecoration: "underline",
						}}
					>
						Switch Profile
					</button>
				</div>
			</nav>

			<div
				style={{
					flex: 1,
					padding: "30px",
					display: "flex",
					flexDirection: "column",
					gap: "20px",
				}}
			>
				{/* Chat input at top */}
				<form onSubmit={handleChatSubmit}>
					<input
						type="text"
						placeholder="Follow Up Questions..."
						value={chatInput}
						onChange={(e) => setChatInput(e.target.value)}
						disabled={isLoading}
						style={{
							padding: "15px 25px",
							borderRadius: "30px",
							border: "none",
							width: "100%",
							fontSize: "16px",
							backgroundColor: "white",
							boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
						}}
					/>
				</form>

				{/* Main content area */}
				<div
					style={{
						display: "flex",
						gap: "20px",
						flex: 1,
					}}
				>
					{/* Chat messages */}
					<div
						style={{
							flex: "40%",
							background: "rgba(255, 255, 255, 0.1)",
							borderRadius: "20px",
							padding: "20px",
							backdropFilter: "blur(10px)",
							boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
							overflowY: "auto",
						}}
					>
						{messages.map((message, index) => (
							<div
								key={index}
								style={{
									marginBottom: "15px",
									display: "flex",
									flexDirection: "column",
									alignItems:
										message.type === "user" ? "flex-end" : "flex-start",
								}}
							>
								<div
									style={{
										background: message.type === "user" ? "#4ade80" : "white",
										color: message.type === "user" ? "white" : "black",
										padding: "10px 15px",
										borderRadius: "15px",
										maxWidth: "80%",
										boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
									}}
								>
									{message.content}
								</div>
							</div>
						))}
					</div>

					{/* Document preview */}
					<div
						style={{
							flex: "60%",
							background: "rgba(255, 255, 255, 0.1)",
							borderRadius: "20px",
							overflow: "hidden",
							boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
						}}
					>
						<iframe
							src={`/uploads/${file}`}
							style={{
								width: "100%",
								height: "100%",
								border: "none",
								background: "white",
							}}
							title="Document Preview"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

const navButtonStyle = {
	background: "transparent",
	border: "none",
	color: "white",
	cursor: "pointer",
	padding: "8px 16px",
	borderRadius: "4px",
};
