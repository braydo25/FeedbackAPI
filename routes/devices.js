/*
 * Route: /devices
 */

const UserDeviceModel = rootRequire('/models/UserDeviceModel');
const userAuthorize = rootRequire('/middlewares/users/authorize');

const router = express.Router({
  mergeParams: true,
});

/*
 * PUT
 */

router.put('/', userAuthorize);
router.put('/', asyncMiddleware(async (request, response) => {
  const userId = request.user.id;
  const { uuid, details, apnsToken, fcmRegistrationId } = request.body;
  const ip = (request.headers['X-Forwarded-For'])
    ? request.headers['X-Forwarded-For'].split(',')[0]
    : request.connection.remoteAddress;

  if (!uuid) {
    throw new Error('idfv must be provided.');
  }

  const existingUserDevice = await UserDeviceModel.findOne({ where: { uuid } });

  if (existingUserDevice) {
    await existingUserDevice.update({
      userId,
      ip,
      details: details || existingUserDevice.details,
      apnsToken: (apnsToken !== undefined) ? apnsToken : existingUserDevice.apnsToken,
      fcmRegistrationId: (fcmRegistrationId !== undefined) ? fcmRegistrationId : existingUserDevice.fcmRegistrationId,
    });
  } else {
    await UserDeviceModel.create({ userId, uuid, ip, details, apnsToken, fcmRegistrationId });
  }

  response.success();
}));

/*
 * Export
 */

module.exports = router;
