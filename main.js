// Add event listener for mouse clicks
canvas.addEventListener('click', (event) => {
    lines.length = 0;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points.push({ x, y });
    drawPrevious();
});

// Add event listener for clear button
const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', () => {
    points.length = 0; // Clear the points array
    lines.length = 0;
    drawPrevious(); // Redraw the canvas (now empty)
});

// Add event listener for rand button
const randBtn = document.getElementById('randBtn');
randBtn.addEventListener('click', () => {
    drawRandomPoints();
});

// Jarvis March Convex Hull algorithm
const jarvisMarchBtn = document.getElementById('jarvisMarchBtn');
jarvisMarchBtn.addEventListener('click', async () => {
    lines.length = 0;
    drawPrevious();
    const hull = jarvisMarch(points);
    for(let i=0;i<hull.length;i++){
        await new Promise(done => setTimeout(() => done(), 1000));  
        animateLine([hull[i]], [hull[(i+1)%hull.length]]);
    }
});

// Kirkpatrick-Seidel Convex Hull algorithm
const kirkpatrickSeidelBtn = document.getElementById('kirkpatrickSeidelBtn');
kirkpatrickSeidelBtn.addEventListener('click', () => {
    lines.length = 0;
    drawPrevious();
    const steps = kirkpatrickSeidel(points);
    animateLine();
});

drawRandomPoints();