const path = require('path');

module.exports = (app) => {
    app.get("/admin", (req, res) => {
        res.sendFile(path.join(__dirname, "../Public/html/admin.html"));
    });
};