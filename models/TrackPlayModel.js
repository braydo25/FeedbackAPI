/*
 * Model Definition
 */

const TrackPlayModel = database.define('trackPlay', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  trackId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  duration: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = TrackPlayModel;