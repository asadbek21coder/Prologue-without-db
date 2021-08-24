const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const ejs = require('ejs')

const {v4} = require('uuid') 
const path = require('path')
const fs = require('fs')
const util = require('util')
const read = util.promisify(fs.readFile)
const write = util.promisify(fs.writeFile)
const usersPath = path.join(__dirname,'data','users.json')

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.set('views', 'src/views')
app.use ('/assets', express.static('assets'))
app.use ('/images', express.static('images'))
app.use(express.json())

app.get('/', (req,res) => {
    res.render('index.html')
})
app.get('/api/users', async (req,res) => {
    usersContent = await read(usersPath, 'utf8')
    usersData = JSON.parse(usersContent)
    res.send(usersData)
})

app.post('/users', async (req,res) => {
    try {
        const usersContent  =await read(usersPath, 'utf8')
    usersData = JSON.parse(usersContent)
    email = usersData.find(e => e.email == req.body.email) 
    if (!email) {
        usersData.push({
            id: v4(),
            email: req.body.email
        })
        write(usersPath, JSON.stringify(usersData, null, 4))
        console.log(usersData)
        res.status(201).send({message:'Succesfully created'})

    }
    else {
        throw new Error ('Bunday email bazada majud')
    }
    }
    catch(error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}) 


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))