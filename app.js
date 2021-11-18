const express = require("express");
const app = express();
const {sequelize, User, Post} = require("./models");

app.use(express.json());

app.post("/users", async (req, res) => {
  const {name, email, role} = req.body;
  try {
    const user = await User.create({name, email, role});
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.json({success: false, statusCode: 500, msg: error});
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.json({success: false, statusCode: 500, msg: error});
  }
});

app.get("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await User.findOne({
      where: {uuid},
      include: "post",
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.json({success: false, statusCode: 500, msg: error});
  }
});

app.put("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  const {name, email, role} = req.body;
  try {
    const user = await User.findOne({
      where: {uuid},
    });
    user.name = name;
    user.email = email;
    user.role = role;
    await user.save();
    return res.json({user});
  } catch (error) {
    console.log(error);
    return res.json({success: false, statusCode: 500, msg: error});
  }
});

app.delete("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await User.findOne({
      where: {uuid},
    });
    await user.destroy();
    return res.json({msg: "User deleted"});
  } catch (error) {
    console.log(error);
    return res.json({success: false, statusCode: 500, msg: error});
  }
});

app.post("/posts", async (req, res) => {
  const {body, userUuid} = req.body;
  try {
    const user = await User.findOne({where: {uuid: userUuid}});
    const post = await Post.create({body, userId: user.id});
    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.json({success: false, statusCode: 500, msg: error});
  }
});

app.get("/posts", async (req, res) => {
  try {
    // const posts = await Post.findAll({ include: [User] });
    const posts = await Post.findAll({include: [{model: User, as: "user"}]});

    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.json({success: false, statusCode: 500, msg: error});
  }
});

app.get("/posts/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const post = await Post.findOne({
      where: {uuid},
    });

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.json({success: false, statusCode: 500, msg: error});
  }
});

app.put("/posts/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  const {body} = req.body;
  try {
    const post = await Post.findOne({
      where: {uuid},
    });
    post.body = body;
    await post.save();
    return res.json({post});
  } catch (error) {
    console.log(error);
    return res.json({success: false, statusCode: 500, msg: error});
  }
});

app.delete("/posts/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const post = await Post.findOne({
      where: {uuid},
    });
    await post.destroy();
    return res.json({msg: "Post deleted"});
  } catch (error) {
    console.log(error);
    return res.json({success: false, statusCode: 500, msg: error});
  }
});

app.listen({port: 3000}, async () => {
  console.log("sever is running on port 3000");
  // await sequelize.sync({ force: true });
  await sequelize.authenticate();
  console.log("DB connected!");
});
