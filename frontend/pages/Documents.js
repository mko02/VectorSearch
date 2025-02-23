function Documents({
	selectedFile,
	setSelectedFile,
	files,
	setFiles,
	fileInputRef,
	setPreviewUrl,
	handleFileClick,
}) {
	const handleNewFileUpload = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		console.log("Starting upload:", file.name);
		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();
			console.log("Server response:", data);

			if (response.ok) {
				setFiles((prevFiles) => [data.filename, ...prevFiles]);
				setSelectedFile(data.filename);
				setPreviewUrl(`/uploads/${data.filename}`);
				event.target.value = "";
			} else {
				throw new Error(data.error || "Upload failed");
			}
		} catch (error) {
			console.error("Upload error:", error);
			alert(error.message || "Failed to upload file");
			event.target.value = "";
		}
	};

	return (
		<div
			style={{
				width: "250px",
				padding: "20px",
				borderRight: "1px solid #404040",
				background: "#2d2d2d",
			}}
		>
			<button
				onClick={handleNewFileUpload}
				style={{
					padding: "15px",
					borderRadius: "15px",
					background: "#4ade80",
					color: "black",
					border: "none",
					cursor: "pointer",
					width: "100%",
					fontSize: "16px",
					fontWeight: "500",
					marginBottom: "15px",
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

			<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
				{files.map((file, index) => (
					<button
						key={index}
						onClick={() => handleFileClick(file)}
						style={{
							padding: "12px 20px",
							borderRadius: "15px",
							border: "none",
							cursor: "pointer",
							background: selectedFile === file ? "#404040" : "#e5e5e5",
							color: selectedFile === file ? "white" : "black",
							transition: "all 0.2s",
							textAlign: "center",
							fontSize: "14px",
							fontWeight: "500",
						}}
					>
						{file}
					</button>
				))}
			</div>
		</div>
	);
}

export default Documents;
