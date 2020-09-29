/*
 * Model Definition
 */

const UserDeviceModel = database.define('userDevice', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  uuid: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ip: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  details: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  apnsSnsArn: {
    type: Sequelize.STRING,
  },
  apnsToken: {
    type: Sequelize.STRING,
    unique: true,
  },
  fcmSnsArn: {
    type: Sequelize.STRING,
  },
  fcmRegistrationId: {
    type: Sequelize.STRING,
    unique: true,
  },
});

/*
 * Export
 */

module.exports = UserDeviceModel;