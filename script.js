//const arr = document.getElementById("array");
const sortedarr = document.getElementById("sortedarray");
let cols = document.querySelectorAll(".col");
const startBtn = document.getElementById("start");
const icon = startBtn.querySelector("i");
const msInput = document.getElementById("ms");
const sizeInput = document.getElementById("size");
const createBtn = document.getElementById("create");

let isSorting = false;
let isPaused = false;

// window.addEventListener("DOMContentLoaded", () => {
//   //generate random array on load
// let nums = [21, 10, 9, 2, 3];
// for (let i = 0; i < nums.length; i++) {
//   const col = document.querySelector(`.col${i + 1}`);
//   col.style.height = `${nums[i] * 20}px`;
// }

// cols.forEach((col, index) => {
//   col.textContent = nums[index];
// });
// });

createBtn.addEventListener("click", () => {
  if (!isSorting) {
    nums = generateRandomArray();
    console.log(nums);
  }
});

let nums = generateRandomArray();
console.log(nums);

for (let i = 0; i < nums.length; i++) {
  const col = document.querySelector(`.col${i + 1}`);
  col.style.height = `${nums[i] * 20}px`;
}

cols.forEach((col, index) => {
  col.textContent = nums[index];
});

//generate random array
function generateRandomArray() {
  const arr = [];
  let size = sizeInput.value ? parseInt(sizeInput.value) : 5;
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 21) + 1);
  }
  const base = document.querySelector(".cols");
  base.innerHTML = "";
  arr.forEach((height, index) => {
    const bar = document.createElement("span");
    bar.classList.add("col");
    bar.classList.add(`col${index + 1}`);
    bar.style.height = `${height * 20}px`;
    base.appendChild(bar);
  });
  // for (let i = 0; i < arr.length; i++) {
  //   const col = document.querySelector(`.col${i + 1}`);
  //   col.style.height = `${arr[i] * 20}px`;
  // }

  cols = base.querySelectorAll(".col");
  cols.forEach((col, index) => {
    col.textContent = arr[index];
  });

  return arr;
}

startBtn.addEventListener("click", async () => {
  if (!isSorting) {
    isSorting = true;
    isPaused = false;
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
    //await n2Sort(nums);
    //await bubbleSort(nums);
    //await selectionSort(nums);
    await insertionSort(nums);
  } else if (!isPaused) {
    isPaused = true;
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
  } else {
    isPaused = false;
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
  }
});

async function insertionSort(nums) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  for (let i = 1; i < nums.length; ++i) {
    let key = nums[i];
    let j = i - 1;
    //cols[i].style.transform = "translateY(-30px)";
    cols[i].style.backgroundColor = "orange";
    await sleep(delay);
    while (j >= 0 && nums[j] > key) {
      cols[j].style.transform = "translateY(-30px)";
      cols[j].style.backgroundColor = "red";
      await sleep(delay);
      while (isPaused) {
        await sleep(100);
      }
      // Shift value to the right
      //second branch
      let temp = nums[j + 1];
      nums[j + 1] = nums[j];
      cols[j + 1].style.height = `${nums[j] * 20}px`;
      cols[j + 1].textContent = nums[j];

      // Reset bar after comparison
      nums[j] = temp;
      cols[j].style.transform = "translateY(0)";
      cols[j].style.backgroundColor = "blue";
      cols[j].textContent = temp;
      cols[j].style.height = `${temp * 20}px`;
      //cols[i].style.transform = "translateY(0)";
      cols[i].style.backgroundColor = "blue";

      await sleep(delay);
      while (isPaused) {
        await sleep(100);
      }
      j--;
    }
    nums[j + 1] = key;
    cols[j + 1].style.height = `${key * 20}px`;
    cols[j + 1].textContent = key;
    //await sleep(delay);

    //Reset current bar
    //cols[i].style.transform = "translateY(0)";
    cols[i].style.backgroundColor = "blue";

    await sleep(delay);
  }
  isSorting = false;
  icon.classList.remove("fa-pause");
  icon.classList.add("fa-play");
}

async function selectionSort(nums) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  for (let i = 0; i < nums.length - 1; ++i) {
    let minidx = i;
    for (let j = i + 1; j < nums.length; j++) {
      if (!isSorting) {
        return;
      }
      while (isPaused) {
        await sleep(100);
      }
      cols[minidx].style.transform = "translateY(-30px)";
      cols[minidx].style.backgroundColor = "red";
      await sleep(delay);
      cols[j].style.transform = "translateY(-30px)";
      cols[j].style.backgroundColor = "red";
      await sleep(delay);
      while (isPaused) {
        await sleep(100);
      }
      if (nums[j] < nums[minidx]) {
        cols[minidx].style.transform = "translateY(0px)";
        cols[minidx].style.backgroundColor = "blue";
        minidx = j;
      } else {
        cols[j].style.transform = "translateY(0px)";
        cols[j].style.backgroundColor = "blue";
      }
    }
    let temp = nums[i];
    nums[i] = nums[minidx];
    nums[minidx] = temp;
    cols[i].style.height = `${nums[i] * 20}px`;
    cols[minidx].style.height = `${nums[minidx] * 20}px`;
    cols[i].textContent = nums[i];
    cols[minidx].textContent = nums[minidx];
    await sleep(delay);
    while (isPaused) {
      await sleep(100);
    }
    // cols[j].style.transform = "translateY(0px)";
    // cols[j].style.backgroundColor = "blue";
    cols[minidx].style.transform = "translateY(0px)";
    cols[minidx].style.backgroundColor = "blue";
    await sleep(delay);
  }
  isSorting = false;
  icon.classList.remove("fa-pause");
  icon.classList.add("fa-play");
}

async function bubbleSort(nums) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  for (let i = 0; i < nums.length - 1; ++i) {
    let swapped = false;
    for (let j = 0; j < nums.length - i - 1; ++j) {
      if (!isSorting) {
        return;
      }
      while (isPaused) {
        await sleep(100);
      }
      cols[j].style.transform = "translateY(-30px)";
      cols[j].style.backgroundColor = "red";
      await sleep(delay);
      cols[j + 1].style.transform = "translateY(-30px)";
      cols[j + 1].style.backgroundColor = "red";
      await sleep(delay);
      while (isPaused) {
        await sleep(100);
      }
      if (nums[j] > nums[j + 1]) {
        let temp = nums[j];
        nums[j] = nums[j + 1];
        nums[j + 1] = temp;
        cols[j].style.height = `${nums[j] * 20}px`;
        cols[j + 1].style.height = `${nums[j + 1] * 20}px`;
        cols[j].textContent = nums[j];
        cols[j + 1].textContent = nums[j + 1];
        swapped = true;
        await sleep(delay);
      }
      while (isPaused) {
        await sleep(100);
      }
      cols[j].style.transform = "translateY(0px)";
      cols[j + 1].style.transform = "translateY(0px)";
      cols[j].style.backgroundColor = "blue";
      cols[j + 1].style.backgroundColor = "blue";
      await sleep(delay);
    }
    if (!swapped) {
      break;
    }
  }
  isSorting = false;
  icon.classList.remove("fa-pause");
  icon.classList.add("fa-play");
}

async function n2Sort(nums) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  for (let i = 0; i < nums.length - 1; ++i) {
    for (let j = i + 1; j < nums.length; ++j) {
      if (!isSorting) {
        return;
      }
      while (isPaused) {
        await sleep(100);
      }
      cols[i].style.transform = "translateY(-30px)";
      cols[i].style.backgroundColor = "red";
      await sleep(delay);
      cols[j].style.transform = "translateY(-30px)";
      cols[j].style.backgroundColor = "red";
      await sleep(delay);
      while (isPaused) {
        await sleep(100);
      }
      if (nums[i] > nums[j]) {
        let temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
        cols[i].style.height = `${nums[i] * 20}px`;
        cols[j].style.height = `${nums[j] * 20}px`;
        cols[i].textContent = nums[i];
        cols[j].textContent = nums[j];
        await sleep(delay);
      }
      while (isPaused) {
        await sleep(100);
      }
      cols[i].style.transform = "translateY(0px)";
      cols[j].style.transform = "translateY(0px)";
      cols[i].style.backgroundColor = "blue";
      cols[j].style.backgroundColor = "blue";
      await sleep(delay);
    }
  }
  isSorting = false;
  icon.classList.remove("fa-pause");
  icon.classList.add("fa-play");
}

function sleep(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
