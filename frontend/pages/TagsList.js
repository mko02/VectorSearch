function TagsList({ tags, setShowTagModal }) {
	const handleTagClick = async (tagRequest) => {
		if (!selectedFile) {
			alert("Please select a document first");
			return;
		}

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: tagRequest,
					filename: selectedFile,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to process tag request");
			}

			const data = await response.json();
			console.log("Tag response:", data);

			// Handle the response as needed
			// You might want to display the results somewhere in the UI
		} catch (error) {
			console.error("Tag processing error:", error);
			alert("Failed to process tag request");
		}
	};

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
						onClick={() => handleTagClick(tag.request)}
						style={tagStyle(tag.color)}
					>
						{tag.name}
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
