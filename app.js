const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
let plugs = require('./variables')
const app = express()

const Op = Sequelize.Op
const sequelize = new Sequelize(plugs.tableName, plugs.dialect, plugs.pw,{
   host: plugs.localhost,
   port: plugs.port,
   dialect: plugs.dialect,
   $and : Op.and,
   $or: Op.or,
   $eq: Op.eq,
   $like: Op.like
})

const messages = sequelize.define('messages',
   {
     id: {
           type: Sequelize.INTEGER,
           autoIncrement: true,
           primaryKey: true
       },
      title: Sequelize.STRING,
      body: Sequelize.STRING
   }
)
sequelize.sync()

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('public'))
//routes
app.get('/bulletinBoard', (req, res)=>{
  messages.findAll({order: ['id']}).then((rows)=>{
    return rows;
  }).then((rows)=>{
    return res.render('bulletinBoard', {rows})
  })
})

app.post('/post-message', (req, res)=>{
  messages.create({
    id: res.body.id,
    title: res.body.title,
    body: res.body.body
  })
  .then(row=>{
    return res.redirect('/bulletinBoard')
  })
})



app.listen(3000, ()=>
console.log("okay works")
)
