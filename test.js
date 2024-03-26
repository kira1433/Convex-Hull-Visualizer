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

// Jarvis March Convex Hull algorithm
async function jarvisMarch(points , cnt) {
    if (points.length == 2){
        if(cnt == jarvis_cnt) drawLine(points[0],points[1],200,'red');
    }
    if(points.length < 3) return;

    function orientation(p, q, r) {
        let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val == 0) return 0;
        return (val > 0) ? 1 : 2;
    }

    // Find the leftmost point
    let leftmost = 0;
    for (let i = 1; i < points.length; i++) {
        if (points[i].x < points[leftmost].x)
            leftmost = i;
    }

    const hull = [];
    let p = leftmost;
    let q;
    do {
        hull.push(points[p]);
        q = (p + 1) % points.length;

        for (let i = 0; i < points.length; i++) {
            // If i is more counterclockwise than current q, then update q
            if (orientation(points[p], points[i], points[q]) == 2 || q== i){
                q = i;
//dont edit from here
                // if(hull.length<2 || points[i]!=hull[hull.length-2]){
                //     if(cnt == counter) drawTempLine(points[p],points[i],100,'green');
                //     await wait((200));
                // }
            }
            // else{
            //     if(hull.length<2 || points[i]!=hull[hull.length-2]){
            //         if(cnt == counter) drawTempLine(points[p],points[i],100,'blue');
            //         await wait((200));
            //     }
            // }
        }

        // await wait((1000));
        // if(cnt == counter) drawLine(points[p],points[q],200,'red');
        // if(cnt == counter) temp_lines.length = 0;
        // await wait((1200));
//dont edit to here
        p = q;
    } while (p != leftmost);

    return;
}


function checkEqual(a, b, tolerance = 1e-6) {
    return Math.abs(a - b) <= tolerance;
  }

function kirkpatrickSeidel(points, cnt) {
    if (points.length < 3) return points;
    
    let p_umin = points[0],p_umax = points[points.length-1];
    let p_lmin = points[0],p_lmax = points[points.length-1];
    for(let p of points){
        if(p.x < p_umin.x || (checkEqual(p.x, p_umin.x) && p.y < p_umin.y)) p_umin = p;
        if(p.x < p_lmin.x || (checkEqual(p.x, p_lmin.x) && p.y > p_lmin.y)) p_lmin = p;

        if(p.x > p_umax.x || (checkEqual(p.x, p_umax.x) && p.y < p_umax.y)) p_umax = p;
        if(p.x > p_lmax.x || (checkEqual(p.x, p_lmax.x) && p.y > p_lmax.y)) p_lmax = p;
    }
    const T_u = [],T_l = [];
    for(let p of points){
        if(p.x > p_umin.x && p.x < p_umax.x) T_u.push(p)
        if(p.x > p_lmin.x && p.x < p_lmax.x) T_l.push(p)
    }
    const T_u_inverted = T_u.map(p => ({x : p.x , y : -p.y}));
    const p_umin_inverted = {x : p_umin.x , y : -p_umin.y};
    const p_umax_inverted = {x : p_umax.x , y : -p_umax.y};
    const upper_hull_inverted = upper_hull(p_umin_inverted,p_umax_inverted,T_u_inverted);
    const upper = upper_hull_inverted.map(p => ({x : p.x , y : -p.y}));
    const lower = upper_hull(p_lmin,p_lmax,T_l);
    lower.reverse();
    return [...upper,...lower];
}

function median_of_medians(list, i){
    if(list.length <= 5) return list.sort((a, b) => a - b)[i];
    const sublists = [];
    for (let j = 0; j < list.length; j += 5) {
        sublists.push(list.slice(j, j + 5));
    }
    const medians = sublists.map(sublist => {
        sublist = sublist.sort((a, b) => a - b);
        return sublist[(sublist.length / 2) | 0];
    });
    const pivot = median_of_medians(medians,(medians.length / 2)| 0);

    const low = [], high = [];
    for (let j = 0; j < list.length; j++) {
        if (list[j] < pivot) low.push(list[j]);
        else high.push(list[j]);
    }
    if (i < low.length) return median_of_medians(low, i);
    else if (i > low.length) return median_of_medians(high, i - low.length - 1);
    else return pivot;
}

function upper_hull(p_min,p_max,T_){
    if(T_.length == 0) return [p_min,p_max];
    const T = [p_min,p_max,...T_];
    var a = median_of_medians(T.map(p => p.x) , (T.length / 2) | 0);
    let p = upper_bridge(T , a);
    let p_l = p[0], p_r = p[1];
    const T_l = [], T_r = [];
    for(let p of T_){
        if(p.x < p_l.x) T_l.push(p);
        if(p.x > p_r.x) T_r.push(p);
    }
    if(p_l == p_min && p_r == p_max) return [p_min,p_max];
    else if(p_l == p_min) return [p_min,...upper_hull(p_r,p_max,T_r)];
    else if(p_r == p_max) return [...upper_hull(p_min,p_l,T_l),p_max];
    else return [...upper_hull(p_min,p_l,T_l),...upper_hull(p_r,p_max,T_r)];
}

function upper_bridge(S , a){
    const pairs = [];
    const candidates = [];
    for(let i = 0; i+1 < S.length; i+=2){
        if(S[i].x <= S[i+1].x){
            pairs.push([S[i], S[i+1]]);
        } else {
            pairs.push([S[i+1], S[i]]);
        }
    }
    if(S.length == 2) return pairs[0];
    if(S.length % 2) candidates.push(S[S.length-1]);
    const slopes = [];
    for(let pair of pairs){
        if(checkEqual(pair[0].x, pair[1].x)){
            if(pair[0].y > pair[1].y) candidates.push(pair[0]);
            else candidates.push(pair[1]);
        } 
        else slopes.push((pair[0].y - pair[1].y) / (pair[0].x - pair[1].x));
    }
    if(slopes.length == 0)return upper_bridge(candidates,a);

    const K = median_of_medians(slopes, (slopes.length / 2) | 0);
    const SMALL=[],EQUAL=[],LARGE=[];
    for(let pair of pairs){
        if(!checkEqual(pair[0].x, pair[1].x)){
            const slope = (pair[0].y - pair[1].y) / (pair[0].x - pair[1].x);
            if(slope < K) SMALL.push(pair);
            else if(checkEqual(slope, K)) EQUAL.push(pair);
            else LARGE.push(pair);
        } 
    }
    let mx = -Infinity;
    for(let p of S){
        if(p.y - K*p.x > mx) mx = p.y - K*p.x;
    }
    const MAX = [];
    for(let p of S){
        if(checkEqual(p.y - K*p.x, mx)) MAX.push(p);
    }
    let p_k = MAX[0],p_m = MAX[0];
    for(let p of MAX){
        if(p.x < p_k.x ) p_k = p;
        if(p.x > p_m.x ) p_m = p;
    }
    if(p_k.x <= a && p_m.x>a) return [p_k,p_m];
    if(p_m.x <= a){
        for(let pair of LARGE)candidates.push(pair[1]);
        for(let pair of EQUAL)candidates.push(pair[1]);
        for(let pair of SMALL){
            candidates.push(pair[0]);
            candidates.push(pair[1]);
        }
    }
    if(p_k.x > a){
        for(let pair of SMALL)candidates.push(pair[0]);
        for(let pair of EQUAL)candidates.push(pair[0]);
        for(let pair of LARGE){
            candidates.push(pair[0]);
            candidates.push(pair[1]);
        }
    }  
    return upper_bridge(candidates,a);
}