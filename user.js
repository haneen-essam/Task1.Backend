const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "user",
  tableName: "users",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
      unique: true,
    },
    email: {
      type: "varchar",
      unique: true,
    },
  },
});