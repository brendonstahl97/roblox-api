const filters = require('../Utils/filters');
const curatedPlace = require('../Models/curatedPlace');

module.exports = (app) => {
    app.get("/api/test", async (req, res) => {
        console.log('got the test')
        res.send("Test Successful");
    });

    app.post("/api/test", async (req, res) => {
        const data = await filters.getFavGame(req.body, req.query.details || false);
        console.log(data);
        res.json(data);
    });

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

    app.post("/api/getFavPlace/", async (req, res) => {
        const data = await filters.getFavGame(req.body, req.query.details || false);
        res.json(data);
    });

    app.post("/api/admin/curated", async ({ body }, res) => {
        try {
            const data = await filters.getPlaceInfo(body.placeId);

            const filter = { placeId: data.AssetId };
            const update = {
                name: data.Name,
                data: data
            };

            curatedPlace.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            }).then(dbTransaction => {
                console.log(dbTransaction)
                res.send("PAYLOAD DELIVERED. Nice work busting into their mainframe")
            }).catch(err => {
                console.log(err);
                res.send("You've failed. Try again")
            });

        } catch (error) {
            console.log(error);
        };
    });
};

//Place Roulette: 1447149383