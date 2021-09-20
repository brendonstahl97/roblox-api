const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const oldPlaceSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: "Please provide a name for the submission"
    },
    placeId: {
        type: Number,
        required: "Please provide a placeID for the submission"
    },
    data: {
        type: Object,
        required: "Please provide data for the submission"
    }

});

const OldPlace = mongoose.model("OldPlaces", oldPlaceSchema);

module.exports = OldPlace;