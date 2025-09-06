let cols = document.querySelectorAll(".col");
const startBtn = document.getElementById("start");
const icon = startBtn.querySelector("i");
const msInput = document.getElementById("ms");
const sizeInput = document.getElementById("size");
const createBtn = document.getElementById("create");
const algolist = document.querySelector(".algoList");
const parent = document.querySelector(".cols");
const sizeError = document.getElementById("sizeError");

let isSorting = false;
let isPaused = false;

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
  }
});

let nums = generateRandomArray();

//generate random array
function generateRandomArray() {
  const arr = [];
  let size = sizeInput.value ? parseInt(sizeInput.value) : 5;
  if (size < 5) {
    sizeError.textContent = "Size should be at least 5";
    size = 5;
  }
  if (size > 20) {
    sizeError.textContent = "Size should not exceed 20";
    size = Math.min(size, 20);
  }
  sizeInput.value = size;

  setTimeout(() => {
    sizeError.textContent = "";
  }, 3000);

  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 49) + 1);
  }
  renderBars(arr);

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
        await bubbleSort(parent, cos);
        break;
      case "SELECTION":
        await selectionSort(parent, cos);
        break;
      case "INSERTION":
        await insertionSort(parent, cos);
        break;
      case "MERGE":
        const result = await mergeSort(parent, cos, 0, cos.length - 1);
        result.forEach((col) => {
          col.style.backgroundColor = "blue";
        });
        break;
      case "QUICK":
        await quickSort(parent, cos, 0, cos.length - 1);
        cols.forEach((col) => {
          col.style.backgroundColor = "blue";
        });
        break;
    }

    isSorting = false;
    icon.classList.remove("fa-play");
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

async function swapBars(parent, colA, colB, cols, depth = 1) {
  if (colA == colB) {
    return;
  }
  const indexA = Array.prototype.indexOf.call(cols, colA);
  const indexB = Array.prototype.indexOf.call(cols, colB);
  colA.style.backgroundColor = "red";
  colB.style.backgroundColor = "red";
  colA.style.transform = `translateY(${depth * 30}px)`;
  colB.style.transform = `translateY(${depth * 30}px)`;
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

async function part(parent, cols, start, end) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  let pivot = cols[start];
  cols[start].style.backgroundColor = "orange";
  await sleep(delay);
  while (isPaused) {
    await sleep(100);
  }
  let count = 0;
  for (let i = start + 1; i <= end; i++) {
    cols[i].style.backgroundColor = "yellow";
    if (parseInt(cols[i].style.height) < parseInt(pivot.style.height)) {
      count++;
    }
    await sleep(delay);
    cols[i].style.backgroundColor = "blue";
    while (isPaused) {
      await sleep(100);
    }
  }
  await sleep(delay);

  let pivotIdx = start + count;
  await swapBars(parent, cols[pivotIdx], cols[start], cols);
  pivot.style.backgroundColor = "orange";
  await sleep(delay);
  while (isPaused) {
    await sleep(100);
  }

  let i = start;
  let j = end;

  while (i < pivotIdx && j > pivotIdx) {
    cols[i].style.backgroundColor = "red";
    cols[j].style.backgroundColor = "red";
    await sleep(delay);
    while (
      parseInt(cols[i].style.height) < parseInt(pivot.style.height) &&
      cols[i] != pivot
    ) {
      cols[i].style.backgroundColor = "red";
      cols[i].style.backgroundColor = "blue";
      i++;
    }
    cols[i].style.backgroundColor = "red";
    while (isPaused) {
      await sleep(100);
    }
    while (
      parseInt(cols[j].style.height) > parseInt(pivot.style.height) &&
      cols[j] != pivot
    ) {
      cols[j].style.backgroundColor = "red";
      cols[j].style.backgroundColor = "blue";
      j--;
    }
    cols[j].style.backgroundColor = "red";

    while (isPaused) {
      await sleep(100);
    }
    await sleep(delay);
    if (i < pivotIdx && j > pivotIdx) {
      await swapBars(parent, cols[i], cols[j], cols);
    }
    i++;
    j--;
    while (isPaused) {
      await sleep(100);
    }
  }
  cols[pivotIdx].style.backgroundColor = "blue";
  return pivotIdx;
}
async function quickSort(parent, cols, start, end) {
  if (start >= end) {
    return;
  }
  let p = await part(parent, cols, start, end);

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

  return await merge(parent, sortedLeft, sortedRight, depth + 1);
}

async function merge(parent, left, right, depth) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  let result = [];
  let i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    left[i].style.backgroundColor = "red";
    right[j].style.backgroundColor = "red";
    await sleep(delay);
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

async function insertionSort(parent, cols) {
  let delay = msInput.value ? parseInt(msInput.value) : 500;
  for (let i = 1; i < cols.length; ++i) {
    let key = cols[i];
    let j = i - 1;
    await sleep(delay);
    cols[j].style.backgroundColor = "orange";
    if (parseInt(cols[j].style.height) <= parseInt(key.style.height)) {
      key.style.transform = `translateY(${parseInt(key.style.height) + 20}px)`;
      key.style.backgroundColor = "red";
      await sleep(delay);
      key.style.backgroundColor = "orange";
      key.style.transform = "translateY(0px)";
      await sleep(delay);
    }

    while (
      j >= 0 &&
      parseInt(cols[j].style.height) > parseInt(key.style.height)
    ) {
      key.style.transform = `translateY(${parseInt(key.style.height) + 20}px)`;
      key.style.backgroundColor = "red";

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
    key.style.backgroundColor = "orange";
  }
  await sleep(delay);
  cols = Array.from(parent.children);
  cols.forEach((col) => {
    col.style.backgroundColor = "blue";
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

      cols[minidx].style.backgroundColor = "red";

      await sleep(delay);
      cols[j].style.backgroundColor = "orange";
      await sleep(delay);
      while (isPaused) {
        await sleep(100);
      }
      if (
        parseInt(cols[j].style.height) < parseInt(cols[minidx].style.height)
      ) {
        cols[minidx].style.backgroundColor = "blue";
        minidx = j;
      } else {
        cols[j].style.backgroundColor = "blue";
      }
    }

    await swapBars(parent, cols[minidx], cols[i], cols, 0);
    while (isPaused) {
      await sleep(100);
    }
    cols[i].style.backgroundColor = "orange";

    cols[minidx].style.backgroundColor = "blue";
    await sleep(delay);
  }
  cols.forEach((col) => {
    col.style.backgroundColor = "blue";
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
      cols[j].style.backgroundColor = "red";
      cols[j + 1].style.backgroundColor = "red";
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

      cols[j].style.backgroundColor = "blue";
      cols[j + 1].style.backgroundColor = "blue";
    }
    cols[cols.length - i - 1].style.backgroundColor = "orange";
    await sleep(delay);
    if (!swapped) {
      break;
    }
  }
  await sleep(delay);
  cols.forEach((col) => {
    col.style.backgroundColor = "blue";
  });
}

function sleep(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
