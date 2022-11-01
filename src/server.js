import express from 'express';
import bodyParser from 'body-parser';
import path from "path";
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
app.use(express.static(path.join(__dirname, "/build")));
app.use(bodyParser.json());

// const uri = "mongodb+srv://nolanb:Bookout111@cluster0.rb1ibnf.mongodb.net/?retryWrites=true&w=majority";
const uri="mongodb+srv://nolanb:Bookout111@cluster0.rb1ibnf.mongodb.net/test";
const withDB = async (operations, res) => {
    try {

        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        const db = client.db("nolanb");
        await operations(db);
        client.close();
    }
    catch (error) {
        res.status(500).json({ message: "Error connecting to db", error });
    }
}

app.get('/api/projects/:name', async (req, res) => {
    withDB(async (db) => {
        const projectName = req.params.name;

        const projectsInfo = await db.collection("Projects").findOne({ name: projectName });
        res.status(200).json(projectsInfo);
    }, res)

})

app.post('/api/projects/:name/upvote', (req, res) => {
    const projectName = req.params.name;

    projectsInfo[projectName].upvotes += 1;
    res.status(200).send(`${projectName} now has ${projectsInfo[projectName].upvotes} upvotes!`);
});

app.post('/api/projects/:name/add-comment', (req, res) => {
    const { username, text } = req.body;
    const projectName = req.params.name;
    withDB(async (db) => {
        const projectInfo = await db.collection('Projects').findOne({ name: projectName });
        await db.collection('Projects').updateOne({ name: projectName }, {
            '$set': {
                comments: projectInfo.comments.concat({ username, text }),
            },
        });
        const updatedprojectInfo = await db.collection('Projects').findOne({ name: projectName });

        res.status(200).json(updatedprojectInfo);
    }, res);

});
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/build/index.html"));
})
app.listen(8000, () => console.log('Listening on port 8000'));