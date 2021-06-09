const express = require("express")
const app = express()


//-----------------------------------------CONNEXION BD
let MongoClient = require("mongodb").MongoClient;
const client = new MongoClient("mongodb://localhost:27017", 
    { useNewUrlParser: true, useUnifiedTopology: true });

let mongodb = require("mongodb")

let db = null;
client.connect(err => {
    db = client.db("courses")
})


//-----------------------------------------------------------ROUTES STATIQUES
 
app.use("/css", express.static(__dirname + "/css"))
app.use("/js", express.static(__dirname + "/js"))


//-------------------------------------------------------ROUTE UNIQUE DE FRONT

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/index.html")
})

//--------------------------------------------------------ROUTE SERVICE (REST)


app.get("/course/list", (req, res) => {
    db.collection("courses").find({ }).toArray((err, docs) => {
        res.json(docs)
    })
})



app.get("/course/add", (req, res) => {
    let course = req.query
    course.quantity = parseFloat(course.quantity), 
    course.prix = parseFloat(course.prix),
    db.collection("courses").insertOne(course, (err, docs) => {
        res.json(docs.ops)
    })
})

app.get("/course/update", (req, res) => {
    let data = req.query
    let _id = req.query._id
    let allUpdated = [ ]
    for (let key in data){
        if (key != "_id") {
                let value = data[key]
                let o = new Object()
                o[key] = value
                allUpdated.push(db.collection("courses").updateOne(
                    { _id: new mongodb.ObjectId(_id)},
                    { $set: o }
                ) )
        }
    }
    Promise.all(allUpdated).then(() => {
        res.json({ ok: true})
    })
})



app.listen(1337)