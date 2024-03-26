const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const points = [], lines = [], temp_lines = [];

function drawCurrent() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    temp_lines.forEach(line => {
        ctx.beginPath();
        if(Math.abs(line.cur.x - line.ed.x) < 0.1 && Math.abs(line.cur.y - line.ed.y) < 0.1) line.cur = line.ed;
        else line.cur = {x : line.cur.x + (line.ed.x - line.st.x)/line.dt , y : line.cur.y + (line.ed.y - line.st.y)/line.dt};
        ctx.moveTo(line.st.x, line.st.y);
        ctx.lineTo(line.cur.x, line.cur.y);
        ctx.strokeStyle = line.color;
        ctx.stroke();
    });
    lines.forEach(line => {
        ctx.beginPath();
        if(Math.abs(line.cur.x - line.ed.x) < 0.1 && Math.abs(line.cur.y - line.ed.y) < 0.1) line.cur = line.ed;
        else line.cur = {x : line.cur.x + (line.ed.x - line.st.x)/line.dt , y : line.cur.y + (line.ed.y - line.st.y)/line.dt};
        ctx.moveTo(line.st.x, line.st.y);
        ctx.lineTo(line.cur.x, line.cur.y);
        ctx.strokeStyle = line.color;
        ctx.stroke();
    });
}

function drawLine(p,q,dt=100,color='red') {
    lines.push({st: p, cur:p , ed: q, color: color, dt : dt});
}

function drawLineFromMid(p,q,dt=100,color='red'){
    mid = {x : (p.x + q.x) / 2 , y : (p.y + q.y) / 2};
    drawLine(mid,p,dt,color);
    drawLine(mid,q,dt,color);
}

function drawTempLine(p,q,dt=100,color='red') {
    temp_lines.push({st: p, cur:p , ed: q, color: color, dt : dt});
}

function drawTempineFromMid(p,q,dt=100,color='red'){
    mid = {x : (p.x + q.x) / 2 , y : (p.y + q.y) / 2};
    drawTempLine(mid,p,dt,color);
    drawTempLine(mid,q,dt,color);
}


function drawRandomPoints() {
    points.length = 0; // Clear the points array
    lines.length = 0;
    generateRandomPoints().forEach(point => {
        points.push(point)
    });
    drawCurrent();
}

