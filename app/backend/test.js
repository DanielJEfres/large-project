import express from 'express'

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.post('/signup', async (req, res) => {
    const output = req.body;
    console.log(output);

    res.send({
      "received": output
    });
});

app.listen(8000, () => {
  console.log(`Example app listening on port ${8000}`)
})