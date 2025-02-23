function NavBar() {
	return (
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

export default NavBar;
