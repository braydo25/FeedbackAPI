/*
 * Model Definition
 */

const UserModel = database.define('user', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  accessToken: {
    type: Sequelize.UUID,
    unique: true,
    defaultValue: Sequelize.UUIDV4,
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: {
        msg: 'The email address you provided is invalid.',
      },
    },
  },
  password: {
    type: Sequelize.STRING,
    // TODO
  },
  avatarUrl: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
  },
});

/*
 * Export
 */

module.exports = UserModel;
