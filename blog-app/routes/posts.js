const express = require("express");
const AppDataSource = require("../db");
const authenticateToken = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");

const router = express.Router();
const posts = () => AppDataSource.getRepository("post");

const publicSelect = {
    id: true,
    title: true,
    content: true,
    author: { id: true, email: true }
};


router.get("/", async (req, res, next) => {
    try {
        const all = await posts().find({
            relations: { author: true },
            select: publicSelect
        });
        res.json(all);
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const post = await posts().findOne({
            where: { id: parseInt(req.params.id) },
            relations: { author: true },
            select: publicSelect
        });
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (error) {
        next(error);
    }
});


router.post("/", authenticateToken, async (req, res, next) => {
    try {
        const { title, content } = req.body || {};
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }
        const saved = await posts().save(
            posts().create({ title, content, author: { id: req.user.id } })
        );
        res.status(201).json({ id: saved.id, title: saved.title, content: saved.content });
    } catch (error) {
        next(error);
    }
});


router.put("/:id", authenticateToken, isOwner, async (req, res, next) => {
    try {
        const { title, content } = req.body || {};
        if (title) req.post.title = title;
        if (content) req.post.content = content;
        await posts().save(req.post);
        res.json({ id: req.post.id, title: req.post.title, content: req.post.content });
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", authenticateToken, isOwner, async (req, res, next) => {
    try {
        await posts().remove(req.post);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;