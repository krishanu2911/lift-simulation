const floorLiftCountForm = document.getElementById("floor_lift_count_form");

let floorCount = 0;
let liftCount = 0

floorLiftCountForm.addEventListener("submit", (e) => {
    e.preventDefault();
    floorCount = document.getElementById("floor_count").value;
    liftCount = document.getElementById("lift_count").value;
})