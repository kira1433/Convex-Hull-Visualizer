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

