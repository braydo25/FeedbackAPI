const UserModel = rootRequire('/models/UserModel');

/*
 * Model Definition
 */

const TrackCommentModel = database.define('trackComment', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  trackId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  time: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  scopes: {
    withUser: {
      include: [ { model: UserModel.scope('trackUser') } ],
    },
  },
});

/*
 * Export
 */

module.exports = TrackCommentModel;
