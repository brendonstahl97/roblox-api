const idInput = $("#PlaceIDInput");
const submitBtn = $(".payloadBtn");

const queryURL = 'http://localhost:8080/api/admin/curated';

submitBtn.on('click', e => {
    e.preventDefault();
    const data = {
        placeId: parseInt(idInput.val())
    };

    $.post(queryURL, data, (data, status) => {
        alert(data);
    });
});