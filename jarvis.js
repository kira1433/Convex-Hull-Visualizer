// Jarvis March Convex Hull algorithm
function jarvisMarch(points) {
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
            if (orientation(points[p], points[i], points[q]) == 2)
                q = i;
        }

        p = q;

    } while (p != leftmost);

    return hull;
}