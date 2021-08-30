module.exports = (app, noblox) => {

    app.get("/api/test", (req, res) => {
        console.log('got the test')
        res.send("Test Successful")
    });

    app.get("/api/placeData/:placeId", async (req, res) => {
        const placeInfo = await noblox.getPlaceInfo(req.params.placeId);
        res.json(placeInfo);
    });
}