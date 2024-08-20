const express = require('express');
const bodyParser = require('body-parser')
const predefined = require('./predefined').str
const generateTDO = require('./declaredObjects').generateTDO
const translateLines = require('./convert').translateLines
const app = express();
app.listen(3000, () => console.log('Server running on port 3000'))
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json())

app.post('/products', (req, res) => {
    try {
        const a = generateTDO(req.body.tdnt, req.body.tdo)
        const b = translateLines(req.body.text)
        res.json({ content: predefined + '\n' + a + b.join('') });
    } catch (error) {
        res.json({ content: 'ecrire("Server Error:  ' + error.message + '  )' });
    }
})


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/IDE.html')
})