function checkEqual(a, b, tolerance = 1e-6) {
    return Math.abs(a - b) <= tolerance;
  }

function kirkpatrickSeidel(points) {
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
    console.log("UPPER_HULL")
    const upper_hull_inverted = upper_hull(p_umin_inverted,p_umax_inverted,T_u_inverted);
    const upper = upper_hull_inverted.map(p => ({x : p.x , y : -p.y}));
    console.log("LOWER_HULL")
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

    let eq = 0;
    const low = [], high = [];
    for (let j = 0; j < list.length; j++) {
        if (list[j] < pivot) low.push(list[j]);
        else if(list[j]==pivot){
            eq++;
        }
        else high.push(list[j]);
    }
    if (i < low.length) return median_of_medians(low, i);
    else if (i > low.length + eq) return median_of_medians(high, i - low.length - 1);
    else return pivot;
}

function upper_hull(p_min,p_max,T_){
    if(T_.length == 0) return [p_min,p_max];
    const T = [p_min,p_max,...T_];
    a = median_of_medians(T.map(p => p.x) , (T.length / 2) | 0);
    console.log("P_MIN",p_min,"P_MAX",p_max,"T",T)  
    let p = upper_bridge(T , a);
    let p_l = p[0], p_r = p[1];
    console.log("P_L",p_l,"P_R",p_r)
    const T_l = [], T_r = [];
    for(let p of T_){
        if(p.x < p_l.x) T_l.push(p);
        if(p.x > p_r.x) T_r.push(p);
    }
    console.log("T_L",T_l,"T_R",T_r);
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
    console.log("PAIRS",pairs)
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
    console.log("SLOPES",slopes)
    const K = median_of_medians(slopes, (slopes.length / 2) | 0);
    console.log("K",K)
    const SMALL=[],EQUAL=[],LARGE=[];
    for(let pair of pairs){
        if(pair[0].x != pair[1].x){
            const slope = (pair[0].y - pair[1].y) / (pair[0].x - pair[1].x);
            if(slope < K) SMALL.push(pair);
            else if(checkEqual(slope, K)) EQUAL.push(pair);
            else LARGE.push(pair);
        } 
    }
    console.log("SMALL",SMALL,"EQUAL",EQUAL,"LARGE",LARGE)
    let mx = -Infinity;
    for(let p of S){
        console.log("p",p,"c",p.y - K*p.x)
        if(p.y - K*p.x > mx) mx = p.y - K*p.x;
    }
    console.log("mx",mx);
    const MAX = [];
    for(let p of S){
        if(checkEqual(p.y - K*p.x, mx)) MAX.push(p);
    }
    console.log("MAX",MAX)
    let p_k = MAX[0],p_m = MAX[0];
    for(let p of MAX){
        if(p.x < p_k.x ) p_k = p;
        if(p.x > p_m.x ) p_m = p;
    }
    console.log("P_K",p_k,"P_M",p_m)
    console.log("A",a)
    console.log("CANDIDATES",candidates)
    if(p_k.x <= a && p_m.x>a) return [p_k,p_m];
    console.log("CANDIDATES",candidates)
    if(p_m.x <= a){
        for(let pair of LARGE)candidates.push(pair[1]);
        for(let pair of EQUAL)candidates.push(pair[1]);
        for(let pair of SMALL){
            candidates.push(pair[0]);
            candidates.push(pair[1]);
        }
    }
    console.log("CANDIDATES",candidates)
    if(p_k.x > a){
        for(let pair of SMALL)candidates.push(pair[0]);
        for(let pair of EQUAL)candidates.push(pair[0]);
        for(let pair of LARGE){
            candidates.push(pair[0]);
            candidates.push(pair[1]);
        }
    }  
    console.log("CANDIDATES",candidates)    
    return upper_bridge(candidates,a);
}
