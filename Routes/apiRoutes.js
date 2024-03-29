const filters = require('../Utils/filters');
const submissions = require('../Utils/submissions');
const curatedPlace = require('../Models/curatedPlace');
const oldPlace = require('../Models/oldPlace');
const halloweenPlace = require('../Models/halloweenPlace');

module.exports = (app) => {
    app.get("/api/placeData/:placeId", async (req, res) => {
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

    app.get("/api/getCuratedPlace/", async (req, res) => {
        const data = await filters.getCuratedPlace(req.query.details || false);
        res.json(data);
    });

    app.get("/api/getOldPlace/", async (req, res) => {
        const data = await filters.getOldPlace(req.query.details || false);
        res.json(data);
    });

    app.get("/api/getAnimePlace/", async (req, res) => {
        const data = await filters.getAnimePlace(req.query.details || false);
        res.json(data);
    });

    app.get("/api/getHalloweenPlace/", async (req, res) => {
        const data = await filters.getHalloweenPlace(req.query.details || false);
        res.json(data);
    });

    app.post("/api/getFavPlace/", async (req, res) => {
        const data = await filters.getFavGame(req.body, req.query.details || false);
        res.json(data);
    });

    app.post("/api/admin/curated", async ({ body }, res) => {
        const success = await submissions.submit(curatedPlace, body.placeId);

        if (success) {
            res.send("PAYLOAD DELIVERED. Nice work busting into their mainframe");
        } else {
            res.send("You've failed. Try again");
        };
    });

    app.post("/api/admin/old", async ({ body }, res) => {
        const success = await submissions.submit(oldPlace, body.placeId);

        if (success) {
            res.send("PAYLOAD DELIVERED. Nice work busting into their mainframe");
        } else {
            res.send("You've failed. Try again");
        };

    });

    app.post("/api/admin/halloween", async ({ body }, res) => {
        const success = await submissions.submit(halloweenPlace, body.placeId);

        if (success) {
            res.send("PAYLOAD DELIVERED. Nice work busting into their mainframe");
        } else {
            res.send("You've failed. Try again");
        };

    });
};

//Place Roulette: 1447149383