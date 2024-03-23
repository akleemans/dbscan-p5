// Colors by Sasha Trubetskoy: https://sashamaps.net/docs/resources/20-colors/
const colors = [
    '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'
];

class Point {
    public constructor(
        public x: number,
        public y: number,
        public visited?: boolean,
        public noise?: boolean,
        public clusterId?: number
    ) {
    }
}

// DBSCAN parameters
let MIN_PTS = 3;
let EPSILON = 20;

let CLUSTERING_DONE = false;

const examplePoints: Point[] = [{x: 138, y: 110}, {x: 137, y: 127}, {x: 125, y: 119}, {x: 125, y: 104}, {x: 154, y: 74},
    {x: 157, y: 84}, {x: 165, y: 76}, {x: 169, y: 85}, {x: 163, y: 96}, {x: 179, y: 98}, {x: 177, y: 107},
    {x: 112, y: 178}, {x: 130, y: 218}, {x: 51, y: 239}, {x: 63, y: 221}, {x: 44, y: 219}, {x: 46, y: 208},
    {x: 57, y: 208}, {x: 89, y: 94}, {x: 81, y: 111}, {x: 77, y: 128}, {x: 70, y: 119}, {x: 71, y: 94}, {x: 89, y: 76},
    {x: 65, y: 109}, {x: 70, y: 79}, {x: 96, y: 59}, {x: 99, y: 72}, {x: 118, y: 50}, {x: 104, y: 67}, {x: 108, y: 194},
    {x: 123, y: 201}, {x: 127, y: 179}, {x: 65, y: 232}, {x: 103, y: 47}, {x: 173, y: 21}, {x: 130, y: 185},
    {x: 108, y: 204}];

let points: Point[] = examplePoints;

const w = 650;
const h = 400;

function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    const myCanvas = createCanvas(w, h);
    myCanvas.parent('canvasDiv');
    frameRate(10);
}

function draw() {
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        // @ts-ignore
        const color = point.clusterId !== undefined ? colors[point.clusterId] : '#000000';
        fill(color ?? '#000000');
        circle(point.x, point.y, 10);
    }
}


const clusterPoints = (): void => {
    if (CLUSTERING_DONE) {
        clearClustering();
    }
    MIN_PTS = +(document.getElementById('min-pts') as HTMLInputElement).value;
    EPSILON = +(document.getElementById('epsilon') as HTMLInputElement).value;
    console.log('Start clustering with MIN_PTS=', MIN_PTS, 'EPSILON=', EPSILON)

    // Cluster points using DBscan
    let clusterId = 0
    for (let point of points) {
        if (point.visited) {
            continue;
        }
        point.visited = true;
        const neighbors = getPointsInRange(point);
        if (neighbors.length < MIN_PTS) {
            point.noise = true;
        } else {
            clusterId += 1;
            expandCluster(point, neighbors, clusterId);
        }
    }
    CLUSTERING_DONE = true;
    console.log('Points:', points.map(p => `{x: ${p.x}, y: ${p.y}}`).join(', '));
};

const clearClustering = (): void => {
    points.forEach(p => {
        p.visited = false;
        p.clusterId = undefined;
        p.noise = false;
    });
    CLUSTERING_DONE = false;
};

const getPointsInRange = (p1: Point): Point[] => {
    const neighbors: Point[] = [p1];
    for (const p2 of points) {
        if (isNear(p1, p2)) {
            neighbors.push(p2)
        }
    }
    return neighbors;
}

const expandCluster = (point: Point, neighbors: Point[], clusterId: number): void => {
    point.clusterId = clusterId;
    for (const p2 of neighbors) {
        if (!p2.visited) {
            p2.visited = true;
            const neighbors2 = getPointsInRange(p2);
            if (neighbors2.length >= MIN_PTS) {
                neighbors.push(...neighbors2.filter(n => neighbors.indexOf(n) === -1));
            }
        }
        if (p2.clusterId === undefined) {
            // console.log('Assigning', clusterId, 'to', p2);
            p2.clusterId = clusterId;
            p2.noise = false;
        }
    }
};

const resetPoints = (): void => {
    console.log('Clearing points.');
    points = [];
    // @ts-ignore
    clear();
};

const randomPoints = () => {
    for (let i = 0; i < 50; i++) {
        points.push(new Point(Math.random() * w, Math.random() * h));
    }
}

const getMousePos = (canvas: HTMLElement, event: MouseEvent): Point => {
    const rect = canvas.getBoundingClientRect();
    return new Point(event.clientX - rect.left, event.clientY - rect.top);
}

const isNear = (p1: Point, p2: Point): boolean => {
    const x2 = Math.abs(p1.x - p2.x) ** 2;
    const y2 = Math.abs(p1.y - p2.y) ** 2;
    return (x2 + y2) ** 0.5 < EPSILON;
}

// Triggered by P5
function mouseClicked(event?: any): void {
    // Code adapted from: https://stackoverflow.com/a/17130415
    const canvas = document.getElementsByTagName('canvas')[0];
    const pos = getMousePos(canvas, event);

    if (pos.x >= 0 && pos.x < w && pos.y > 0 && pos.y < h) {
        points.push(pos)
    }
}
