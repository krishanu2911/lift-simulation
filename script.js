const floorLiftCountForm = document.getElementById("floor_lift_count_form");
const floorContainerWarp = document.getElementsByClassName(
  "floor_container_warp"
);
const liftContainer = document.getElementsByClassName("lift_container");
let floorCount = 0;
let liftCount = 0;

floorLiftCountForm.addEventListener("submit", (e) => {
  e.preventDefault();
  floorCount = document.getElementById("floor_count").value;
  liftCount = document.getElementById("lift_count").value;
  createFloors(floorCount,liftCount);
});

// ---------- Floor & lift creation ------------

const createFloors = (floorNumbers, liftNumbers) => {
  // ------ Floor -----------

  for (let i = 0; i < floorNumbers; i++) {

    const floorContainer = document.createElement("section");
    floorContainer.classList.add("floor_container");

    const upBtn = document.createElement("button");
    upBtn.innerText = "Up"
    upBtn.classList.add("up_btn");

    const floorNumber = document.createElement("div")
    floorNumber.innerText = `${i}`

    const downBtn = document.createElement("button");
    downBtn.innerText = "Down"
    downBtn.classList.add("down_btn");

    const floorSwitchControls = document.createElement("div");
    floorSwitchControls.classList.add("floor_switch_controls")
    floorSwitchControls.append(upBtn,floorNumber,downBtn)

    floorContainer.append(floorSwitchControls);
    floorContainerWarp[0].append(floorContainer);
  }

  for(let i = 0; i < liftNumbers; i++) {
    const lift = document.createElement("section");
    lift.classList.add("lift");

    const doorLeft = document.createElement("div");
    doorLeft.classList.add("door_left");

    const doorRight = document.createElement("div");
    doorRight.classList.add("door_right");

    lift.append(doorLeft,doorRight);
    liftContainer[0].append(lift);
  }
};
