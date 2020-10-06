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
 * Hooks
 */

TrackPlayModel.addHook('afterCreate', async (trackPlay, options) => {
  const TrackModel = database.models.track;

  await TrackModel.update({ totalPlays: database.literal('totalPlays + 1') }, {
    where: { id: trackPlay.trackId },
    transaction: options.transaction,
  });
});

TrackPlayModel.addHook('afterDestroy', async (trackPlay, options) => {
  const TrackModel = database.models.track;

  await TrackModel.update({ totalPlays: database.literal('totalPlays - 1') }, {
    where: { id: trackPlay.trackId },
    transaction: options.transaction,
  });
});

/*
 * Export
 */

module.exports = TrackPlayModel;