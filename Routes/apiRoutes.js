const filters = require('../Utils/filters');

module.exports = (app) => {
    app.get("/api/test", async (req, res) => {
        console.log('got the test')
        res.send("Test Successful");
    });

    app.get("/api/placeData/:placeId", async (req, res) => {
        console.log(`Getting place data for: ${req.params.placeId}`);
        try {
            const data = await filters.getPlaceInfo(req.params.placeId);
            res.json(data);
        } catch (error) {
            res.send("Could not find that Place!");
        };
    });

    app.get("/api/getPlace/", async (req, res) => {
        console.log("Getting random place");
        const data = await filters.getPlace(req.query.visit || 0, req.query.date || false, req.query.details);
        res.json(data);
    });

    app.get("/api/getPopPlace/", async (req, res) => {
        console.log("Getting random popular place");
        const data = await filters.getPopularPlace(req.query.details || false);
        res.json(data);
    });

    app.get("/api/getRandFavPlace/", async (req, res) => {
        console.log("Getting expiremental random place");
        const data = await filters.getRandFavGame(req.query.details || false);
        res.json(data);
    });
};