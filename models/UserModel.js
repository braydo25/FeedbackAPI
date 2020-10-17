const bcrypt = require('bcrypt');
const awsHelpers = rootRequire('/libs/awsHelpers');

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
    validate: {
      isIntegerArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Invalid preferred genre ids provided.');
        }

        value.forEach(genreId => {
          if (!Number.isInteger(genreId)) {
            throw new Error('Genre ids must be integers.');
          }
        });
      },
    },
  },
  totalTracks: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  viewedNotificationsAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
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
UserModel.addHook('afterCreate', sendEmails);

async function hashPassword(instance) {
  if (!instance.changed('password') || !instance.password) {
    return;
  }

  if (instance.password.length < 8) {
    throw new Error('Your password must be at least 8 characters long.');
  }

  instance.set('password', await bcrypt.hash(instance.password, 8));
}

async function sendEmails(instance) {
  awsHelpers.sendEmail({
    toEmail: instance.email,
    fromEmail: 'Soundhouse@soundhouseapp.com',
    subject: 'Welcome to Soundhouse! Join our Discord community!',
    bodyHtml: 'Welcome to Soundhouse, we’re glad you’ve joined!<br /><br />' +
              'We believe no matter your musical skill level or fanbase size, you deserve an opportunity for your music to be heard, an opportunity to improve, and an opportunity to grow as an artist.<br /><br />' +
              'We’re inviting you to our exclusive community on Discord where you can give feedback and help influence the future of Soundhouse and the features it offers while connecting with other musicians and producers.<br /><br />' +
              '<a href="https://discord.gg/EqnqwvM">Click Here To Join The Soundhouse Community</a>',
  });
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
