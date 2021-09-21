const noblox = require('noblox.js');
const axios = require('axios');
const oldPlace = require('../Models/oldPlace');
const curatedPlace = require('../Models/curatedPlace');

const popGamesUrl = 'https://www.roblox.com/games/list-json?sortFilter=1&MaxRows=1000';

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
    const placeData = placeIds.map(async id => {
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

const getFavGames = async (dataArr) => {
    try {
        const favData = dataArr.map(async userId => {
            const data = await axios({
                method: 'get',
                url: `https://games.roblox.com/v2/users/${userId}/favorite/games?limit=50&sortOrder=Asc`
            });

            return data.data.data;
        });
        return Promise.all(favData);

    } catch (error) {
        console.log(error);
    };
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

//Generate a random integer based on the length of the provided array
const getRandomInt = (arr) => {
    return Math.floor(Math.random() * arr.length);
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

    //Find an eligible place based on specified filter info
    //VisitFilter: 0 = >1 view, 1 = between 1 and 1000 views, 2 = between 1000 and 10000 views, 3 = >10000 views
    //dateFilter: false = ignore update, true = ensure game has at least one update
    getPlace: async (visitFilter = 0, dateFilter = false, detailsFilter = false) => {
        //bakcup filter data for recursion
        const backupVisit = visitFilter;
        const backupDate = dateFilter;
        const backuptDetails = detailsFilter
        const massPlaceData = await getMassPlaceData(50);
        let verifiedPlace = null;

        //Iterate through all retreived places and determine if there is a valid place within the bunch
        for (let i = 0; i < massPlaceData.length; i++) {
            const isValid = checkPlaceValidity(massPlaceData[i], visitFilter, dateFilter);
            if (isValid) {
                console.log(`${massPlaceData[i].AssetId} is a verified place!`);
                if (detailsFilter) {
                    verifiedPlace = massPlaceData[i];
                } else { verifiedPlace = massPlaceData[i].AssetId; }
                break;
            }
        };

        if (verifiedPlace != null) {
            return verifiedPlace;
        };

        return await filters.getPlace(backupVisit, backupDate, backuptDetails);
    },

    //Find an eligible place from a list of current top games 
    //details: true = return all game data
    //details: false = return only the game id 
    getPopularPlace: async (details) => {
        try {
            //Get popular games data
            const { data } = await axios({
                method: 'get',
                url: popGamesUrl,
            });

            //Generate random index of the returned data
            const randInt = getRandomInt(data);

            //determine whether or not to send all place details or just ID
            if (details) {
                return data[randInt];
            } else {
                return data[randInt].PlaceID;
            }

        } catch (error) {
            console.trace(error);
        };
    },

    //Expiremental mode
    //finds random game, then gets creator's favorited games and returns one at random
    getRandFavGame: async (details) => {
        try {
            //retreive a game with at least one view that has been updated at least once
            const tempGame = await filters.getPlace(0, true, true);

            //grab userId from the retreived game
            const userId = tempGame.BuilderId

            //get the favorites list from the builder of 'tempGame'
            const userFavData = await axios({
                method: 'get',
                url: `https://games.roblox.com/v2/users/${userId}/favorite/games?limit=50&sortOrder=Asc`
            });

            //Check to see if the user has any favorites
            //If not, retry this function
            if (userFavData.data.data.length < 1) {
                return filters.getRandFavGame();
            } else {

                //Generate random index
                const randInt = getRandomInt(userFavData.data.data);

                //Check if the game details were requested
                if (details) {
                    return userFavData.data.data[randInt];
                } else {
                    return userFavData.data.data[randInt].rootPlace.id;
                };
            };
        } catch (error) {
            console.log(error);
        };
    },

    //gets a random favorite game from the collective favorites of all userIds provided
    getFavGame: async (userIdArr, details) => {

        try {
            const rawData = await getFavGames(userIdArr.data);
            let collectiveFavs = [];

            //Populate Collective favorites array with individuals favorites
            rawData.map(userFavs => {
                if (userFavs.length > 0) {
                    collectiveFavs = [...collectiveFavs, ...userFavs];
                };
            });

            //Generate a random index for collective favorites array
            const randInt = getRandomInt(collectiveFavs);

            //Determine if details were requested
            if (details) {
                return collectiveFavs[randInt];
            } else {
                return collectiveFavs[randInt].rootPlace.id;
            };

        } catch (error) {
            console.log(error);
        };
    },

    getCuratedPlace: async(details) => {
        const data = await curatedPlace.aggregate([{ $sample: { size: 1 } }]);
        
        if (details) {
            return data.data;
        } else {
            return data.placeId;
        };
    },

    getOldPlace: async(details) => {
        const data = await oldPlace.aggregate([{ $sample: { size: 1 } }]);
        
        if (details) {
            return data.data;
        } else {
            return data.placeId;
        };
    }
};

module.exports = filters;