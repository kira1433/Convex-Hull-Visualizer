var us = require('microtime');
const check = [10,100,1000,10000,100000]

for(let pointCnt of check){
    const points = generateRandomPoints(pointCnt);
    const times = [];
    for (let i = 0; i < 10; i++) {
        var start = us.now();
        jarvisMarch(points,0);
        var end = us.now();
        var timeElapsed = end - start;
        times.push(timeElapsed);
    }
    
    var avgTimeElapsed = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`Time elapsed for ${pointCnt} points: ${timeElapsed}μs`)
}

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
            x: Math.max(0, Math.min(generateNormalPoint(mean, variance), 600)),
            y: Math.max(0, Math.min(generateNormalPoint(mean, variance), 600))
        });
    }
    return points;
}
