const CommonMiddleware = require("../utils/router/CommonMiddleware");
const ApiRouter = require("./routes/api/ApiRouter");
const AuthRouter = require("./routes/auth/AuthRouter");

module.exports = function setupRoutes(app) {
    // metrics routes
    // app.useRouteMiddleware("/metrics", CommonMiddleware.getInstance().metricsHandler);
    // app.useRouteMiddleware("/debug-stats", CommonMiddleware.getInstance().debugStatsHandler);

    // hetso api routes
    app.useRouter("/api", new ApiRouter());
    app.useRouter("/auth", new AuthRouter());


    // error middleware
    app.useMiddleware(CommonMiddleware.getInstance().error404Handler);
    app.useMiddleware(CommonMiddleware.getInstance().errorPageHandler);
}