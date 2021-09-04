const noblox = require('noblox.js');

//generate a random place ID based on Roblox criteria
const generatePlaceId = () => {
    const placeId = Math.floor(Math.random() * 7317738139);
    if (placeId >= 3000) {
        return placeId;
    } else {
        return generatePlaceId();
    };
};

//Get the data for a specified number of places via concurrent asynchronous api calls. !!!VERY FAST!!!
const getMassPlaceData = async (numPlaces) => {
    //Create holding array and generate specified number of placeIds
    let placeIds = [];
    for (let i = 0; i < numPlaces; i++) {
        placeIds.push(generatePlaceId());
    };

    //Iterate through IDs and get corresponding data from API
    const placeData = placeIds.map(async (id) => {
        try {
            const data = await noblox.getPlaceInfo(id);
            return data;
        } catch (error) {
            return null;
        }
    });

    //Ensure all promises are resolved concurrently
    return Promise.all(placeData);
};

//Check validity of the view count of a place based on specified max and min view count
const checkVisit = (data, min = 1, max = 100000000) => {
    if (data.VisitedCount >= min && data.VisitedCount < max) {
        return true;
    };
    return false;
};

//Check to ensure place has been updated at least one time
const checkUpdate = ({ Created, Updated }) => {
    const created = new Date(Created);
    const updated = new Date(Updated);

    if (created.valueOf() != updated.valueOf()) {
        return true;
    };
    return false;
};

//Apply all filters to data
const checkPlaceValidity = (rawData, visitFilter = 0, dateFilter = false) => {
    const data = rawData;
    let visitVerified = false;
    let dateVerified = false;

    //ensure data was actually returned
    if (data != null) {
        //Visit filter checks
        if (visitFilter == 1) {
            if (checkVisit(data, 1, 1000)) {
                visitVerified = true;
                console.log("Found a game with visits between 1 and 10000");
            };
        } else if (visitFilter == 2) {
            if (checkVisit(data, 1000, 10000)) {
                visitVerified = true;
                console.log("Found a game with visits between 1000 and 10000");
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

        //Date filter checks
        if (dateFilter) {
            if (checkUpdate(data)) {
                dateVerified = true;
                console.log('Found game that has been updated');
            };
        } else { dateVerified = true };

        //Final check to see if all filter criteria are met
        if (visitVerified && dateVerified) {
            return true;
        };
    };
    return false;
};


const filters = {
    //Get general place info from a given placeID
    getPlaceInfo: async (placeId) => {
        const data = await noblox.getPlaceInfo(placeId)
        return data;
    },

    //Find an eligable place based on specified filter info
    //VisitFilter: 0 = >1 view, 1 = between 1 and 1000 views, 2 = between 1000 and 10000 views, 3 = >10000 views
    //dateFilter: false = ignore update, true = ensure game has at least one update
    getPlace: async (visitFilter = 0, dateFilter = false, detailsFilter = false) => {
        //bakcup filter data for recursion
        const backupVisit = visitFilter;
        const backupDate = dateFilter;
        const backuptDetails = detailsFilter
        const massPlaceData = await getMassPlaceData(500);
        let verifiedPlace = null;

        //Iterate through all retreived places and determine if there is a valid place within the bunch
        for (let i = 0; i < massPlaceData.length; i++) {
            const isValid = checkPlaceValidity(massPlaceData[i], visitFilter, dateFilter);
            if (isValid) { 
                console.log(`${massPlaceData[i].AssetId} is a verified place!`);
                if(detailsFilter) {
                    verifiedPlace = massPlaceData[i];
                } else {verifiedPlace = massPlaceData[i].AssetId;}
                break;
            }
        };

        if(verifiedPlace != null) {
            return verifiedPlace;
        };

        return await filters.getPlace(backupVisit, backupDate, backuptDetails);
    }
};

module.exports = filters;