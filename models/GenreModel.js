/*
 * Model Definition
 */

const GenreModel = database.define('genre', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
}, {
  defaultScope: {
    attributes: [
      'id',
      'name',
      'description',
    ],
  },
});

/*
 * Export
 */

module.exports = GenreModel;