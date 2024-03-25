const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const points = [], lines = [];

function drawPrevious() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        ctx.lineTo(line[1].x, line[1].y);
        ctx.strokeStyle = 'red';
        ctx.stroke();
    });
}

function animateLine(p, q) {
    const delay = 5; // Delay in milliseconds
    const mid = [], current_1 = [], current_2 = [], dx=[], dy=[], xStep=[], yStep=[];
    const vis = new Array(p.length);
    let vis_cnt = 0;
    for (let i = 0; i < p.length; i++) {
        vis[i] = 0;
    }
    for (let i = 0; i < p.length; i++) {
        mid.push({x : (p[i].x + q[i].x)/2 , y : (p[i].y + q[i].y)/2});
        current_1.push({x : (p[i].x + q[i].x)/2 , y : (p[i].y + q[i].y)/2});
        current_2.push({x : (p[i].x + q[i].x)/2 , y : (p[i].y + q[i].y)/2});
        dx.push(q[i].x - p[i].x);
        dy.push(q[i].y - p[i].y);
        xStep.push(dx[i] / 100);
        yStep.push(dy[i] / 100);
    }

    function drawNextStep() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw points
        drawPrevious()
        for (let i = 0; i < p.length; i++) {
            // Draw lines 
            if(vis[i] == 1) continue;
            ctx.beginPath();
            ctx.moveTo(mid[i].x, mid[i].y);
            ctx.lineTo(current_1[i].x, current_1[i].y);
            ctx.strokeStyle = 'red';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(mid[i].x, mid[i].y);
            ctx.lineTo(current_2[i].x, current_2[i].y);
            ctx.strokeStyle = 'red';
            ctx.stroke();

            current_1[i].x += xStep[i];
            current_1[i].y += yStep[i];
            current_2[i].x -= xStep[i];
            current_2[i].y -= yStep[i];

            if (Math.abs(current_1[i].x - q[i].x) < Math.abs(xStep[i]) || Math.abs(current_1[i].y - q[i].y) < Math.abs(yStep[i])) {
                current_1[i].x = q[i].x;
                current_1[i].y = q[i].y;
            }
            if (Math.abs(current_2[i].x - p[i].x) < Math.abs(xStep[i]) || Math.abs(current_2[i].y - p[i].y) < Math.abs(yStep[i])) {
                current_2[i].x = p[i].x;
                current_2[i].y = p[i].y;
            }

            if (current_1[i].x === q[i].x && current_1[i].y === q[i].y) {
                lines.push([p[i],q[i]]);
                vis[i] = 1;
                vis_cnt++;
                continue;
            }
        }
        if(vis_cnt == p.length) return;
        setTimeout(drawNextStep, delay);
    }

    setTimeout(drawNextStep, delay);
}

function drawRandomPoints() {
    points.length = 0; // Clear the points array
    lines.length = 0;
    generateRandomPoints().forEach(point => {
        points.push(point)
    });
    drawPrevious();
}

