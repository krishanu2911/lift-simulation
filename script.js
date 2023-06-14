const floorLiftCountForm = document.getElementById("floor_lift_count_form");
const floorContainerWarp = document.getElementsByClassName(
  "floor_container_warp"
);
const liftGenerate = document.getElementById("generate");
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
  liftGenerate.style.display = "block";
  createFloors(floorCount, liftCount);
  return;
});

liftGenerate.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("hello");
  location.reload();
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

    const floorNumber = document.createElement("div");
    floorNumber.innerText = `${i}`;

    const downBtn = document.createElement("button");
    downBtn.innerText = "Down";
    downBtn.classList.add("down_btn");
    upBtn.onclick = (e) => callingLift(upBtn, i, downBtn);
    downBtn.onclick = (e) => callingLift(downBtn, i, upBtn);

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

const callingLift = async (btnEvent, floorNumber, anotherbtn) => {
  let lifts = document.getElementsByClassName("lift");
  let checkLiftPresentInFloor = [...lifts].filter(
    (item) => Number(item.dataset.currentFloor) === Number(floorNumber)
  );
  if (checkLiftPresentInFloor.length !== 0) {
    console.log("hello same floor")
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
  console.log(nearestLiftAvailable.element)
  if (nearestLiftAvailable.element === null) {
    if (!standbyFloorCall.includes(Number(floorNumber))) {
      standbyFloorCall.push(Number(floorNumber));
    }
    return;
  }
  let liftTimeDuration =
    Math.abs(nearestLiftAvailable.element.dataset.currentFloor - floorNumber) *
    2;
  nearestLiftAvailable.element.dataset.currentFloor = `${floorNumber}`;
  nearestLiftAvailable.element.dataset.state = LIFT_STATE.ENGAGE;
  LiftMovement(
    nearestLiftAvailable.element,
    floorNumber,
    liftTimeDuration,
    btnEvent,
    anotherbtn
  );
};

const LiftMovement = async (lift, fl_no, time, btnEvent, anotherbtn) => {
  if(btnEvent && anotherbtn) {
    btnEvent.disabled = true;
  anotherbtn.disabled = true;
  }
  
  console.log("disabled the btn");
  await closeOpenDoor(lift);
  lift.style.transform = `translateY(-${(fl_no - 1) * (128 + 2)}px)`;
  lift.style.transition = `all ${time}s linear`;
  return new Promise((res) => {
    setTimeout(async () => {
      await closeOpenDoor(lift);
      res();
      lift.dataset.currentFloor = `${fl_no}`;
      if(btnEvent && anotherbtn) {
        btnEvent.disabled = false;
      anotherbtn.disabled = false;
      }
      // lift.dataset.state = LIFT_STATE.AVAILABLE;
      if (standbyFloorCall.length === 0) {
        lift.dataset.state = LIFT_STATE.AVAILABLE;
      } else {
        let standbyLiftFloor = standbyFloorCall.shift();
        let liftTime =
          Math.abs(lift.dataset.currentFloor - standbyLiftFloor) * 2;
        console.log(standbyFloorCall);
        await LiftMovement(lift, standbyLiftFloor, liftTime);
      }
    }, time * 1000);
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
