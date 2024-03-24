function kirkpatrickSeidel(points) {
    if (points.length < 3) return points;
    
    const convex_hull = [];

    let p_umin = points[0],p_umax = points[points.length-1];
    let p_lmin = points[0],p_lmax = points[points.length-1];
    for(let p of points){
        if(p.x < p_umin.x || (p.x == p_umin.x && p.y > p_umin.y)) p_umin = p;
        if(p.x < p_lmin.x || (p.x == p_lmin.x && p.y < p_lmin.y)) p_lmin = p;

        if(p.x > p_umax.x || (p.x == p_umax.x && p.y > p_umax.y)) p_umax = p;
        if(p.x > p_lmax.x || (p.x == p_lmax.x && p.y < p_lmax.y)) p_lmax = p;
    }
    const T_u = [],T_l = [];
    for(let p of points){
        if(p.x > p_umin.x && p.x < p_umax.x) T_u.push(p)
        if(p.x > p_lmin.x && p.x < p_lmax.x) T_l.push(p)
    }
    upper_hull(p_umin,p_umax,T_u,convex_hull);
    lower_hull(p_lmin,p_lmax,T_l,convex_hull);
}

function median_of_medians(list, i){
    const sublists = [];
    for (let j = 0; j < list.length; j += 5) {
        sublists.push(list.slice(j, j + 5));
    }
    const medians = sublists.map(sublist => {
        sublist = sublist.sort((a, b) => a - b);
        return sublist[sublist.length / 2 >> 0];
    });
    let pivot;
    if(medians.length <= 5) pivot = medians.sort((a, b) => a - b)[medians.length / 2 >> 0];
    else pivot = median_of_medians(medians,medians.length / 2 >> 0);

    const low = [], high = [];
    let flag = 1;
    for (let j = 0; j < list.length; j++) {
        if (list[j] < pivot) low.push(list[j]);
        else if(list[j]==pivot && flag){
            flag = 0;
            low.push(pivot);
        }
        else high.push(list[j]);
    }
    if (i < low.length) return median_of_medians(low, i);
    else if (i > low.length) return median_of_medians(high, i - low.length - 1);
    else return pivot;
}

function upper_hull(p_min,p_max,T){
    console.log(T, T.map(p => p.x) , T.length / 2 >> 0)
    a = median_of_medians(T.map(p => p.x) , T.length / 2 >> 0);

    const T_l = [], T_r = [];
    for (let p of T) {
        if (p.x <= a.x) T_l.push(p);
        else T_r.push(p);
    }

    (p_l,p_r) = upper_bridge(p_min,p_max,T_l,T_r);
    T_l = 
}

function lower_hull(p_min,p_max,T){
    a = median_of_medians(T.map(p => p.x) , T.length / 2 >> 0);
}

points = [
    { x: 100, y: 100 },
    { x: 100, y: 400 },
    { x: 250, y: 50 },
    { x: 250, y: 450 },
    { x: 400, y: 400 },
    { x: 250, y: 250 },
];