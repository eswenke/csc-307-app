import express from "express";
import cors from "cors";

import userServices from "./models/user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const name = req.query["name"];
  const job = req.query["job"];
  try {
    const result = await userServices.getUsers(name, job);
    res.send({ users_list: result });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error ocurred in the server.");
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await userServices.findUserById(id);
  if (result === undefined || result === null)
    res.status(404).send("Resource not found.");
  else {
    res.send({ users_list: result });
  }
});

app.get("/users/:name/:job", async (req, res) => {
  const name = req.params.name;
  const job = req.params.job;

  const result = await userServices.findUserByNameAndJob(name, job);

  if (result === undefined || result === null) {
    res.status(404).send("Resource not found.");
  } else {
    res.send({ users_list: result });
  }
});

app.post("/users", async (req, res) => {
  const user = req.body;
  const savedUser = await userServices.addUser(user);
  if (savedUser) res.status(201).send(savedUser);
  else res.status(500).end();
});

// app.delete("/users/:id", async (req, res) => {
//   const id = req.params.id;
//   const result = await userServices.deleteUserById(id);
//   if (result === undefined || result === null)
//     res.status(404).send("Resource not found.");
//   else {
//     res.status(204).send();
//   }
// });

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  console.log(req.params.id);

  try {
    const deletedUser = await userServices.deleteUserById(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(204).send(); // 204 for successful deletion with no content
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
