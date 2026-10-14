require("dotenv").config();
const express = require("express");
const AppDataSource = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));

app.get("/", (req, res) => {
    res.send("Blog API is running");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server error" });
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
    })
    .catch((err) => console.error("Error during Data Source initialization:", err));