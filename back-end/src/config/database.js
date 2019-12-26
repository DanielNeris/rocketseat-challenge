module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gydb',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
