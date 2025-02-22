import { useState, useRef } from "react";

export default function Home() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [chatInput, setChatInput] = useState("");
	const [files, setFiles] = useState([]);
	const fileInputRef = useRef(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleFileClick = async (fileName) => {
		setSelectedFile(fileName);
		try {
			setPreviewUrl(`/uploads/${fileName}`);
		} catch (error) {
			console.error("Error loading preview:", error);
		}
	};

	const handleNewFileUpload = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			console.log("Attempting to upload file:", file.name);
			const formData = new FormData();
			formData.append("file", file);

			try {
				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				const responseText = await response.text();
				console.log("Server response:", responseText);

				if (response.ok) {
					const data = JSON.parse(responseText);
					console.log("Upload successful:", data);

					setFiles((prevFiles) => [data.filename, ...prevFiles]);
					setSelectedFile(data.filename);
					setPreviewUrl(data.path);
				} else {
					console.error("Upload failed:", responseText);
				}
			} catch (error) {
				console.error("Error uploading file:", error);
			}
		}
	};

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
					currentFile: selectedFile,
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
				height: "100vh",
				background: "white",
			}}
		>
			{/* Left sidebar */}
			<div
				style={{
					width: "250px",
					padding: "20px",
					borderRight: "1px solid #eee",
					background: "white",
				}}
			>
				<h2 style={{ margin: "0 0 20px 0" }}>Vector Space</h2>

				<button
					onClick={handleNewFileUpload}
					style={{
						padding: "8px 16px",
						marginBottom: "20px",
						borderRadius: "20px",
						border: "1px solid #ccc",
						cursor: "pointer",
						width: "100%",
						background: "white",
						fontWeight: "500",
					}}
				>
					+ Upload new file
				</button>

				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					style={{ display: "none" }}
					accept=".pdf"
				/>

				<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
					{files.map((file, index) => (
						<button
							key={index}
							onClick={() => handleFileClick(file)}
							style={{
								padding: "8px 16px",
								borderRadius: "20px",
								border: "1px solid #ccc",
								cursor: "pointer",
								background: selectedFile === file ? "#eee" : "white",
								transition: "background-color 0.2s",
							}}
						>
							{file}
						</button>
					))}
				</div>
			</div>

			{/* Main content */}
			<div
				style={{
					flex: 1,
					padding: "20px",
					display: "flex",
					flexDirection: "column",
					background: "linear-gradient(135deg, #f5d0fe 0%, #93c5fd 100%)",
					minHeight: "100vh",
				}}
			>
				{/* Chat input at top */}
				<form
					onSubmit={handleChatSubmit}
					style={{ width: "100%", marginBottom: "20px" }}
				>
					<input
						type="text"
						placeholder={isLoading ? "Processing..." : "Chat..."}
						value={chatInput}
						onChange={(e) => setChatInput(e.target.value)}
						disabled={isLoading}
						style={{
							padding: "12px 20px",
							borderRadius: "25px",
							border: "none",
							width: "100%",
							boxSizing: "border-box",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
							fontSize: "16px",
						}}
					/>
				</form>

				{/* Document preview */}
				<div
					style={{
						flex: 1,
						border: "none",
						borderRadius: "10px",
						padding: "20px",
						backgroundColor: "white",
						overflow: "hidden",
						boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
					}}
				>
					{previewUrl ? (
						<iframe
							src={previewUrl}
							style={{
								width: "100%",
								height: "100%",
								border: "none",
							}}
							title="Document Preview"
						/>
					) : (
						<div
							style={{
								textAlign: "center",
								color: "#666",
								height: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							Document preview to be here
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
