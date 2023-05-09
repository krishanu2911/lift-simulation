const floorLiftCountForm = document.getElementById("floor_lift_count_form");
const floorContainerWarp = document.getElementsByClassName(
  "floor_container_warp"
);
const liftContainer = document.getElementsByClassName("lift_container");
let floorCount = 5;
let liftCount = 4;

floorLiftCountForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createFloors(floorCount, liftCount);
});
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
  let nearestLiftAvailable = [...lifts].reduce(
    (nearestLift, lift) => {
      if (lift.dataset.state === LIFT_STATE.ENGAGE) {
        return nearestLift;
      }
      // console.log(lift.dataset.currentFloor, parseInt(floorNumber))
      // if (lift.dataset.currentFloor === parseInt(floorNumber)) {
      //   return { ...nearestLift, alreadyPresentLift: [lift] };
      // }
      const distanceOfCurrentLift = Math.abs(
        floorNumber - Number(lift.dataset.currentFloor)
      );
      console.log(distanceOfCurrentLift);
      const pxDistance = floorNumber * (128 + 2);
      if (distanceOfCurrentLift < nearestLift.elementDistance) {
        // console.log("hi")
        // console.log(distanceOfCurrentLift);
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
  console.log(nearestLiftAvailable.alreadyPresentLift)
  // if (nearestLiftAvailable.alreadyPresentLift === null) {
  //   await closeOpenDoor(nearestLiftAvailable.alreadyPresentLift[0]);
  //   return;
  // }
  nearestLiftAvailable.element.dataset.currentFloor = `${floorNumber}`;
  nearestLiftAvailable.element.dataset.state = LIFT_STATE.ENGAGE;
  LiftMovement(nearestLiftAvailable.element, floorNumber);
  // nearestLiftAvailable.element.style.transform = `translateY(-${((floorNumber - 1) * (128+2))}px)`;
  // nearestLiftAvailable.element.style.transition = `all ${3}s linear`;

  // setTimeout(() => {
  //   nearestLiftAvailable.element.dataset.state = LIFT_STATE.AVAILABLE;
  // },3000)
};

const LiftMovement = async (lift, fl_no) => {
  await closeOpenDoor(lift);
  lift.style.transform = `translateY(-${(fl_no - 1) * (128 + 2)}px)`;
  lift.style.transition = `all ${3}s linear`;
  return new Promise((res) => {
    setTimeout(async () => {
      await closeOpenDoor(lift);
      lift.dataset.state = LIFT_STATE.AVAILABLE;
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
