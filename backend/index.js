const express = require('express')
const http = require("http");
const { Server } = require("socket.io");
const expressAsyncHandler = require('express-async-handler');
var cors = require('cors');
const cloudinary = require('cloudinary').v2;
const Post = require("./Models/postModel")
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
const connectDB = require('./config/db');
connectDB();

const { storage } = require('./config/storage');
const multer = require('multer');
const upload = multer({ storage });

const io = new Server(server, {
    cors: {},
});

app.post('/upload', upload.single('image'), async (req, res) => {
    const { Description, title } = req.body;
    await cloudinary.uploader.upload(req.file.path, { folder: 'InternProject' }, async function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Error"
            })
        } else {
            if (result.secure_url != undefined) {
                var postData = {
                    ImageUrl: result.url,
                    Description: Description,
                    title: title
                }
                try {
                    const newPost = await Post.create(postData);
                    await Post.findOne({ _id: newPost._id }).then(async (result) => {
                        res.status(200).send(result)
                    });
                } catch (error) {
                    res.sendStatus(400);
                    throw new Error(error);
                }
            } else {
                return res.status(400);
            }
        }
    })
});

app.get('/all', async (req, res) => {
    const Allpost = await Post.find();
    res.send(Allpost);
})

app.get('/singlePost/:postId', async (req, res) => {
    const SinglePost = await Post.findById(req?.params?.postId);
    res.send(SinglePost);
})

app.put('/increase/:postId', async (req, res) => {
    const post = await Post.findByIdAndUpdate(req?.params?.postId, { $push: { likes: "new like" } }, { new: true });
    const posts = await Post.find();
    io.emit('add-like', posts);
    res.status(200).json({
        success: true,
        post
    })

})

app.put('/addComment/:postId', async (req, res) => {
    const post = await Post.findByIdAndUpdate(req?.params?.postId, { $push: { comments: req?.body?.comment } }, { new: true });
    const posts = await Post.find();
    io.emit('add-comment', posts);
    io.emit('indivisual-post-comment', post)
    res.status(200).json({
        success: true,
        post
    })
})

io.on("connection", (socket) => {
    socket.on('comment', (msg) => {
        io.emit("new-comment", msg);
    })
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});