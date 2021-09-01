const filters = require('../Utils/filters');

module.exports = (app) => {

    app.get("/api/test", (req, res) => {
        console.log('got the test')
        res.send("Test Successful")
    });

    app.get("/api/placeData/:placeId", async (req, res) => {
        try {
            const data = await filters.getPlaceInfo(req.params.placeId);
            res.json(data);
        } catch (error) {
            res.send("Could not find that Place!");
        }

    });

    app.get("/api/getPlace/", async (req, res) => {
        const data = await filters.getPlace(req.query.visit, req.query.date);
        console.log(data);
    });
}