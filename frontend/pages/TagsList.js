function TagsList({
	tags,
	setShowTagModal,
	setShowChatView,
	setChatText,
	setDocumentSegments,
	tagsInformation,
	notification,
}) {
	const handleTagClick = async () => {
		setShowChatView(true);

		const documentSegments = tagsInformation.document_segments;
		const thinking = tagsInformation.thinking;
		const answer = tagsInformation.answer;

		setDocumentSegments(documentSegments);
		setChatText(thinking + answer);
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
