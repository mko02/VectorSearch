import { useState } from "react";

function AddTags({ tags, setTags, setShowTagModal }) {
	const [tagName, setTagName] = useState("");
	const [tagRequest, setTagRequest] = useState("");

	const handleAddTag = (e) => {
		e.preventDefault();
		const newTag = {
			name: tagName,
			request: tagRequest,
			color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color
		};
		setTags((prevTags) => [...prevTags, newTag]);

		// Also save to localStorage if you want persistence
		const savedTags = JSON.parse(localStorage.getItem("tags") || "[]");
		savedTags.push(newTag);
		localStorage.setItem("tags", JSON.stringify(savedTags));

		setShowTagModal(false);
		setTagName("");
		setTagRequest("");
	};

	return (
		<div style={modalOverlayStyle}>
			<div style={modalStyle}>
				<h3 style={{ color: "white", marginTop: 0 }}>Add New Tag</h3>
				<form onSubmit={handleAddTag}>
					<input
						type="text"
						placeholder="Tag Name"
						value={tagName}
						onChange={(e) => setTagName(e.target.value)}
						style={modalInputStyle}
					/>
					<textarea
						placeholder="Request"
						value={tagRequest}
						onChange={(e) => setTagRequest(e.target.value)}
						style={{ ...modalInputStyle, minHeight: "100px" }}
					/>
					<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
						<button
							type="submit"
							style={{ ...buttonStyle, background: "#4ade80" }}
						>
							Save
						</button>
						<button
							type="button"
							onClick={() => setShowTagModal(false)}
							style={{ ...buttonStyle, background: "#374151" }}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AddTags;

const modalOverlayStyle = {
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	background: "rgba(0, 0, 0, 0.7)",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
};

const modalStyle = {
	background: "#2d2d2d",
	padding: "20px",
	borderRadius: "8px",
	width: "400px",
};

const modalInputStyle = {
	width: "100%",
	padding: "8px 12px",
	marginBottom: "10px",
	borderRadius: "4px",
	border: "1px solid #404040",
	background: "#1a1a1a",
	color: "white",
};

const buttonStyle = {
	padding: "8px 16px",
	borderRadius: "4px",
	cursor: "pointer",
	width: "100%",
	fontWeight: "500",
};
