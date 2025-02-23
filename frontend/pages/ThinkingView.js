import React from "react";

function ThinkingView({ documentSegments }) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "90vh", // Full viewport height
				borderRadius: "8px", // Rounded corners
				overflow: "hidden", // Prevent page scroll
			}}
		>
			<div
				style={{
					flex: 1,
					padding: "8px",
					backgroundColor: "#ffffff", // White box for content
					borderRadius: "8px",
					boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // Subtle shadow for depth
					overflowY: "auto", // Allow vertical scrolling inside this box
					overflowX: "hidden", // Prevent horizontal overflow
					whiteSpace: "pre-wrap", // Preserve line breaks
					wordBreak: "break-word", // Force wrapping for long words
					maxWidth: "100%", // Ensure box does not exceed parent width
					maxHeight: "100%", // Ensure box does not exceed parent height
				}}
			>
				<ul style={{ listStyle: "none", padding: 0 }}>
					{documentSegments && documentSegments.length > 0 ? (
						documentSegments.map((segment, index) => {
							segment = segment.text;
							const filename_index = segment.indexOf(".pdf") + 4;
							const filename = segment.substring(0, filename_index);
							const text = segment.substring(filename_index + 1);

							return (
								<li
									key={index}
									style={{
										backgroundColor: index % 2 === 0 ? "#ffffff" : "#e0e0e0",
										padding: "10px",
										margin: "10px 0",
										borderRadius: "8px",
										boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
									}}
								>
									<h3
										style={{
											margin: "0 0 8px 0",
											fontSize: "18px",
											fontWeight: "bold",
											borderBottom: "1px solid #ccc",
											paddingBottom: "4px",
										}}
									>
										{filename}
									</h3>

									<p style={{ margin: 0 }}>...{text}...</p>
								</li>
							);
						})
					) : (
						<p>Thinking...</p>
					)}
				</ul>
			</div>
		</div>
	);
}

export default ThinkingView;
