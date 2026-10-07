const { DataSource } = require('typeorm');
const Note = require('./notes');
const User = require('./user');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Blueberry_29',
  database: 'new_app',
  synchronize: true,
  logging: false,
  entities: [Note, User],
  migrations: [],
  subscribers: [],
});

module.exports = AppDataSource;