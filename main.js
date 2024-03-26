var counter = 0;
canvas.addEventListener('click', async(event) => {
    await clear();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points.push({ x, y ,color:'black'});
    drawCurrent();
});

async function clear() {
    counter++;
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
    drawRandomPoints(10);
});

// Jarvis March Convex Hull algorithm
const jarvisMarchBtn = document.getElementById('jarvisMarchBtn');
jarvisMarchBtn.addEventListener('click', async () => {
    await clear();
    jarvisMarch(points, counter);
});

// Kirkpatrick-Seidel Convex Hull algorithm
const kirkpatrickSeidelBtn = document.getElementById('kirkpatrickSeidelBtn');
kirkpatrickSeidelBtn.addEventListener('click', async () => {
    await clear();
    kirkpatrickSeidel(points, counter);
});

setInterval(drawCurrent, 5);
drawRandomPoints(10);