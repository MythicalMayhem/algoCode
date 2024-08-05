const express = require('express');
const bodyParser = require('body-parser')


const app = express();
app.listen(3000, () => console.log('Server running on port 3000'))
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.post('/products', (req, res) => {
    console.log(req.headers.text)
    res.json({
        "text": "Welcome to the Product API! Use the '/products/:id' endpoint to retrieve a specific"
    })
})


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/IDE.html')
})