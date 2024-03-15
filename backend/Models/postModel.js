const mongoose = require("mongoose")


const postSchema = mongoose.Schema({
    ImageUrl: { type: String },
    title: { type: String, default: 'Title' },
    Description: { type: String, default: ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus deleniti distinctio consequatur veniam amet. Autem, possimus reiciendis.' },
    comments: { type: Array },
    likes: { type: Array },
}, { timestamps: true });


const Post = mongoose.model("Post", postSchema);
module.exports = Post;