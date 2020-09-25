const GenreModel = rootRequire('/models/GenreModel');
const TrackCommentModel = rootRequire('/models/TrackCommentModel');
const TrackModel = rootRequire('/models/TrackModel');
const UserDeviceModel = rootRequire('/models/UserDeviceModel');
const UserModel = rootRequire('/models/UserModel');

TrackModel.belongsTo(GenreModel);
TrackModel.belongsTo(UserModel);
TrackModel.hasMany(TrackCommentModel);

TrackCommentModel.belongsTo(UserModel);

UserModel.hasMany(UserDeviceModel);

module.exports = database.sync({ force: true });