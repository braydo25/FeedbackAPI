/*
 * Route: /users
 */

const fs = require('fs');
const UserModel = rootRequire('/models/UserModel');
const userAuthorize = rootRequire('/middlewares/users/authorize');
const awsHelpers = rootRequire('/libs/awsHelpers');

const router = express.Router({
  mergeParams: true,
});

/*
 * POST
 */

router.post('/', asyncMiddleware(async (request, response) => {
  const { email, password } = request.body;

  if (!email) {
    throw new Error('An email must be provided');
  }

  let user = await UserModel.findOne({
    where: { email },
  });

  if (user && !(await user.validatePassword(password))) {
    return response.respond(403, 'Wrong password for this account.');
  }

  if (!user) {
    user = await UserModel.create({ email });
  }

  response.success(user);
}));

/*
 * PATCH
 */

router.patch('/me', userAuthorize);
router.patch('/me', asyncMiddleware(async (request, response) => {
  const { user, files } = request;
  const { name, password, preferredGenreIds, viewedNotificationsAt } = request.body;
  const avatarFile = (files && files.avatar) ? files.avatar : null;
  const data = {
    name: name || user.name,
    password,
    preferredGenreIds: preferredGenreIds || user.preferredGenreIds,
    viewedNotificationsAt: viewedNotificationsAt || user.viewedNotificationsAt,
  };

  if (avatarFile && avatarFile.mimetype.includes('image/')) {
    const avatarReadStream = fs.createReadStream(avatarFile.tempFilePath);

    data.avatarUrl = await awsHelpers.uploadToS3(avatarReadStream, avatarFile.name);

    fs.unlink(avatarFile.tempFilePath, error => console.log(error)); // cleanup
  }

  await user.update(data);

  response.success(user);
}));

/*
 * Export
 */

module.exports = router;
