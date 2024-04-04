// Jarvis March Convex Hull algorithm
async function jarvisMarch(points , cnt) {
    if (points.length == 2){
        if(cnt == jarvis_cnt) drawLine(points[0],points[1],200,'red');
    }
    if(points.length < 3) return;

    function find(a, b, c) {
        if((b.y-a.y)*(c.x-b.x)-(b.x-a.x)*(c.y-b.y)==0) return 0;
        return ((b.y-a.y)*(c.x-b.x)-(b.x-a.x)*(c.y-b.y) > 0) ? 1 : 2;
    }

    let leftest = 0;
    for (let i = 1; i < points.length; i++) {
        if (points[i].x >= points[leftest].x)continue;
        leftest = i;
    }

    const hull = [];
    let a = leftest;
    let b;
    do {
        hull.push(points[a]);
        b = (a + 1) % points.length;
        
        if(cnt == counter){
            for(let p of points)p.color = 'black';
            points[b].color = 'red';
            drawTempLine(points[a],points[b],100,'green');
        }
        if(cnt==counter) Step = 1;
        if(cnt==counter) updateTextElement();
        await wait();

        for (let i = 0; i < points.length; i++) {
            if (find(points[a], points[i], points[b]) == 2 && i!= (a + 1) % points.length){
                b = i;
//dont edit from here
                if(hull.length<2 || points[i]!=hull[hull.length-2]){
                    if(cnt == counter){
                        for(let p of points)p.color = 'black';
                        points[i].color = 'red';
                        drawTempLine(points[a],points[i],100,'green');
                    }
                    if(cnt==counter) Step = 2;
                    if(cnt==counter) updateTextElement();
                    await wait();
                }
            }
            else if(i!= (a + 1) % points.length){
                if(hull.length<2 || points[i]!=hull[hull.length-2]){
                    if(cnt == counter) drawTempLine(points[a],points[i],100,'blue');
                    if(cnt==counter) Step = 3;
                    if(cnt==counter) updateTextElement();
                    await wait();
                }
            }
        }

        if(cnt==counter) Step = 4;
        if(cnt==counter) updateTextElement();
        await wait();
        if(cnt == counter) drawLine(points[a],points[b],200,'red');
        if(cnt == counter) temp_lines.length = 0;
        if(cnt==counter) Step = 5;
        if(cnt==counter) updateTextElement();
        await wait();
        if(cnt == counter){
            for(let p of points)p.color = 'black';
        }
//dont edit to here
        a = b;
    } while (a != leftest);

    if(cnt==counter) Step = 6;
    if(cnt==counter) updateTextElement();
    await wait();

    return;
}