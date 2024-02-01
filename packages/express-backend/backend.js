import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

function generateID() {
  const id = Math.floor(Math.random() * 10000);
  return id.toString();
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const job = req.query.job;
  const name = req.query.name;

  let result = findUserByName(name);
  result = { users_list: result };
  let new_result = findUserByJob(job);

  if (new_result === undefined) {
    res.send(users);
  } else {
    res.send(new_result);
  }
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  let result = addUser(userToAdd);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(201).send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const result = deleteUser(userId);
  if (result.Terminated) {
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const findUserByJob = (job) =>
  users["users_list"].find((user) => user["job"] === job);

const addUser = (user) => {
  const randomId = generateID();
  user.id = randomId;
  users["users_list"].push(user);
  return user;
};

const deleteUser = (userId) => {
  if (userId !== -1) {
    const deleted = users["users_list"].splice(userId, 1)[0];
    return { Terminated: true, deleted };
  } else {
    return { success: false };
  }
};
