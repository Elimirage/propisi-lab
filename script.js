const sheet = document.getElementById("sheet");

let selectedItem = null;

function updateValues() {
  document.getElementById("letterSizeValue").textContent =
    document.getElementById("letterSize").value;

  document.getElementById("taskSizeValue").textContent =
    document.getElementById("taskSize").value;

  document.getElementById("stickerSizeValue").textContent =
    document.getElementById("stickerSize").value;

  document.getElementById("rewardSizeValue").textContent =
    document.getElementById("rewardSize").value;
}

function updateGrid() {
  const size = document.getElementById("gridSize").value;
  const color = document.getElementById("gridColor").value;
  const type = document.getElementById("sheetType").value;

  document.getElementById("gridSizeValue").textContent = size;

  if (type === "grid") {
    sheet.style.backgroundImage = `
      linear-gradient(${color} 1px, transparent 1px),
      linear-gradient(90deg, ${color} 1px, transparent 1px)
    `;
    sheet.style.backgroundSize = `${size}px ${size}px`;
  }

  if (type === "line") {
    sheet.style.backgroundImage = `
      linear-gradient(${color} 1px, transparent 1px)
    `;
    sheet.style.backgroundSize = `100% ${size}px`;
  }

  if (type === "slant") {
    sheet.style.backgroundImage = `
      linear-gradient(${color} 1px, transparent 1px),
      repeating-linear-gradient(105deg, transparent 0, transparent ${size}px, rgba(160,160,160,0.45) ${size + 1}px, transparent ${size + 2}px)
    `;
    sheet.style.backgroundSize = `100% ${size}px, ${size * 2}px ${size}px`;
  }
}

function selectItem(el) {
  if (selectedItem) {
    selectedItem.classList.remove("selected");
  }

  selectedItem = el;
  selectedItem.classList.add("selected");
}

document.addEventListener("keydown", function(event) {
  if ((event.key === "Delete" || event.key === "Backspace") && selectedItem) {
    event.preventDefault();
    selectedItem.remove();
    selectedItem = null;
  }
});

sheet.addEventListener("click", function() {
  if (selectedItem) {
    selectedItem.classList.remove("selected");
    selectedItem = null;
  }
});

function makeDraggable(el) {
  let shiftX = 0;
  let shiftY = 0;

  el.addEventListener("click", function(event) {
    event.stopPropagation();
    selectItem(el);
  });

  el.addEventListener("dblclick", function(event) {
    event.stopPropagation();

    if (el.classList.contains("task") || el.classList.contains("reward") || el.classList.contains("text-item")) {
      const newText = prompt("Измени текст:", el.textContent);

      if (newText !== null) {
        el.textContent = newText;
      }
    }
  });

  el.addEventListener("mousedown", function(event) {
    event.preventDefault();
    event.stopPropagation();

    selectItem(el);

    shiftX = event.clientX - el.getBoundingClientRect().left;
    shiftY = event.clientY - el.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      const sheetRect = sheet.getBoundingClientRect();

      el.style.left = pageX - sheetRect.left - shiftX + "px";
      el.style.top = pageY - sheetRect.top - shiftY + "px";
    }

    function onMouseMove(event) {
      moveAt(event.clientX, event.clientY);
    }

    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener("mouseup", function() {
      document.removeEventListener("mousemove", onMouseMove);
    }, { once: true });
  });

  el.ondragstart = () => false;
}

function addText(type) {
  const text = document.getElementById("letterText").value || "А а";
  const size = document.getElementById("letterSize").value;

  const el = document.createElement("div");
  el.className = `item text-item ${type === "dashed" ? "dashed" : ""}`;
  el.textContent = text;
  el.style.fontSize = `${size}px`;
  el.style.left = "120px";
  el.style.top = "140px";

  makeDraggable(el);
  sheet.appendChild(el);
}

function addTask() {
  const text = document.getElementById("taskText").value || "Обведи буквы и продолжи строку ✍️";
  const size = document.getElementById("taskSize").value;

  const el = document.createElement("div");
  el.className = "item task";
  el.textContent = text;
  el.style.fontSize = `${size}px`;
  el.style.left = "70px";
  el.style.top = "50px";

  makeDraggable(el);
  sheet.appendChild(el);
}

function addSticker(emoji) {
  const size = document.getElementById("stickerSize").value;

  const el = document.createElement("div");
  el.className = "item sticker-item";
  el.textContent = emoji;
  el.style.fontSize = `${size}px`;
  el.style.left = "240px";
  el.style.top = "240px";

  makeDraggable(el);
  sheet.appendChild(el);
}

function addReward() {
  const text = document.getElementById("rewardText").value || "Молодец! ⭐";
  const size = document.getElementById("rewardSize").value;

  const el = document.createElement("div");
  el.className = "item reward";
  el.textContent = text;
  el.style.fontSize = `${size}px`;
  el.style.left = "520px";
  el.style.top = "980px";

  makeDraggable(el);
  sheet.appendChild(el);
}

function clearSheet() {
  sheet.innerHTML = "";
  selectedItem = null;
}

async function downloadPNG() {
  if (selectedItem) {
    selectedItem.classList.remove("selected");
  }

  const dataUrl = await htmlToImage.toPng(sheet);

  const link = document.createElement("a");
  link.download = "propisi-lab.png";
  link.href = dataUrl;
  link.click();
}

async function downloadPDF() {
  if (selectedItem) {
    selectedItem.classList.remove("selected");
  }

  const dataUrl = await htmlToImage.toPng(sheet);

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297);
  pdf.save("propisi-lab.pdf");
}

function downloadWord() {
  const html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>ПрописиLab</title>
      </head>
      <body>
        <h1>ПрописиLab</h1>
        <p>Word-версия страницы. Для печати лучше использовать PDF.</p>
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", html], {
    type: "application/msword"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "propisi-lab.doc";
  link.click();
}

updateValues();
updateGrid();
