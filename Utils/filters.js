const noblox = require('noblox.js');

const generatePlaceId = () => {
    const placeId = Math.floor(Math.random() * 7317738139);
    if (placeId >= 3000) {
        return placeId;
    } else {
        return generatePlaceId();
    };
};

const getMassPlaceData = async (numPlaces) => {
    let placeIds = [];
    for (let i = 0; i < numPlaces; i++) {
        placeIds.push(generatePlaceId());
    };

    const placeData = placeIds.map(async (id) => {
        try {
            const data = await noblox.getPlaceInfo(id);
            return data;
        } catch (error) {
            return null;
        }
    });

    return Promise.all(placeData);
};

const checkVisit = (data, min = 1, max = 100000000) => {
    if (data.VisitedCount >= min && data.VisitedCount < max) {
        return true;
    };
    return false;
};

const checkUpdate = ({ Created, Updated }) => {
    const created = new Date(Created);
    const updated = new Date(Updated);

    if (created.valueOf() != updated.valueOf()) {
        return true;
    };
    return false;
};

const checkPlaceValidity = (rawData, visitFilter = 0, dateFilter = false) => {
    const data = rawData;
    let visitVerified = false;
    let dateVerified = false;

    if (visitFilter == 1) {
        if (checkVisit(data, 1, 1000)) {
            visitVerified = true;
            console.log("Found a game with visits between 1 and 10000");
        };
    } else if (visitFilter == 2) {
        if (checkVisit(data, 1000, 10000)) {
            visitVerified = true;
            console.log("Found a game with visits between 10000 and 1000000");
        };
    } else if (visitFilter == 3) {
        if (checkVisit(data, 10000)) {
            visitVerified = true;
            console.log("Found a game with visits between 10000 and Big Chungus");
        };
    } else {
        if (checkVisit(data)) {
            visitVerified = true
            console.log("Found a game with more than 1 visit!");
        };
    };

    if (dateFilter) {
        if (checkUpdate(data)) {
            dateVerified = true;
            console.log('Found game that has been updated');
        };
    } else { dateVerified = true };

    if (visitVerified && dateVerified) {
        return true;
    }
    return false;
};

const filters = {

    test: async () => {
        const data = await getMassPlaceData(50);
        console.log(data);
    },

    getPlaceInfo: async (placeId) => {
        const data = await noblox.getPlaceInfo(placeId)
        return data;
    },

    getPlace: async (visitFilter = 0, dateFilter = false) => {
        const backupVisit = visitFilter;
        const backupDate = dateFilter;
        const placeId = generatePlaceId();

        try {
            const data = await noblox.getPlaceInfo(placeId);
            const isValid = checkPlaceValidity(data, visitFilter, dateFilter);

            if (isValid) {
                console.log("Place is Valid! Nice Work!");
                return placeId;
            } else {
                console.log("Checking for a new place, That one sucked.");
                return await filters.getPlace(backupVisit, backupDate);
            };

        } catch (error) {
            return await filters.getPlace(backupVisit, backupDate);
        };
    }
};

module.exports = filters;