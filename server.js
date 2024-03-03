import express, { json, request } from "express";
import { users, posts } from "./data.js";
import { v4 as uuidv4 } from "uuid";

const app = express();

/*GET*/

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(401).send({
      message: "User Not Found!",
      success: false,
      data: null,
    });
  } else {
    res.status(200).send({
      message: "User Is Found!",
      success: true,
      data: user,
    });
  }
});

app.get("/users/post/userId/:id", (req, res) => {
  const { id } = req.params;
  const postList = posts.filter((item) => item.userId === id);
  if (!postList) {
    res.status(401).send({
      message: "Post Not Found!",
      success: false,
      data: null,
    });
  } else {
    res.status(200).send({
      message: "Post Is Found!",
      success: true,
      data: postList,
    });
  }
});

app.get("/users/post/public", (req, res) => {
  const postList = posts.filter((item) => item.isPublic === true);
  res.status(200).send(postList);
});

app.get("/users/posts/content", (req, res) => {
  const queryParams = req.query;

  const postOfContent = posts.filter(
    (item) => item.content === queryParams.content
  );

  if (!postOfContent) {
    res.status(401).send({
      message: "Post Not Found!",
      success: false,
      data: null,
    });
  } else {
    res.status(200).send({
      message: "Post Is Found!",
      success: true,
      data: postOfContent,
    });
  }
});

const validate = email => {
  const expression = /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/i
  return expression.test(String(email).toLowerCase())
}

/*POST*/ app.use(express.json());
app.post("/users/create", (req, res) => {
  const body = req.body;
 
  if( validate(body.email) == true){
    const checkEmail = users.find((user) => user.email === body.email);

    if (!checkEmail) {
      users.push({
        id: uuidv4(),
        userName: body.userName,
        email: body.email,
        age: body.age,
        avatar: body.avatar,
      });
      res.status(200).send({
        message: "Create Success!!!",
        success: true,
        data: users[users.length - 1],
      });
    } else {
      res.status(400).send({
        message: "Email already exist",
        success: false,
        data: null,
      });
    }
  }else{
    res.status(400).send({
      message: "Email Invalid!!!",
      success: false,
      data: null,
    });
  }

  
});

app.post("/users/create-post/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;

  posts.push({
    userId: id,
    postId: uuidv4(),
    content: body.content,
    createdAt: body.createdAt,
    isPublic: body.isPublic,
  });
  const newPost = posts.filter((post) => post.userId === id);
  res.status(200).send({
    message: "Create Success!!!",
    success: true,
    data: newPost[newPost.length - 1],
  });
});

/*PUT*/
app.put("/users/update-post/:postId", (req, res) => {
  const { postId } = req.params;
  const newInfor = req.body;
  const currentPost = posts.find((item) => item.postId === postId);
  if (!currentPost) {
    res.status(401).send({
      message: "Post Not Found!",
      success: false,
      data: null,
    });
  } else {
    for (const key in newInfor) {
      currentPost[key] = newInfor[key];
    }
    res.status(200).send({
      message: "Post Is Found!",
      success: true,
      data: currentPost,
    });
  }
});

/*DELETE*/
app.delete("/users/delete/post/:postId", (req, res) => {
  const { postId } = req.params;
  const postIndex = posts.findIndex((item) => item.postId === postId);
  if (!postIndex) {
    res.status(401).send({
      message: "Post Not Found!",
      success: false,
      data: null,
    });
  } else {
    posts.splice(postIndex, 1);

    res.status(200).send({
      message: "Post Is Found!",
      success: true,
      data: posts,
    });
  }
});

app.listen(8080, () => {
  console.log("Server is running!!!");
});
