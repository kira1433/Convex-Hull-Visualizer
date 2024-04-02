async function kirkpatrickSeidel_fast(points, cnt) {
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
        if(p.x > p_umin.x && p.x < p_umax.x && (p.y - p_umin.y)*(p_umax.x - p_umin.x) - (p.x - p_umin.x)*(p_umax.y - p_umin.y) < 0) T_u.push(p)
        if(p.x > p_lmin.x && p.x < p_lmax.x && (p.y - p_lmin.y)*(p_lmax.x - p_lmin.x) - (p.x - p_lmin.x)*(p_lmax.y - p_lmin.y) > 0) T_l.push(p)
    }
    if(cnt==counter) {
        for(let p of points)p.color = 'black';
    }
    await upper_hull_fast(p_umin,p_umax,T_u,-1,-1,cnt);
    await upper_hull_fast(p_lmin,p_lmax,T_l,1,1,cnt);

    if(cnt==counter) drawLineFromMid(p_lmin,p_umin,200,'red');
    if(cnt==counter) drawLineFromMid(p_lmax,p_umax,200,'red');
    await wait(1000);
}


async function upper_hull_fast(p_min,p_max,T_,xsign,ysign,cnt){
    const T = [p_min,p_max,...T_];

    if(cnt==counter) p_min.color = 'red';
    if(cnt==counter) p_max.color = 'red';

    if(T.length%2 == 0) var a = (median_of_medians(T.map(p => p.x) , (T.length / 2) | 0) + median_of_medians(T.map(p => p.x) , (T.length / 2 - 1) | 0)) / 2;
    else var a = median_of_medians(T.map(p => p.x) , (T.length / 2) | 0);

    await wait(1000);
    let p = await upper_bridge_fast(T , a,ysign,cnt);
    let p_l = p[0], p_r = p[1];
    for(let p of points){
        if(p.color != 'red') p.color = 'black';
    }
    if(cnt==counter) drawLineFromMid(p_l,p_r,200,'red');

    if(cnt!=counter) p_min.color = 'black';
    if(cnt!=counter) p_max.color = 'black';
    await wait(1000);
    if(cnt==counter) p_min.color = 'black';
    if(cnt==counter) p_max.color = 'black';

    const T_l = [], T_r = [];
    for(let p of T_){
        if(p.x < p_l.x) T_l.push(p);
        if(p.x > p_r.x) T_r.push(p);
    }

    if(xsign == -1){
        if(p_l == p_min && p_r == p_max) return [p_min,p_max];
        else if(p_l == p_min) return [p_min,...await upper_hull_fast(p_r,p_max,T_r,xsign,ysign,cnt)];
        else if(p_r == p_max) return [...await upper_hull_fast(p_min,p_l,T_l,xsign,ysign,cnt),p_max];
        else return [...await upper_hull_fast(p_min,p_l,T_l,xsign,ysign,cnt),...await upper_hull_fast(p_r,p_max,T_r,xsign,ysign,cnt)];
    }
    else{
        if(p_l == p_min && p_r == p_max) return [p_max,p_min];
        else if(p_l == p_min) return [...await upper_hull_fast(p_r,p_max,T_r,xsign,ysign,cnt),p_min];
        else if(p_r == p_max) return [p_max,...await upper_hull_fast(p_min,p_l,T_l,xsign,ysign,cnt)];
        else return [...await upper_hull_fast(p_r,p_max,T_r,xsign,ysign,cnt),...await upper_hull_fast(p_min,p_l,T_l,xsign,ysign,cnt)];
    }
}


function upper_bridge_fast(S , a , sign){
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
            if(sign*pair[0].y > sign*pair[1].y) candidates.push(pair[0]);
            else candidates.push(pair[1]);
        } 
        else slopes.push((sign*pair[0].y - sign*pair[1].y) / (pair[0].x - pair[1].x));
    }
    if(slopes.length == 0)return upper_bridge(candidates,a,sign);

    const K = median_of_medians(slopes, (slopes.length / 2) | 0);
    const SMALL=[],EQUAL=[],LARGE=[];
    for(let pair of pairs){
        if(!checkEqual(pair[0].x, pair[1].x)){
            const slope = (sign*pair[0].y - sign*pair[1].y) / (pair[0].x - pair[1].x);
            if(slope < K) SMALL.push(pair);
            else if(checkEqual(slope, K)) EQUAL.push(pair);
            else LARGE.push(pair);
        } 
    }
    let mx = -Infinity;
    for(let p of S){
        if(sign*p.y - K*p.x > mx) mx = sign*p.y - K*p.x;
    }
    const MAX = [];
    for(let p of S){
        if(checkEqual(sign*p.y - K*p.x, mx)) MAX.push(p);
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
    return upper_bridge_fast(candidates,a,sign);
}