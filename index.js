const express = require("express");
const Datastore = require("nedb");

const app = express();

app.listen(3000, () => console.log("listening on port 3000"))
app.use(express.static("pages"));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

app.post('/api', (req, res) => {
  const data = req.body;

  database.find({_id: data._id}, (err, snapshot) => {
    if(err || !snapshot.length){
      console.log("creating new clip...");
      data['likes'] = '0';
      database.insert(data);
      res.json(data);
      res.end();
      return;
    }
    if(snapshot !== []){
      database.update(
        {_id: data._id},
        {$set: data},
        {},
        function (err, replaced){}
      );
    }
  });


});

app.get("/api", (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }
    res.json(data);
  })
})
