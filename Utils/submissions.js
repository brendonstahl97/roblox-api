const filters = require('../Utils/filters');

const submissions = {
    submit: async (model, placeId) => {
        try {
            const data = await filters.getPlaceInfo(placeId);

            const filter = { placeId: data.AssetId };
            const update = {
                name: data.Name,
                data: data
            };

            const res = await model.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            }).catch(err => {
                console.log(err);
            });

            return true;
        } catch (error) {
            console.error(error);
        };
    }
};

module.exports = submissions;