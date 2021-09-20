const idInput = $("#PlaceIDInput");
const targetCollection = $(".targetMainframe");
const submitBtn = $(".payloadBtn");

//test
const curatedURL = process.env.URL + '/api/admin/curated' || 'http://localhost:8080/api/admin/curated';
const oldURL = process.env.URL + '/api/admin/old' || 'http://localhost:8080/api/admin/old';

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