import app from "./src/app.js";
import connectDb from "./src/config/db.config.js";
import config from "./src/config/config.js";

const PORT = config.PORT || 5000

async function startServer() {
	try {
		await connectDb(); 
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
	}
}

startServer();