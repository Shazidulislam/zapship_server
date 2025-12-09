const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
app.use(cors());
app.use(express.json());

const uri = `${process.env.MONGO_URI}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("zapShiftBD");
    const parcelCollection = db.collection("sendParcel");

    app.post("/parcels", async (req, res) => {
      try {
        const newParcle = req.body;
        const result = await parcelCollection.insertOne(newParcle);
        res.status(201).send(result);
      } catch (error) {
        console.log("Error inserting parcel:", error);
        res.status(500).send({ message: "Faild to create parcel" });
      }
    });

    // //GET: All parcels OR parcels by user (created_by), sorted by Latest
    // app.get("/parcels" , async(req , res)=>{
    //     const userEmail = req.query.email;

    //     const query = userEmail?{createdByEmail:userEmail}:{};
    //     const options = {
    //         sort:{createdAt:-1 }
    //     }
    // })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Our zafship store monster here");
});

app.listen(port, () => {
  console.log(`Our zapship server runing at port ${port}`);
});
