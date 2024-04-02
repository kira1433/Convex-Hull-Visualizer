function generateNormalPoint(mean, variance) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return Math.round(mean + z * Math.sqrt(variance));
}

function generateRandomPoints(numPoints = 10) {
    const mean = 300;
    const variance = 10000;

    let points = [];
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.max(5, Math.min(generateNormalPoint(mean, variance), 595)),
            y: Math.max(5, Math.min(generateNormalPoint(mean, variance), 595))
        });
    }
    return points;
}

function takeTextInput(){
    fetch("input.txt")
    .then(response => response.json())
    .then(data => {
        for(let i=0;i<data.length;i++){
            points.push({x: data[i].x, y: data[i].y, color: 'black'});
        }
    })
    .catch(error => {
        points.length = 0;
        const temp_points = [
            { "x": 120, "y": 400 },
            { "x": 320, "y": 200 },
            { "x": 500, "y": 100 },
            { "x": 200, "y": 300 },
            { "x": 450, "y": 350 },
            { "x": 50, "y": 150 },
            { "x": 550, "y": 450 },
            { "x": 100, "y": 500 },
            { "x": 420, "y": 50 },
            { "x": 300, "y": 580 }
          ]          
        points.push(...temp_points);
        if(points.length == 0) generateRandomPoints(10).forEach(point => {
            points.push({ x: point.x, y: point.y, color: 'black' });
        });
    });
}