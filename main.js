var jarvis_cnt = 0, kirk_cnt = 0;
canvas.addEventListener('click', async(event) => {
    await clear();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points.push({ x, y });
    drawCurrent();
});

async function clear() {
    jarvis_cnt++;
    kirk_cnt++;
    lines.length = 0;
    temp_lines.length = 0;
    drawCurrent();
}

// Add event listener for clear button
const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', async() => {
    points.length = 0;
    await clear();
});

// Add event listener for rand button
const randBtn = document.getElementById('randBtn');
randBtn.addEventListener('click', async() => {
    points.length = 0;
    await clear();
    drawRandomPoints();
});

// Jarvis March Convex Hull algorithm
const jarvisMarchBtn = document.getElementById('jarvisMarchBtn');
jarvisMarchBtn.addEventListener('click', async () => {
    await clear();
    jarvisMarch(points, jarvis_cnt);
});

// Kirkpatrick-Seidel Convex Hull algorithm
const kirkpatrickSeidelBtn = document.getElementById('kirkpatrickSeidelBtn');
kirkpatrickSeidelBtn.addEventListener('click', async () => {
    await clear();
    kirkpatrickSeidel(points, kirk_cnt);
});

setInterval(drawCurrent, 5);
drawRandomPoints();