import React, { useState } from "react";

function DocPreviewMain({ previewUrl }) {
	console.log(previewUrl);

	return (
		<div
			style={{
				flex: 1,
				borderRadius: "20px",
				overflow: "hidden",
				background: "white",
				boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
			}}
		>
			{previewUrl ? (
				<embed
					src={previewUrl}
					type="application/pdf"
					style={{
						width: "100%",
						height: "100%",
						border: "none",
					}}
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
					Select a document to preview
				</div>
			)}
		</div>
	);
}

export default DocPreviewMain;
