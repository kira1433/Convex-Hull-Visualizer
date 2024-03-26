function checkEqual(a, b, tolerance = 1e-6) {
    return Math.abs(a - b) <= tolerance;
  }

async function kirkpatrickSeidel(points, cnt) {
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
    await upper_hull(p_umin,p_umax,T_u,-1,-1,cnt);
    await upper_hull(p_lmin,p_lmax,T_l,1,1,cnt);

    if(cnt==counter) drawLineFromMid(p_lmin,p_umin,200,'red');
    if(cnt==counter) drawLineFromMid(p_lmax,p_umax,200,'red');
    await wait((1200));
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

async function upper_hull(p_min,p_max,T_,xsign,ysign,cnt){
    const T = [p_min,p_max,...T_];

    if(cnt==counter) p_min.color = 'red';
    if(cnt==counter) p_max.color = 'red';

    if(T.length%2 == 0) var a = (median_of_medians(T.map(p => p.x) , (T.length / 2) | 0) + median_of_medians(T.map(p => p.x) , (T.length / 2 - 1) | 0)) / 2;
    else var a = median_of_medians(T.map(p => p.x) , (T.length / 2) | 0);

    if(cnt == counter) drawTempLineFromMid({x:a,y:0},{x:a,y:600},40,'blue');
    await wait((500));

    let p = await upper_bridge(T , a,ysign,cnt);
    let p_l = p[0], p_r = p[1];
    for(let p of points){
        if(p.color != 'red') p.color = 'black';
    }
    if(cnt==counter) temp_lines.length = 0;
    if(cnt==counter) drawLineFromMid(p_l,p_r,200,'red');
    if(cnt==counter) temp_lines.length = 0;

    if(cnt!=counter) p_min.color = 'black';
    if(cnt!=counter) p_max.color = 'black';
    await wait((1200));
    if(cnt==counter) p_min.color = 'black';
    if(cnt==counter) p_max.color = 'black';

    const T_l = [], T_r = [];
    for(let p of T_){
        if(p.x < p_l.x) T_l.push(p);
        if(p.x > p_r.x) T_r.push(p);
    }

    if(xsign == -1){
        if(p_l == p_min && p_r == p_max) return [p_min,p_max];
        else if(p_l == p_min) return [p_min,...await upper_hull(p_r,p_max,T_r,xsign,ysign,cnt)];
        else if(p_r == p_max) return [...await upper_hull(p_min,p_l,T_l,xsign,ysign,cnt),p_max];
        else return [...await upper_hull(p_min,p_l,T_l,xsign,ysign,cnt),...await upper_hull(p_r,p_max,T_r,xsign,ysign,cnt)];
    }
    else{
        if(p_l == p_min && p_r == p_max) return [p_max,p_min];
        else if(p_l == p_min) return [...await upper_hull(p_r,p_max,T_r,xsign,ysign,cnt),p_min];
        else if(p_r == p_max) return [p_max,...await upper_hull(p_min,p_l,T_l,xsign,ysign,cnt)];
        else return [...await upper_hull(p_r,p_max,T_r,xsign,ysign,cnt),...await upper_hull(p_min,p_l,T_l,xsign,ysign,cnt)];
    }
}

async function upper_bridge(S , a , sign,cnt){
    const pairs = [];
    const candidates = [];
    for(let p of points){
        if(cnt==counter && p.color != 'red') p.color = 'black';
    }
    if(cnt == counter) drawTempLineFromMid({x:a,y:0},{x:a,y:600},1,'blue');
    for(let p of S){
        if(cnt==counter && p.color == 'black') p.color = 'blue';
    }
    for(let i = 0; i+1 < S.length; i+=2){
        if(S[i].x <= S[i+1].x){
            pairs.push([S[i], S[i+1]]);
        } else {
            pairs.push([S[i+1], S[i]]);
        }
    }

    for(let p of pairs){
        if(cnt == counter) drawTempLine(p[0],p[1],50,'black');
    }
    await wait((2000));

    // if(S.length == 2) return pairs[0];
    if(S.length % 2){
        if(cnt==counter && S[S.length-1].color!='red') S[S.length-1].color = 'green';
        candidates.push(S[S.length-1]);
    } 

    const slopes = [];
    for(let pair of pairs){
        if(checkEqual(pair[0].x, pair[1].x)){
            if(sign*pair[0].y > sign*pair[1].y){
                 if(cnt==counter && pair[0].color!='red') pair[0].color = 'green';
                 candidates.push(pair[0]);
            }
            else{
                 if(cnt==counter && pair[1].color!='red') pair[1].color = 'green';
                 candidates.push(pair[1]);
            }
        } 
        else slopes.push((sign*pair[0].y - sign*pair[1].y) / (pair[0].x - pair[1].x));
    }
    if(slopes.length == 0)return upper_bridge(candidates,a,sign,cnt);

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

    if(cnt==counter) temp_lines.length = 0;
    if(cnt == counter) drawTempLineFromMid({x:a,y:0},{x:a,y:600},1,'blue');
    for(let p of EQUAL){
        if(cnt == counter) drawTempLine(p[0],p[1],1,'purple');
    }
    for(let p of LARGE){
        if(cnt == counter) drawTempLine(p[0],p[1],1,'brown');
    }
    for(let p of SMALL){
        if(cnt == counter) drawTempLine(p[0],p[1],1,'orange');
    }
    await wait((2000));
    
    for(let p of S){
        let c = p.y - sign*K*p.x;
        let y0 = -sign*K*1000 + c
        let y1 = sign*K*1000 + c
        if(cnt == counter) drawTempLineFromMid({x:-1000,y:y0},{x:1000,y:y1},1,'violet');
    }
    await wait((2000));


    let mx = -Infinity;
    for(let p of S){
        if(sign*p.y - K*p.x > mx) {
            mx = sign*p.y - K*p.x;
            c = p.y - K*p.x;
        }
    }

    const MAX = [];
    for(let p of S){
        if(checkEqual(sign*p.y - K*p.x, mx)) MAX.push(p);
    }
    let p_k = MAX[0],p_m = MAX[0];

    if(cnt==counter) temp_lines.length = 0;
    if(cnt == counter) drawTempLineFromMid({x:a,y:0},{x:a,y:600},1,'blue');
    for(let p of EQUAL){
        if(cnt == counter) drawTempLine(p[0],p[1],1,'purple');
    }
    for(let p of LARGE){
        if(cnt == counter) drawTempLine(p[0],p[1],1,'brown');
    }
    for(let p of SMALL){
        if(cnt == counter) drawTempLine(p[0],p[1],1,'orange');
    }

    let y0 = -sign*K*1000 + (-sign*K*p_k.x + p_k.y)
    let y1 = sign*K*1000 + (-sign*K*p_k.x + p_k.y)
    if(cnt == counter) drawTempLineFromMid({x:-1000,y:y0},{x:1000,y:y1},1,'violet');
    await wait((2000));
    
    for(let p of MAX){
        if(p.x < p_k.x ) p_k = p;
        if(p.x > p_m.x ) p_m = p;
    }
    if(p_k.x <= a && p_m.x>a) return [p_k,p_m];
    if(p_m.x <= a){
        for(let pair of LARGE){
            if(cnt==counter && pair[1].color!='red') pair[1].color = 'green';
            candidates.push(pair[1]);
        }
        await wait((2000));
        for(let pair of EQUAL){
            if(cnt==counter && pair[1].color!='red') pair[1].color = 'green';
            candidates.push(pair[1]);
        }
        await wait((2000));
        for(let pair of SMALL){
            if(cnt==counter && pair[0].color!='red') pair[0].color = 'green';
            if(cnt==counter && pair[1].color!='red') pair[1].color = 'green';
            candidates.push(pair[0]);
            candidates.push(pair[1]);
        }
        await wait((2000));
    }

    if(p_k.x > a){
        for(let pair of SMALL){
            if(cnt==counter && pair[0].color!='red') pair[0].color = 'green';
            candidates.push(pair[0]);
        }
        await wait((2000));
        for(let pair of EQUAL){
            if(cnt==counter && pair[0].color!='red') pair[0].color = 'green';
            candidates.push(pair[0]);
        }
        await wait((2000));
        for(let pair of LARGE){
            if(cnt==counter && pair[0].color!='red') pair[0].color = 'green';
            if(cnt==counter && pair[1].color!='red') pair[1].color = 'green';
            candidates.push(pair[0]);
            candidates.push(pair[1]);
        }
        await wait((2000));
    }  
    if(cnt == counter) temp_lines.length = 0;
    if(cnt == counter) drawTempLineFromMid({x:a,y:0},{x:a,y:600},1,'blue');
    await wait((2000));

    return upper_bridge(candidates,a,sign,cnt);
}

// function upper_bridge(S , a , sign){
//     const pairs = [];
//     const candidates = [];
//     for(let i = 0; i+1 < S.length; i+=2){
//         if(S[i].x <= S[i+1].x){
//             pairs.push([S[i], S[i+1]]);
//         } else {
//             pairs.push([S[i+1], S[i]]);
//         }
//     }
//     if(S.length == 2) return pairs[0];
//     if(S.length % 2) candidates.push(S[S.length-1]);
//     const slopes = [];
//     for(let pair of pairs){
//         if(checkEqual(pair[0].x, pair[1].x)){
//             if(sign*pair[0].y > sign*pair[1].y) candidates.push(pair[0]);
//             else candidates.push(pair[1]);
//         } 
//         else slopes.push((sign*pair[0].y - sign*pair[1].y) / (pair[0].x - pair[1].x));
//     }
//     if(slopes.length == 0)return upper_bridge(candidates,a,sign);

//     const K = median_of_medians(slopes, (slopes.length / 2) | 0);
//     const SMALL=[],EQUAL=[],LARGE=[];
//     for(let pair of pairs){
//         if(!checkEqual(pair[0].x, pair[1].x)){
//             const slope = (sign*pair[0].y - sign*pair[1].y) / (pair[0].x - pair[1].x);
//             if(slope < K) SMALL.push(pair);
//             else if(checkEqual(slope, K)) EQUAL.push(pair);
//             else LARGE.push(pair);
//         } 
//     }
//     let mx = -Infinity;
//     for(let p of S){
//         if(sign*p.y - K*p.x > mx) mx = sign*p.y - K*p.x;
//     }
//     const MAX = [];
//     for(let p of S){
//         if(checkEqual(sign*p.y - K*p.x, mx)) MAX.push(p);
//     }
//     let p_k = MAX[0],p_m = MAX[0];
//     for(let p of MAX){
//         if(p.x < p_k.x ) p_k = p;
//         if(p.x > p_m.x ) p_m = p;
//     }
//     if(p_k.x <= a && p_m.x>a) return [p_k,p_m];
//     if(p_m.x <= a){
//         for(let pair of LARGE)candidates.push(pair[1]);
//         for(let pair of EQUAL)candidates.push(pair[1]);
//         for(let pair of SMALL){
//             candidates.push(pair[0]);
//             candidates.push(pair[1]);
//         }
//     }
//     if(p_k.x > a){
//         for(let pair of SMALL)candidates.push(pair[0]);
//         for(let pair of EQUAL)candidates.push(pair[0]);
//         for(let pair of LARGE){
//             candidates.push(pair[0]);
//             candidates.push(pair[1]);
//         }
//     }  
//     return upper_bridge(candidates,a,sign);
// }