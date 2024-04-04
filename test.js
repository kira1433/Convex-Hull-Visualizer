var us = require('microtime');
async function main(){
const check = [10,100,1000,10000,100000]
const res = [];
for(let k = 0;k<5;k++){
    for(let pointCnt of check){
        const points = generateRandomPoints(pointCnt);
        var start = us.now();
        let h = (await kirkpatrickSeidel(points,0)).length;
        var end = us.now();
        var timeElapsed = end - start;
        // res.push([pointCnt,h,timeElapsed]);
        console.log(pointCnt,h,timeElapsed)
        // console.log(`Time elapsed for ${pointCnt} points: ${timeElapsed}μs`)
    }
}
// console.log(res)
}

main()

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
