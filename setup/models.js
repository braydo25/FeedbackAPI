const GenreModel = rootRequire('/models/GenreModel');
const NotificationModel = rootRequire('/models/NotificationModel');
const TrackCommentModel = rootRequire('/models/TrackCommentModel');
const TrackPlayModel = rootRequire('/models/TrackPlayModel');
const TrackModel = rootRequire('/models/TrackModel');
const UserDeviceModel = rootRequire('/models/UserDeviceModel');
const UserModel = rootRequire('/models/UserModel');

NotificationModel.belongsTo(TrackCommentModel);

TrackPlayModel.belongsTo(UserModel);
TrackPlayModel.belongsTo(TrackModel);

TrackModel.belongsTo(GenreModel);
TrackModel.belongsTo(UserModel);
TrackModel.hasMany(TrackCommentModel);

TrackCommentModel.belongsTo(TrackModel);
TrackCommentModel.belongsTo(UserModel);

UserModel.hasMany(NotificationModel);
UserModel.hasMany(UserDeviceModel);

module.exports = database.sync({ force: true });