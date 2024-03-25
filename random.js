function generateNormalPoint(mean, variance) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return Math.round(mean + z * Math.sqrt(variance));
}

function generateRandomPoints() {
    const numPoints = 10;
    const mean = 300;
    const variance = 10000;

    let points = [];
    // for (let i = 0; i < numPoints; i++) {
    //     points.push({
    //         x: Math.max(0, Math.min(generateNormalPoint(mean, variance), 600)),
    //         y: Math.max(0, Math.min(generateNormalPoint(mean, variance), 600))
    //     });
    // }

    points = [
        {x: 121, y: 425},
        {x: 121, y: 305},
        {x: 341, y: 204},
        {x: 297, y: 253},
        {x: 286, y: 156},
        {x: 269, y: 237},
        {x: 260, y: 203},
        {x: 189, y: 278},
        {x: 174, y: 456},
        {x: 325, y: 393},
    ]
    return points;
}

