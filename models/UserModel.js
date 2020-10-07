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
  exp: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  preferredGenreIds: {
    type: Sequelize.JSON,
  },
}, {
  scopes: {
    trackUser: () => ({
      attributes: [
        'id',
        'avatarUrl',
        'name',
      ],
    }),
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

  if (instance.password.length < 8) {
    throw new Error('Your password must be at least 8 characters long.');
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

  if (!password) {
    return false;
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
