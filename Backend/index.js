import app from './src/app.js'
import connectDb from './src/config/db.config.js';
import config from './src/config/config.js';


connectDb()

const PORT = config.PORT || 5000

app.listen(PORT, () => {
    console.log(`PORT at http://localhost:${PORT}/`);
})