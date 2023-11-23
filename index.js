import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";




let __dirname = dirname(fileURLToPath(import.meta.url));
let app = express();
let port = 3000;
let posts = [];
var nextId = 1;

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended: true}))

// function findPostById(postId){
//     return posts.find(post => post.id === parseInt(postId))
// }
app.get("/", (req, res)=> {
    res.render("index.ejs", {posts: posts})
})

app.get("/create", (req, res)=> {
    res.render("create.ejs")
})


app.get("/views/:id", (req, res) => {
    let {id} = req.params
    let myPost = posts.find(c => c.id === parseInt(id))
    console.log("post found", myPost);
    res.render("view.ejs", { post: myPost, postTitle: myPost.postTitle, postContent: myPost.postContent });
});

app.get("/edit/:id", (req, res) => {
    let { id } = req.params;
    let editPost = posts.find((post) => post.id === parseInt(id));

    if (editPost) {
        res.render("update.ejs", { myPost: editPost, postTitle: editPost.postTitle, postContent: editPost.postContent });
    } else {
        // Handle the case where the post with the specified id is not found
        res.status(404).send("Post not found");
    }
});

app.post("/update", (req, res) => {
    let { title, content } = req.body;
    let {postId} = req.body;

    let postIndex = posts.findIndex((post=> post.id === parseInt(postId)));
    if(postIndex !== -1){
        posts[postIndex].postTitle = title
        posts[postIndex].postContent = content
        res.redirect("/")
    } else{
        res.status(404).send("post not found")
    }
});

app.post("/create", (req, res)=> {
    let {title, content} = req.body;
    let newPost = { id: nextId++, postTitle:title, postContent: content}
    posts.push(newPost)
    res.redirect("/")
})

app.post("/delete/",(req, res)=> {
    let  {postId} = req.body;

    let postIndex = posts.findIndex(post => post.id === parseInt(postId))

    if(postIndex !== -1){
        posts.splice(postIndex, 1)
    }

    res.redirect("/")
})

posts.push({
    id: nextId++,
    postTitle: "this is wokring",
    postContent: "lets see what i get back"
})

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})