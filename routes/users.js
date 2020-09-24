/*
 * Route: /users
 */

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
    throw new Error('An email address must be provided');
  }

  let user = await UserModel.findOne({
    where: { email },
  });

  if (user && !(await user.validatePassword(password))) {
    throw new Error('Invalid password provided.');
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
  const { name, password } = request.body;
  const avatar = (files && files.avatar) ? files.avatar : null;

  let avatarUrl = user.avatarUrl;

  if (avatar && avatar.mimetype.includes('image/')) {
    avatarUrl = await awsHelpers.uploadFileToS3(avatar.data, avatar.name);
  }

  await user.update({
    avatarUrl,
    password,
    name: name || user.name,
  });

  response.success(user);
}));

/*
 * Export
 */

module.exports = router;
