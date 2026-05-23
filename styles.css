const sheet = document.getElementById("sheet");
let selectedItem = null;

document.addEventListener("keydown", function(event) {
  if ((event.key === "Delete" || event.key === "Backspace") && selectedItem) {
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

function updateGrid() {
  const size = document.getElementById("gridSize").value;
  const color = document.getElementById("gridColor").value;

  sheet.style.backgroundImage = `
    linear-gradient(${color} 1px, transparent 1px),
    linear-gradient(90deg, ${color} 1px, transparent 1px)
  `;

  sheet.style.backgroundSize = `${size}px ${size}px`;
}

function selectItem(el) {
  if (selectedItem) {
    selectedItem.classList.remove("selected");
  }

  selectedItem = el;
  selectedItem.classList.add("selected");
}

function addText(type) {
  const text = document.getElementById("letterText").value || "А а";

  const el = document.createElement("div");
  el.className = `item text-item ${type === "dashed" ? "dashed" : ""}`;
  el.textContent = text;
  el.style.left = "120px";
  el.style.top = "120px";

  makeDraggable(el);
  sheet.appendChild(el);
}

function addSticker(emoji) {
  const el = document.createElement("div");
  el.className = "item sticker-item";
  el.textContent = emoji;
  el.style.left = "200px";
  el.style.top = "200px";

  makeDraggable(el);
  sheet.appendChild(el);
}

function addTask() {
  const el = document.createElement("div");
  el.className = "item task";
  el.textContent = "Обведи буквы и продолжи строку ✍️";
  el.style.left = "80px";
  el.style.top = "40px";

  makeDraggable(el);
  sheet.appendChild(el);
}

function addReward() {
  const el = document.createElement("div");
  el.className = "item reward";
  el.textContent = "Молодец! ⭐";
  el.style.left = "520px";
  el.style.top = "980px";

  makeDraggable(el);
  sheet.appendChild(el);
}

function makeDraggable(el) {
  let shiftX = 0;
  let shiftY = 0;

  el.addEventListener("click", function(event) {
    event.stopPropagation();
    selectItem(el);
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

function clearSheet() {
  sheet.innerHTML = "";
  selectedItem = null;
}

async function downloadPNG() {
  const dataUrl = await htmlToImage.toPng(sheet);

  const link = document.createElement("a");
  link.download = "propisi-lab.png";
  link.href = dataUrl;
  link.click();
}

async function downloadPDF() {
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
        <p>Лист создан в конструкторе прописей.</p>
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
