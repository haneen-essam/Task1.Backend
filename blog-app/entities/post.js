const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "post",
    tableName: "posts",
    columns: {
        id: { primary: true, type: "int", generated: true },
        title: { type: "varchar" },
        content: { type: "text" }
    },
    relations: {
        author: {
            type: "many-to-one",
            target: "user",
            joinColumn: { name: "authorId" },
            onDelete: "CASCADE"
        }
    }
});