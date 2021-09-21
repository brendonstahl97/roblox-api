const idInput = $("#PlaceIDInput");
const targetCollection = $(".targetMainframe");
const submitBtn = $(".payloadBtn");

//test
const curatedURL = 'https://rb6766767.herokuapp.com/api/admin/curated';
const oldURL = 'https://rb6766767.herokuapp.com/api/admin/old';

submitBtn.on('click', e => {
    e.preventDefault();

    const placeId = {
        placeId: parseInt(idInput.val())
    };

    if (targetCollection.val() == 1) {
        $.post(curatedURL, placeId, (data, status) => {
            console.log(status);
            alert(data);
        });
    } else if (targetCollection.val() == 2) {
        $.post(oldURL, placeId, (data, status) => {
            alert(data);
        });
    };
});