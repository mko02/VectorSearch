import { useState, useRef } from "react";
import { useRouter } from "next/router";

import SearchBar from "./searchbar";
import DocPreviewMain from "./DocPreviewMain";
import NavBar from "./NavBar";
import Documents from "./Documents";
import TagsList from "./TagsList";
import AddTags from "./AddTags";
import Chat from "./chat";
import ThinkingView from "./ThinkingView";

export default function Home() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [files, setFiles] = useState([]);
	const fileInputRef = useRef(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [showTagModal, setShowTagModal] = useState(false);

	const [showTagView, setShowTagView] = useState(true);
	const [chatText, setChatText] = useState("");
	const [showChatView, setShowChatView] = useState(false);
	const [chatHistory, setChatHistory] = useState([]);
	const [disableSearch, setDisableSearch] = useState(false);

	const [documentSegments, setDocumentSegments] = useState([]);
	const [notification, setNotification] = useState(false);

	const [tagsInformation, setTagsInformation] = useState({
		document_segments: [],
		thinking: "",
		answer: "",
	});

	const [tags, setTags] = useState([
		{
			name: "Customer Satisfaction",
			color: "#ff4e6e",
			request: "Find customer satisfaction related content",
		},
		{
			name: "Claims",
			color: "#4ade80",
			request: "Find claims related content",
		},
		{
			name: "Customer Summary",
			color: "#fbbf24",
			request: "Find customer summary information",
		},
	]);

	const router = useRouter();

	const handleFileClick = (fileName) => {
		setSelectedFile(fileName);
		setPreviewUrl(`/uploads/${fileName}`);
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
			<NavBar />

			{/* Left sidebar */}
			{!showChatView && (
				<div style={{ display: "flex", flex: 1 }}>
					{showTagView && (
						<Documents
							selectedFile={selectedFile}
							setSelectedFile={setSelectedFile}
							files={files}
							setFiles={setFiles}
							fileInputRef={fileInputRef}
							setPreviewUrl={setPreviewUrl}
							handleFileClick={handleFileClick}
							setTagsInformation={setTagsInformation}
							setNotification={setNotification}
						/>
					)}

					{/* Main content */}
					{showTagView && (
						<div
							style={{
								flex: 1,
								padding: "30px",
								display: "flex",
								flexDirection: "column",
								background:
									"linear-gradient(135deg, rgba(245, 208, 254, 0.15) 0%, rgba(147, 197, 253, 0.15) 100%)",
								gap: "20px",
							}}
						>
							{!showChatView && (
								<SearchBar
									setChatText={setChatText}
									setShowChatView={setShowChatView}
									setDocumentSegments={setDocumentSegments}
									chatHistory={chatHistory}
									setChatHistory={setChatHistory}
									disableSearch={disableSearch}
									setDisableSearch={setDisableSearch}
								/>
							)}
							{!showChatView && <DocPreviewMain previewUrl={previewUrl} />}
						</div>
					)}
					{!showTagView && !showChatView && (
						<div
							style={{
								flex: 1,
								padding: "30px",
								display: "flex",
								flexDirection: "column",
								background:
									"linear-gradient(135deg, rgba(245, 208, 254, 0.15) 0%, rgba(147, 197, 253, 0.15) 100%)",
								gap: "20px",
							}}
						>
							<DocPreviewMain previewUrl={previewUrl} />
						</div>
					)}
					{/* Right sidebar */}
					{!showChatView && (
						<TagsList
							tags={tags}
							setShowTagModal={setShowTagModal}
							setShowChatView={setShowChatView}
							setChatText={setChatText}
							setDocumentSegments={setDocumentSegments}
							tagsInformation={tagsInformation}
							notification={notification}
							disableSearch={disableSearch}
							setDisableSearch={setDisableSearch}
							chatHistory={chatHistory}
							setChatHistory={setChatHistory}
						/>
					)}
				</div>
			)}

			{showChatView && (
				<div style={{ display: "flex", flex: 1 }}>
					<div style={{ flex: 0.5 }}>
						<ThinkingView documentSegments={documentSegments} />
					</div>
					<div style={{ flex: 0.5 }}>
						<Chat
							chatText={chatText}
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
			)}

			{/* Tag Modal */}
			{showTagModal && (
				<AddTags setTags={setTags} setShowTagModal={setShowTagModal} />
			)}
		</div>
	);
}
