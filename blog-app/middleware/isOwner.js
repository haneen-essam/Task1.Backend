const AppDataSource = require("../db");

async function isOwner(req, res, next) {
    try {
        const post = await AppDataSource.getRepository("post").findOne({
            where: { id: parseInt(req.params.id) },
            relations: { author: true }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.id !== req.user.id) {
            return res.status(403).json({ message: "This is not your post" });
        }

        req.post = post;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = isOwner;