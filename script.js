let bars = document.querySelectorAll(".bar");

const startBtn = document.getElementById("playPauseBtn");
const resetBtn = document.getElementById("resetBtn");

const msInput = document.getElementById("speed");

const sizeInput = document.getElementById("arraySize");

const playIcon = playPauseBtn.querySelector(".play-icon");
const pauseIcon = playPauseBtn.querySelector(".pause-icon");
let algorithmSelect = document.getElementById("algorithmSelect");
let currentAlgorithmDisplay = document.getElementById("currentAlgorithm");
const parent = document.querySelector(".bars-container");
const sizeError = document.getElementById("sizeError");

const visualSection = document.querySelector(".visualization-container");

let isSorting = false;
let isPaused = false;
let sorted = false;

let algorithm = "bubble";
const algorithms = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  merge: "Merge Sort",
  quick: "Quick Sort",
};
algorithmSelect.addEventListener("change", (e) => {
  algorithm = e.target.value;
  currentAlgorithmDisplay.textContent = algorithms[algorithm];
});

let nums = generateRandomArray();

sizeInput.addEventListener("change", (e) => {
  nums = generateRandomArray();
});

//generate random array
function generateRandomArray() {
  const arr = [];
  let size = sizeInput.value ? parseInt(sizeInput.value) : 5;
  if (size < 5) {
    sizeError.textContent = "Size should be at least 5";
    size = 5;
  }
  if (innerWidth < 480) {
    if (size > 15) {
      sizeError.textContent = "Size should not exceed 15";
      size = Math.min(size, 15);
    }
  } else {
    if (size > 30) {
      sizeError.textContent = "Size should not exceed 30";
      size = Math.min(size, 30);
    }
  }
  setTimeout(() => {
    sizeError.textContent = "";
  }, 1500);

  sizeInput.value = size;

  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 47) + 3);
  }
  renderBars(arr);

  return arr;
}

function renderBars(arr) {
  const base = document.querySelector(".bars-container");
  base.innerHTML = "";
  arr.forEach((height, index) => {
    const bar = document.createElement("span");
    bar.classList.add("bar", "first-render");
    bar.classList.add(`bar${index + 1}`);
    bar.style.height = `${(height / 50) * 220}px`;

    const targetHeight = (height / 50) * 220;

    bar.style.setProperty("--target-height", `${targetHeight}px`);

    base.appendChild(bar);
  });

  bars = base.querySelectorAll(".bar");
  bars.forEach((col, index) => {
    col.textContent = arr[index];
  });

  requestAnimationFrame(() => {
    base.querySelectorAll(".bar").forEach((bar) => {
      bar.addEventListener(
        "animationend",
        () => {
          bar.classList.remove("first-render");
        },
        { once: true }
      );
    });
  });
}

resetBtn.addEventListener("click", () => {
  nums = generateRandomArray();
  if (isSorting) {
    isSorting = false;
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    algorithmSelect.disabled = false;
    sizeInput.disabled = false;
  }
});
startBtn.addEventListener("click", async () => {
  if (!isSorting) {
    isSorting = true;
    isPaused = false;

    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");
    algorithmSelect.disabled = true;
    sizeInput.disabled = true;
    msInput.disabled = true;

    if (sorted) {
      renderBars(nums);
    }
    let colsArr = Array.from(bars);
    switch (algorithm) {
      case "bubble":
        await bubbleSort(parent, colsArr);
        break;
      case "selection":
        await selectionSort(parent, colsArr);
        break;
      case "insertion":
        visualSection.style.alignItems = "flex-start";

        await insertionSort(parent, colsArr);
        visualSection.style.alignItems = "center";

        break;
      case "merge":
        visualSection.style.alignItems = "flex-start";
        const result = await mergeSort(parent, colsArr, 0, colsArr.length - 1);
        result.forEach((col) => {
          col.style.backgroundColor = "#34d399";
        });
        visualSection.style.alignItems = "center";
        break;
      case "quick":
        await quickSort(parent, colsArr, 0, colsArr.length - 1);
        colsArr.forEach((col) => {
          col.style.backgroundColor = "#34d399";
        });
        break;
    }

    sorted = true;
    isSorting = false;
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    algorithmSelect.disabled = false;
    sizeInput.disabled = false;
    msInput.disabled = false;
  } else if (!isPaused) {
    isPaused = true;
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
  } else {
    isPaused = false;
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");
  }
});

async function swapBars(parent, colA, colB, cols, depth = 1) {
  if (colA == colB) {
    return;
  }
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  const indexA = Array.prototype.indexOf.call(cols, colA);
  const indexB = Array.prototype.indexOf.call(cols, colB);
  const space = indexA - indexB;
  // colA.style.backgroundColor = "#fb923c";
  // colB.style.backgroundColor = "#fb923c";
  await sleep(delay);
  colA.style.backgroundColor = "#fb7185";
  colB.style.backgroundColor = "#fb7185";
  await sleep(delay);

  if (algorithm == "quick") {
    if (space != 1) {
      colA.style.transform = `translateX(0px) translateY(${depth * 30}px)`;
      colB.style.transform = `translateX(0px) translateY(${depth * 30}px)`;
      await sleep();
      colA.style.transform = `translateX(${-20 * space}px) translateY(${
        depth * 30
      }px)`;
      colB.style.transform = `translateX(${20 * space}px) translateY(${
        depth * 30
      }px)`;
    } else {
      if (depth == 1) {
        colA.style.transform = `translateX(${-20 * space}px) translateY(0px)`;
        colB.style.transform = `translateX(${20 * space}px) translateY(0px)`;
      } else {
        colA.style.transform = `translateX(${-20 * space}px) translateY(30px)`;
        colB.style.transform = `translateX(${20 * space}px) translateY(30px)`;
      }
    }
  } else if (algorithm == "selection") {
    colA.style.transform = `translateX(0px) translateY(${depth * 30}px)`;
    colB.style.transform = `translateX(0px) translateY(${depth * 30}px)`;
    await sleep();
    colA.style.transform = `translateX(${-20 * space}px) translateY(${
      depth * 30
    }px)`;
    colB.style.transform = `translateX(${20 * space}px) translateY(${
      depth * 30
    }px)`;
  } else {
    colA.style.transform = `translateX(${-20 * space}px) translateY(${
      depth * 30
    }px)`;
    colB.style.transform = `translateX(${20 * space}px) translateY(${
      depth * 30
    }px)`;
  }
  await sleep(delay);
  let next = colA.nextSibling;
  parent.insertBefore(colA, colB);
  parent.insertBefore(colB, next);
  if (algorithm == "quick" && depth == 2 && space == 1) {
    colA.style.transform = `translateX(0px) translateY(${(depth - 1) * 30}px)`;
    colB.style.transform = `translateX(0px) translateY(${(depth - 1) * 30}px)`;
  } else {
    colA.style.transform = `translateX(0px) translateY(${depth * 30}px)`;
    colB.style.transform = `translateX(0px) translateY(${depth * 30}px)`;
  }
  await sleep(delay);

  colA.style.backgroundColor = "#a78bfa";
  colB.style.backgroundColor = "#a78bfa";
  if (algorithm == "quick" && depth == 2) {
    colA.style.transform = `translateX(0px) translateY(${(depth - 1) * 30}px)`;
    colB.style.transform = `translateX(0px) translateY(${(depth - 1) * 30}px)`;
  } else {
    colA.style.transform = "translateX(0px) translateY(0px)";
    colB.style.transform = "translateX(0px) translateY(0px)";
  }
  [cols[indexA], cols[indexB]] = [cols[indexB], cols[indexA]];
}

async function part(parent, cols, start, end, depth = 1) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  let pivot = cols[start];
  cols[start].style.backgroundColor = "#fcd34d";
  await sleep(delay);
  while (isPaused) {
    await sleep(100);
  }
  let count = 0;
  for (let i = start + 1; i <= end; i++) {
    cols[i].style.backgroundColor = "#fcd34d";
    if (parseInt(cols[i].style.height) < parseInt(pivot.style.height)) {
      count++;
    }
    await sleep(delay);
    if (depth == 2) {
      cols[i].style.backgroundColor = "#22d3ee";
    } else {
      cols[i].style.backgroundColor = "#a78bfa";
    }

    while (isPaused) {
      await sleep(100);
    }
  }
  await sleep(delay);

  let pivotIdx = start + count;
  await swapBars(parent, cols[pivotIdx], cols[start], cols, depth);
  //cols[start].style.backgroundColor = "#22d3ee";

  pivot.style.backgroundColor = "#34d399";
  await sleep(delay);
  while (isPaused) {
    await sleep(100);
  }

  let i = start;
  let j = end;

  while (i < pivotIdx && j > pivotIdx) {
    cols[i].style.backgroundColor = "#fcd34d";
    cols[j].style.backgroundColor = "#fcd34d";
    await sleep(delay);
    while (
      parseInt(cols[i].style.height) < parseInt(pivot.style.height) &&
      cols[i] != pivot
    ) {
      cols[i].style.backgroundColor = "#a78bfa";
      i++;
    }
    cols[i].style.backgroundColor = "#fcd34d";
    while (isPaused) {
      await sleep(100);
    }
    while (
      parseInt(cols[j].style.height) > parseInt(pivot.style.height) &&
      cols[j] != pivot
    ) {
      cols[j].style.backgroundColor = "#a78bfa";
      j--;
    }
    cols[j].style.backgroundColor = "#fcd34d";

    while (isPaused) {
      await sleep(100);
    }
    await sleep(delay);
    if (i < pivotIdx && j > pivotIdx) {
      await swapBars(parent, cols[i], cols[j], cols);
      cols[i].style.backgroundColor = "#a78bfa";
      cols[j].style.backgroundColor = "#a78bfa";
    }
    i++;
    j--;
    while (isPaused) {
      await sleep(100);
    }
  }
  cols[pivotIdx].style.backgroundColor = "#34d399";
  if (pivotIdx == end - 1) {
    cols[end].style.backgroundColor = "#34d399";
  }
  if (pivotIdx == start + 1) {
    cols[start].style.backgroundColor = "#34d399";
  }
  return pivotIdx;
}
async function quickSort(parent, cols, start, end) {
  let depth = 1;
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  if (start >= end) {
    return;
  }

  if (start !== 0 || end !== sizeInput.value - 1) {
    await sleep(delay);
    for (let k = start; k <= end; k++) {
      cols[k].style.backgroundColor = "#22d3ee";
      cols[k].style.transform = "translateX(0px) translateY(30px)";
      depth = 2;
    }
  }

  let p = await part(parent, cols, start, end, depth);

  if (depth == 2) {
    for (let k = start; k <= end; k++) {
      cols[k].style.transform = "translateX(0px) translateY(0px)";
    }
    await sleep(delay);
  }

  cols[p].style.backgroundColor = "#34d399";

  await quickSort(parent, cols, start, p - 1);
  await quickSort(parent, cols, p + 1, end);
}

async function mergeSort(parent, cos, start, end, depth = 0) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;

  if (start >= end) {
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

  for (let i = start; i <= end; i++) {
    cos[i].style.backgroundColor = "#22d3ee"; // unsorted color
  }
  await sleep(delay);

  return await merge(parent, cos, sortedLeft, sortedRight, depth + 1);
}

async function merge(parent, cols, left, right, depth) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  let result = [];
  let i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    left[i].style.backgroundColor = "#fcd34d";
    right[j].style.backgroundColor = "#fcd34d";
    await sleep(delay);
    while (isPaused) {
      await sleep(100);
    }
    let leftVal = parseInt(left[i].style.height);
    let rightVal = parseInt(right[j].style.height);

    if (leftVal < rightVal) {
      result.push(left[i]);
      left[i].style.backgroundColor = "#34d399";
      left[i].style.transform = `translateY(${(depth + 1) * 30}px)`;
      await sleep(delay);
      i++;
    } else {
      parent.insertBefore(right[j], left[i]);

      right[j].style.transform = `translateY(${(depth + 1) * 30}px)`;
      await sleep(delay);
      right[j].style.backgroundColor = "#34d399";

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
    left[i].style.backgroundColor = "#34d399";
    left[i].style.transform = `translateY(${(depth + 1) * 30}px)`;
    await sleep(delay);
    i++;
  }
  while (j < right.length) {
    result.push(right[j]);
    right[j].style.backgroundColor = "#34d399";
    right[j].style.transform = `translateY(${(depth + 1) * 30}px)`;
    await sleep(delay);
    j++;
  }

  result.forEach((col) => {
    col.style.transform = `translateY(${(depth - 2) * 30}px)`;
    col.style.backgroundColor = "#34d399";
  });
  await sleep(delay);
  return result;
}

async function insertionSort(parent, cols) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  for (let i = 1; i < cols.length; ++i) {
    let key = cols[i];
    let j = i - 1;
    await sleep(delay);
    cols[j].style.backgroundColor = "#34d399";
    if (parseInt(cols[j].style.height) <= parseInt(key.style.height)) {
      key.style.transform = `translateY(${parseInt(key.style.height) + 20}px)`;
      key.style.backgroundColor = "#fb923c";
      await sleep(delay);
      key.style.backgroundColor = "#34d399";
      key.style.transform = "translateY(0px)";
      await sleep(delay);
    }

    while (
      j >= 0 &&
      parseInt(cols[j].style.height) > parseInt(key.style.height)
    ) {
      key.style.transform = `translateY(${parseInt(key.style.height) + 20}px)`;
      key.style.backgroundColor = "#fb923c";

      await sleep(delay);
      parent.insertBefore(cols[j], key.nextSibling);
      cols = parent.children;

      await sleep(delay);
      while (isPaused) {
        await sleep(100);
      }

      j--;
    }
    key.style.transform = "translateY(0px)";
    key.style.backgroundColor = "#34d399";
  }
  await sleep(delay);
  cols = Array.from(parent.children);
  cols.forEach((col) => {
    col.style.backgroundColor = "#34d399";
  });
}

async function selectionSort(parent, cols) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;

  for (let i = 0; i < cols.length - 1; ++i) {
    let minidx = i;
    for (let j = i + 1; j < cols.length; j++) {
      if (!isSorting) {
        return;
      }
      while (isPaused) {
        await sleep(100);
      }

      cols[minidx].style.backgroundColor = "#fcd34d";

      await sleep(delay);
      cols[j].style.backgroundColor = "#fcd34d";
      await sleep(delay);
      while (isPaused) {
        await sleep(100);
      }
      if (
        parseInt(cols[j].style.height) < parseInt(cols[minidx].style.height)
      ) {
        cols[minidx].style.backgroundColor = "#a78bfa";
        minidx = j;
      } else {
        cols[j].style.backgroundColor = "#a78bfa";
      }
    }

    await swapBars(parent, cols[minidx], cols[i], cols, 1);
    while (isPaused) {
      await sleep(100);
    }
    cols[minidx].style.backgroundColor = "#a78bfa";
    cols[i].style.backgroundColor = "#34d399";

    await sleep(delay);
  }
  cols.forEach((col) => {
    col.style.backgroundColor = "#34d399";
  });
}

async function bubbleSort(parent, cols) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;

  for (let i = 0; i < cols.length - 1; ++i) {
    let swapped = false;
    for (let j = 0; j < cols.length - i - 1; ++j) {
      if (!isSorting) {
        return;
      }
      while (isPaused) {
        await sleep(100);
      }
      cols[j].style.backgroundColor = "#fcd34d";
      cols[j + 1].style.backgroundColor = "#fcd34d";
      await sleep(delay);
      while (isPaused) {
        await sleep(100);
      }
      if (parseInt(cols[j].style.height) > parseInt(cols[j + 1].style.height)) {
        await swapBars(parent, cols[j + 1], cols[j], cols, 0);
        swapped = true;
        await sleep(delay);
      }
      while (isPaused) {
        await sleep(100);
      }
      await sleep(delay);
      cols[j].style.backgroundColor = "#a78bfa";
      cols[j + 1].style.backgroundColor = "#a78bfa";
    }
    cols[cols.length - i - 1].style.backgroundColor = "#34d399";
    await sleep(delay);
    if (!swapped) {
      break;
    }
  }
  await sleep(delay);
  cols.forEach((col) => {
    col.style.backgroundColor = "#34d399";
  });
}

function sleep(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
