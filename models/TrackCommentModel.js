/*
 * Model Definition
 */

const TrackCommentModel = database.define('trackComment', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = TrackCommentModel;
