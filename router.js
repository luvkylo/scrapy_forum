module.exports = app => {
    const application = require('./routes/application.js');
    app.use('/', application);

}