const bcrypt = require('bcrypt');

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
  },
  avatarUrl: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
  },
  preferredGenreIds: {
    type: Sequelize.JSON,
  },
});

/*
 * Hooks
 */

UserModel.addHook('beforeCreate', hashPassword);
UserModel.addHook('beforeUpdate', hashPassword);

async function hashPassword(instance) {
  if (!instance.changed('password') || !instance.password) {
    return;
  }

  instance.set('password', await bcrypt.hash(instance.password, 8));
}

/*
 * Instance Methods
 */

UserModel.prototype.validatePassword = async function(password) {
  if (!this.password) {
    return true;
  }

  return bcrypt.compare(password, this.password);
};

UserModel.prototype.toJSON = function() {
  const values = { ...this.get() };

  delete values.password;

  return values;
};

/*
 * Export
 */

module.exports = UserModel;
