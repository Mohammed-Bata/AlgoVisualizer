//const arr = document.getElementById("array");
const sortedarr = document.getElementById("sortedarray");
let cols = document.querySelectorAll(".col");
const startBtn = document.getElementById("start");
const icon = startBtn.querySelector("i");
const msInput = document.getElementById("ms");
const sizeInput = document.getElementById("size");
const createBtn = document.getElementById("create");
const algolist = document.querySelector(".algoList");

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

algolist.addEventListener("click", (e) => {
  if (e.target && e.target.tagName === "LI") {
    const algo = algolist.querySelector(".active");
    const originalName = algo.dataset.name; // use data-name for reset

    algo.textContent = `${originalName[0] + originalName[1] + originalName[2]}`;
    algo.classList.remove("active");

    e.target.classList.add("active");
    const selected = e.target.dataset.name;
    e.target.textContent = `${selected} SORT`;
  }
});

createBtn.addEventListener("click", () => {
  if (!isSorting) {
    icon.classList.remove("fa-rotate-right");
    icon.classList.add("fa-play");
    nums = generateRandomArray();
    console.log(nums);
  }
});

let nums = generateRandomArray();
console.log(nums);

// for (let i = 0; i < nums.length; i++) {
//   const col = document.querySelector(`.col${i + 1}`);
//   col.style.height = `${(nums[i] / 50) * 220}px`;
// }

// cols.forEach((col, index) => {
//   col.textContent = nums[index];
// });

//generate random array
function generateRandomArray() {
  const arr = [];
  let size = sizeInput.value ? parseInt(sizeInput.value) : 5;
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 49) + 1);
  }
  renderBars(arr);
  // const base = document.querySelector(".cols");
  // base.innerHTML = "";
  // arr.forEach((height, index) => {
  //   const bar = document.createElement("span");
  //   bar.classList.add("col");
  //   bar.classList.add(`col${index + 1}`);
  //   bar.style.height = `${(height / 50) * 220}px`;
  //   base.appendChild(bar);
  // });

  // cols = base.querySelectorAll(".col");
  // cols.forEach((col, index) => {
  //   col.textContent = arr[index];
  // });

  // for (let i = 0; i < arr.length; i++) {
  //   const col = document.querySelector(`.col${i + 1}`);
  //   col.style.height = `${arr[i] * 20}px`;
  // }

  return arr;
}

function renderBars(arr) {
  const base = document.querySelector(".cols");
  base.innerHTML = "";
  arr.forEach((height, index) => {
    const bar = document.createElement("span");
    bar.classList.add("col");
    bar.classList.add(`col${index + 1}`);
    bar.style.height = `${(height / 50) * 220}px`;
    base.appendChild(bar);
  });

  cols = base.querySelectorAll(".col");
  cols.forEach((col, index) => {
    col.textContent = arr[index];
  });
}

startBtn.addEventListener("click", async () => {
  if (!isSorting) {
    algo = document.querySelector(".active");
    isSorting = true;
    isPaused = false;
    icon.classList.remove("fa-play");
    icon.classList.remove("fa-rotate-right");
    icon.classList.add("fa-pause");
    renderBars(nums);
    let cos = Array.from(cols);
    switch (algo.dataset.name) {
      case "BUBBLE":
        await bubbleSort(nums);
        break;
      case "SELECTION":
        await selectionSort(nums);
        break;
      case "INSERTION":
        await insertionSort(nums);
        break;
      case "MERGE":
        const values = await mergeSort(nums, cos, 0, cos.length - 1);
        values.forEach((value) => {
          value.style.backgroundColor = "blue";
        });
        break;
      case "QUICK":
        await quickSort(cos, 0, cos.length - 1);
        break;
    }

    //await n2Sort(nums);
    //await bubbleSort(nums);
    //await selectionSort(nums);
    //await insertionSort(nums);
    // const values = await mergeSort(nums, cos, 0, cos.length - 1);
    // values.forEach((value) => {
    //   value.style.backgroundColor = "blue";
    // });

    //await quickSort(cos, 0, cos.length - 1);
    isSorting = false;
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-rotate-right");
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

async function swapBars(parent, colA, colB, cols) {
  if (colA == colB) {
    return;
  }
  const indexA = Array.prototype.indexOf.call(cols, colA);
  const indexB = Array.prototype.indexOf.call(cols, colB);
  colA.style.backgroundColor = "red";
  colB.style.backgroundColor = "red";
  colA.style.transform = "translateY(30px)";
  colB.style.transform = "translateY(30px)";
  await sleep();
  let next = colA.nextSibling;
  parent.insertBefore(colA, colB);
  parent.insertBefore(colB, next);
  colA.style.backgroundColor = "blue";
  colB.style.backgroundColor = "blue";
  colA.style.transform = "translateY(0px)";
  colB.style.transform = "translateY(0px)";
  [cols[indexA], cols[indexB]] = [cols[indexB], cols[indexA]];
}

async function part(cols, start, end) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  let parent = document.querySelector(".cols");
  let pivot = cols[start];
  cols[start].style.backgroundColor = "orange";
  await sleep(delay);
  let count = 0;
  for (let i = start + 1; i <= end; i++) {
    cols[i].style.backgroundColor = "yellow";
    if (parseInt(cols[i].style.height) < parseInt(pivot.style.height)) {
      count++;
    }
    await sleep(delay);
    cols[i].style.backgroundColor = "blue";
  }
  await sleep(delay);

  let pivotIdx = start + count;
  await swapBars(parent, cols[pivotIdx], cols[start], cols);
  pivot.style.backgroundColor = "orange";

  let i = start;
  let j = end;

  while (i < pivotIdx && j > pivotIdx) {
    cols[i].style.backgroundColor = "red";
    cols[j].style.backgroundColor = "red";
    await sleep(delay);
    while (
      parseInt(cols[i].style.height) <= parseInt(pivot.style.height) &&
      cols[i] != pivot
    ) {
      // cols[i].style.backgroundColor = "red";
      // await sleep(delay);
      cols[i].style.backgroundColor = "blue";
      i++;
    }
    while (
      parseInt(cols[j].style.height) > parseInt(pivot.style.height) &&
      cols[j] != pivot
    ) {
      // cols[j].style.backgroundColor = "red";
      // await sleep(delay);
      cols[j].style.backgroundColor = "blue";
      j--;
    }
    if (i < pivotIdx && j > pivotIdx) {
      await swapBars(parent, cols[i], cols[j], cols);
    }
  }
  cols[pivotIdx].style.backgroundColor = "blue";
  return pivotIdx;
}
async function quickSort(cols, start, end) {
  if (start >= end) {
    return;
  }
  let p = await part(cols, start, end);

  await quickSort(cols, start, p - 1);
  await quickSort(cols, p + 1, end);
}

async function mergeSort(nums, cos, start, end, depth = 0) {
  let parent = document.querySelector(".cols");
  let delay = msInput.value ? parseInt(msInput.value) : 500;

  if (start >= end) {
    // cos[start].style.transform = `translateY(${depth * 30}px)`;
    // await sleep(delay);
    return [cos[start]];
  }

  const mid = Math.floor((start + end) / 2);

  for (let i = start; i <= end; i++) {
    cos[i].style.transform = `translateY(${depth * 30}px)`;
  }

  await sleep(delay);

  const sortedLeft = await mergeSort(parent, cos, start, mid, depth + 1);
  const sortedRight = await mergeSort(parent, cos, mid + 1, end, depth + 1);

  while (isPaused) {
    await sleep(100);
  }

  return await merge(parent, sortedLeft, sortedRight, depth + 1);
}

async function merge(parent, left, right, depth) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  let result = [];
  let i = 0,
    j = 0;

  // let style1 = window.getComputedStyle(left[i]);
  // let matrix = new DOMMatrixReadOnly(style1.transform);

  // let style2 = window.getComputedStyle(right[j]);
  // let matrix2 = new DOMMatrixReadOnly(style2.transform);

  // if (matrix.m42 != matrix2.m42) {
  //   matrix.m42 < matrix2.m42
  //     ? left.forEach((col) => {
  //         col.style.transform = `translateY(${matrix2.m42}px)`;
  //       })
  //     : right.forEach((col) => {
  //         col.style.transform = `translateY(${matrix2.m42}px)`;
  //       });
  // }
  while (i < left.length && j < right.length) {
    left[i].style.backgroundColor = "red";
    right[j].style.backgroundColor = "red";
    while (isPaused) {
      await sleep(100);
    }
    let leftVal = parseInt(left[i].style.height);
    let rightVal = parseInt(right[j].style.height);

    if (leftVal < rightVal) {
      result.push(left[i]);
      left[i].style.backgroundColor = "green";
      left[i].style.transform = `translateY(${(depth + 1) * 30}px)`;
      await sleep(delay);
      i++;
    } else {
      parent.insertBefore(right[j], left[i]);
      right[j].style.transform = `translateY(${(depth + 1) * 30}px)`;
      await sleep(delay);
      right[j].style.backgroundColor = "green";

      result.push(right[j]);
      j++;

      while (isPaused) {
        await sleep(delay);
      }
    }
  }
  while (isPaused) {
    await sleep(100);
  }

  // add leftovers
  while (i < left.length) {
    result.push(left[i]);
    left[i].style.backgroundColor = "green";
    left[i].style.transform = `translateY(${(depth + 1) * 30}px)`;
    await sleep(delay);
    i++;
  }
  while (j < right.length) {
    result.push(right[j]);
    right[j].style.backgroundColor = "green";
    right[j].style.transform = `translateY(${(depth + 1) * 30}px)`;
    await sleep(delay);
    j++;
  }

  result.forEach((col) => {
    col.style.transform = `translateY(${(depth - 2) * 30}px)`;
    col.style.backgroundColor = "orange";
  });
  await sleep(delay);

  return result;
}

async function insertionSort(nums) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  for (let i = 1; i < nums.length; ++i) {
    let key = nums[i];
    let j = i - 1;
    //cols[i].style.transform = "translateY(-30px)";
    cols[i].style.backgroundColor = "orange";
    if (nums[j] <= key) {
      cols[j].style.transform = "translateY(-30px)";
      cols[j].style.backgroundColor = "red";
      await sleep(delay);
      cols[j].style.backgroundColor = "orange";
      cols[j].style.transform = "translateY(0px)";
      await sleep(delay);
    }
    await sleep(delay);
    while (j >= 0 && nums[j] > key) {
      cols[j].style.transform = "translateY(-30px)";
      cols[j].style.backgroundColor = "red";
      await sleep(delay);
      while (isPaused) {
        await sleep(100);
      }
      // Shift value to the right
      let temp = nums[j + 1];
      nums[j + 1] = nums[j];
      cols[j + 1].style.height = `${(nums[j] / 50) * 220}px`;
      cols[j + 1].textContent = nums[j];

      // Reset bar after comparison
      nums[j] = temp;
      cols[j].style.transform = "translateY(0)";
      cols[j].style.backgroundColor = "orange";
      cols[j].textContent = temp;
      cols[j].style.height = `${(temp / 50) * 220}px`;
      //cols[i].style.transform = "translateY(0)";
      //cols[i].style.backgroundColor = "blue";

      await sleep(delay);
      while (isPaused) {
        await sleep(100);
      }
      j--;
    }

    nums[j + 1] = key;
    cols[j + 1].style.height = `${(key / 50) * 220}px`;
    cols[j + 1].textContent = key;
    cols[j + 1].style.backgroundColor = "orange";

    //Reset current bar
    //cols[i].style.transform = "translateY(0)";
    cols[i].style.backgroundColor = "orange";

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
    cols[i].style.height = `${(nums[i] / 50) * 220}px`;
    cols[minidx].style.height = `${(nums[minidx] / 50) * 220}px`;
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
        cols[j].style.height = `${(nums[j] / 50) * 220}px`;
        cols[j + 1].style.height = `${(nums[j + 1] / 50) * 220}px`;
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

// async function n2Sort(nums) {
//   let delay = msInput.value ? parseInt(msInput.value) : 500;
//   for (let i = 0; i < nums.length - 1; ++i) {
//     for (let j = i + 1; j < nums.length; ++j) {
//       if (!isSorting) {
//         return;
//       }
//       while (isPaused) {
//         await sleep(100);
//       }
//       cols[i].style.transform = "translateY(-30px)";
//       cols[i].style.backgroundColor = "red";
//       await sleep(delay);
//       cols[j].style.transform = "translateY(-30px)";
//       cols[j].style.backgroundColor = "red";
//       await sleep(delay);
//       while (isPaused) {
//         await sleep(100);
//       }
//       if (nums[i] > nums[j]) {
//         let temp = nums[i];
//         nums[i] = nums[j];
//         nums[j] = temp;
//         cols[i].style.height = `${(nums[i] / 50) * 220}px`;
//         cols[j].style.height = `${(nums[j] / 50) * 220}px`;
//         cols[i].textContent = nums[i];
//         cols[j].textContent = nums[j];
//         await sleep(delay);
//       }
//       while (isPaused) {
//         await sleep(100);
//       }
//       cols[i].style.transform = "translateY(0px)";
//       cols[j].style.transform = "translateY(0px)";
//       cols[i].style.backgroundColor = "blue";
//       cols[j].style.backgroundColor = "blue";
//       await sleep(delay);
//     }
//   }
//   isSorting = false;
//   icon.classList.remove("fa-pause");
//   icon.classList.add("fa-play");
// }

function sleep(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
