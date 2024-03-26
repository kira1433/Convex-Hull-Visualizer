// Jarvis March Convex Hull algorithm
async function jarvisMarch(points , cnt) {
    if (points.length < 3) return points;

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
                if(cnt != jarvis_cnt) return;
                if(!hull.includes(points[i]) || (hull.length!=2 && points[i]==hull[0]))drawTempLine(points[p],points[i],100,'green');
            }
            else{
                if(cnt != jarvis_cnt) return;
                if(!hull.includes(points[i]) || (hull.length!=2 && points[i]==hull[0]))drawTempLine(points[p],points[i],100,'blue');
            }
        }

        await new Promise(done => setTimeout(() => done(), 2000));
        if(cnt != jarvis_cnt) return;
        drawLine(points[p],points[q],200,'red');
        temp_lines.length = 0;
//dont edit to here
        p = q;
    } while (p != leftmost);

    return hull;
}