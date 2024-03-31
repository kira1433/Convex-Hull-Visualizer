// Jarvis March Convex Hull algorithm
async function jarvisMarch(points , cnt) {
    // await wait((200));
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
        
        if(cnt == counter){
            for(let p of points)p.color = 'black';
            points[q].color = 'red';
            drawTempLine(points[p],points[q],100,'green');
        }
        marchStep = 1;
        await wait((200));

        for (let i = 0; i < points.length; i++) {
            // If i is more counterclockwise than current q, then update q
            if (orientation(points[p], points[i], points[q]) == 2){
                q = i;
//dont edit from here
                if(hull.length<2 || points[i]!=hull[hull.length-2]){
                    if(cnt == counter){
                        for(let p of points)p.color = 'black';
                        points[i].color = 'red';
                        drawTempLine(points[p],points[i],100,'green');
                    }
                    marchStep = 2;
                    await wait((200));
                }
            }
            else if(i!=q){
                if(hull.length<2 || points[i]!=hull[hull.length-2]){
                    if(cnt == counter) drawTempLine(points[p],points[i],100,'blue');
                    marchStep = 3;
                    await wait((200));
                }
            }
        }

        marchStep = 4;
        await wait((1000));
        if(cnt == counter) drawLine(points[p],points[q],200,'red');
        if(cnt == counter) temp_lines.length = 0;
        marchStep = 5;
        await wait((1200));
        if(cnt == counter){
            for(let p of points)p.color = 'black';
        }
//dont edit to here
        p = q;
    } while (p != leftmost);

    marchStep = 6;
    await wait(2000)

    return;
}