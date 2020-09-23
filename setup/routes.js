const gameRouter = rootRequire('/routes/game');
const healthRouter = rootRequire('/routes/health');
const tracksRouter = rootRequire('/routes/tracks');
const trackCommentsRouter = rootRequire('/routes/tracks/comments');
const usersRouter = rootRequire('/routes/users');

module.exports = app => {
  // API Route Definitions
  app.use('/game', gameRouter);
  app.use('/health', healthRouter);
  app.use('/tracks/:trackId?', tracksRouter);
  app.use('/tracks/:trackId/comments/:trackCommentId?', trackCommentsRouter);
  app.use('/users', usersRouter);

  // Handle Various Errors
  app.use((error, request, response, next) => {
    if (error instanceof Sequelize.ValidationError) {
      return response.error(error.errors[0].message);
    }

    response.error(error.message);
  });

  // Handle Nonexistent Routes
  app.use((request, response) => {
    response.respond(404, `${request.method} request for ${request.url} is not valid.`);
  });
};
