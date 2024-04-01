const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('<h1> ilcs API successfully started')
})

// ROUTES API
routes(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})