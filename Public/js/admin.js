const idInput = $("#PlaceIDInput");
const targetCollection = $(".targetMainframe");
const submitBtn = $(".payloadBtn");

const curatedURL = 'https://rb6766767.herokuapp.com/api/admin/curated';
const oldURL = 'https://rb6766767.herokuapp.com/api/admin/old';
const halloweenURL = 'https://rb6766767.herokuapp.com/api/admin/halloween';

const postToDb = (collectionUrl, placeIdObj) => {
    $.post(collectionUrl, placeIdObj, (data, status) => {
        alert(data);
    });
};

submitBtn.on('click', e => {
    e.preventDefault();

    const placeIdObj = {
        placeId: parseInt(idInput.val())
    };

    switch (targetCollection.val()) {
        case '1':
            try {
                postToDb(curatedURL, placeIdObj);
            } catch (error) {
                console.log(error);
            }
            break;

        case '2':
            try {
                postToDb(oldURL, placeIdObj);
            } catch (error) {
                console.log(error);
            }
            break;

        case '3':
            try {
                console.log('halloween');
                postToDb(halloweenURL, placeIdObj);
            } catch (error) {
                console.log(error);
            }
            break;

        default:
            break;
    };
});