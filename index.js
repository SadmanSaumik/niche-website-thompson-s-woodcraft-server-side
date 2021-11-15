const express = require("express");
var cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

//mongoDB Uri

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wnynm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Database");
    const database = client.db("thompsonwoodcraft");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");

    //GET Products
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    //Get Single Product
    app.get("/products/:id", async (req, res) => {
      //console.log(req.params.id);
      const cursor = await productCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      //const result = await cursor.toArray();
      res.send(cursor);
    });

    //GET Order By Email

    app.get("/orders/:email", async (req, res) => {
      //console.log(req.params.email);
      const cursor = orderCollection.find({ email: req.params.email });
      const result = await cursor.toArray();
      res.send(result);
      //const result = await cursor.toArray();
    });

    //Get All Reviews

    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //POST Order
    app.post("/orders", async (req, res) => {
      const result = await orderCollection.insertOne(req.body);
      console.log(result);
      res.json(result);
    });

    ////POST Review
    app.post("/reviews", async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);
      res.json(result);
    });
  } finally {
    //await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hi, Hello from node");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
