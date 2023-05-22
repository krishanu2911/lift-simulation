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
  if (floorCount > 15 || liftCount > 7) {
    confirm(
      "Lift or floor count Limit exceeds Lift and floor must be less than 7 and 15 respectively"
    );
    return;
  }
  floorLiftCountForm.style.display = "none";
  createFloors(floorCount, liftCount);
  return;
});
const standbyFloorCall = [];
// ---------- Utils && States -----------------
const floorHeight = 8; // rems

const LIFT_STATE = {
  ENGAGE: "engage",
  AVAILABLE: "available",
};

// ---------- Floor & lift creation ------------

const createFloors = (floorNumbers, liftNumbers) => {
  // ------ Floor -----------

  for (let i = floorNumbers; i > 0; i--) {
    const floorContainer = document.createElement("section");
    floorContainer.dataset.floorNo = `${i}`;
    floorContainer.classList.add("floor_container");

    const upBtn = document.createElement("button");
    upBtn.innerText = "Up";
    upBtn.classList.add("up_btn");
    upBtn.onclick = (e) => callingLift(e, i);

    const floorNumber = document.createElement("div");
    floorNumber.innerText = `${i}`;

    const downBtn = document.createElement("button");
    downBtn.innerText = "Down";
    downBtn.classList.add("down_btn");
    downBtn.onclick = (e) => callingLift(e, i);

    const floorSwitchControls = document.createElement("div");
    floorSwitchControls.classList.add("floor_switch_controls");
    floorSwitchControls.append(upBtn, floorNumber, downBtn);

    floorContainer.append(floorSwitchControls);
    floorContainerWarp[0].append(floorContainer);
  }

  for (let i = 0; i < liftNumbers; i++) {
    const lift = document.createElement("section");
    lift.classList.add("lift");
    lift.dataset.state = LIFT_STATE.AVAILABLE;
    lift.dataset.direction = "";
    lift.dataset.currentFloor = "1";
    lift.dataset.index = `${i}`;

    const doorLeft = document.createElement("div");
    doorLeft.classList.add("door_left");

    const doorRight = document.createElement("div");
    doorRight.classList.add("door_right");

    lift.append(doorLeft, doorRight);
    liftContainer[0].append(lift);
  }
};

// ---------- Lift Call -------------------

const callingLift = async (btnEvent, floorNumber) => {
  let lifts = document.getElementsByClassName("lift");
  let checkLiftPresentInFloor = [...lifts].filter(
    (item) => Number(item.dataset.currentFloor) === floorNumber
  );
  if (checkLiftPresentInFloor.length !== 0) {
    await closeOpenDoor(checkLiftPresentInFloor[0]);
    return;
  }
  let nearestLiftAvailable = [...lifts].reduce(
    (nearestLift, lift) => {
      if (lift.dataset.state === LIFT_STATE.ENGAGE) {
        return nearestLift;
      }
      const distanceOfCurrentLift = Math.abs(
        floorNumber - Number(lift.dataset.currentFloor)
      );
      console.log(distanceOfCurrentLift);
      const pxDistance = floorNumber * (128 + 2);
      if (distanceOfCurrentLift < nearestLift.elementDistance) {
        return {
          ...nearestLift,
          element: lift,
          elementDistance: distanceOfCurrentLift,
          pxDist: pxDistance,
        };
      }
      return nearestLift;
    },
    {
      element: null,
      elementDistance: Number.MAX_SAFE_INTEGER,
      alreadyPresentLift: null,
    }
  );
  if (nearestLiftAvailable.element === null) {
    standbyFloorCall.push(floorNumber);
    return;
  }
  // console.log(lifts)
  nearestLiftAvailable.element.dataset.currentFloor = `${floorNumber}`;
  nearestLiftAvailable.element.dataset.state = LIFT_STATE.ENGAGE;
  LiftMovement(nearestLiftAvailable.element, floorNumber);
};

const LiftMovement = async (lift, fl_no) => {
  await closeOpenDoor(lift);
  lift.style.transform = `translateY(-${(fl_no - 1) * (128 + 2)}px)`;
  lift.style.transition = `all ${3}s linear`;
  return new Promise((res) => {
    setTimeout(async () => {
      await closeOpenDoor(lift);
      res();
      if (standbyFloorCall.length === 0) {
        lift.dataset.state = LIFT_STATE.AVAILABLE;
      } else {
        await LiftMovement(lift, standbyFloorCall.shift());
      }
    }, 3000);
  });
};

const closeOpenDoor = (lift) => {
  return new Promise((res) => {
    lift.classList.add("closeOpen");
    setTimeout(() => {
      lift.classList.remove("closeOpen");
      res();
    }, 2500);
  });
};
