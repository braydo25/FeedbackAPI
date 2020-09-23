const TrackCommentModel = rootRequire('/models/TrackCommentModel');
const TrackModel = rootRequire('/models/TrackModel');
const UserDeviceModel = rootRequire('/models/UserDeviceModel');
const UserModel = rootRequire('/models/UserModel');

TrackModel.hasMany(TrackCommentModel);

TrackCommentModel.belongsTo(UserModel);

UserModel.hasMany(UserDeviceModel);

module.exports = database.sync();