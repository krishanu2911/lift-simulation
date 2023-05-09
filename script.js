const floorLiftCountForm = document.getElementById("floor_lift_count_form");
const floorContainerWarp = document.getElementsByClassName(
  "floor_container_warp"
);
const liftContainer = document.getElementsByClassName("lift_container");
let floorCount = 7;
let liftCount = 2;

floorLiftCountForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createFloors(floorCount,liftCount);
});
// ---------- Utils && States -----------------
const floorHeight = 8 // rems

const LIFT_STATE = {
    ENGAGE : "engage",
    AVAILABLE : "available",
}

// ---------- Floor & lift creation ------------

const createFloors = (floorNumbers, liftNumbers) => {
  // ------ Floor -----------

  for (let i = floorNumbers; i > 0; i--) {

    const floorContainer = document.createElement("section");
    floorContainer.dataset.floorNo = `${i}`
    floorContainer.classList.add("floor_container");

    const upBtn = document.createElement("button");
    upBtn.innerText = "Up"
    upBtn.classList.add("up_btn");
    upBtn.onclick = (e) => callingLift(e,i)

    const floorNumber = document.createElement("div")
    floorNumber.innerText = `${i}`

    const downBtn = document.createElement("button");
    downBtn.innerText = "Down"
    downBtn.classList.add("down_btn");
    downBtn.onclick = (e) => callingLift(e,i)

    const floorSwitchControls = document.createElement("div");
    floorSwitchControls.classList.add("floor_switch_controls")
    floorSwitchControls.append(upBtn,floorNumber,downBtn)

    floorContainer.append(floorSwitchControls);
    floorContainerWarp[0].append(floorContainer);
  }

  for(let i = 0; i < liftNumbers; i++) {
    const lift = document.createElement("section");
    lift.classList.add("lift");
    lift.dataset.state = LIFT_STATE.AVAILABLE;
    lift.dataset.direction = ""
    lift.dataset.currentFloor = "1"
    lift.dataset.index = `${i}`

    const doorLeft = document.createElement("div");
    doorLeft.classList.add("door_left");

    const doorRight = document.createElement("div");
    doorRight.classList.add("door_right");

    lift.append(doorLeft,doorRight);
    liftContainer[0].append(lift);
  }
};

// ---------- Lift Call -------------------

const callingLift = (btnEvent , floorNumber) => {
    let lifts = document.getElementsByClassName("lift");
    let nearestLiftAvailable = [...lifts].reduce((nearestLift,lift) => {
        if(lift.dataset.state === LIFT_STATE.ENGAGE){
            return nearestLift
        }
        const distanceOfCurrentLift = (floorNumber - Number(lift.dataset.currentFloor))
        console.log(distanceOfCurrentLift);
        if(distanceOfCurrentLift < nearestLift.elementDistance){
            // console.log("hi")
            // console.log(distanceOfCurrentLift);
            return {...nearestLift,element: lift, elementDistance: distanceOfCurrentLift}
        }
        return nearestLift
    },{element: null, elementDistance: Number.MAX_SAFE_INTEGER})
    nearestLiftAvailable.element.style.transform = `translateY(-${(nearestLiftAvailable.elementDistance * (128+2))}px)`;
    nearestLiftAvailable.element.style.transition = `all ${3}s linear`;
    nearestLiftAvailable.element.dataset.currentFloor = `${floorNumber}`;
}