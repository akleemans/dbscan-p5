var colors = [
    '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'
];
var Point = (function () {
    function Point(x, y, visited, noise, clusterId) {
        if (visited === void 0) { visited = false; }
        if (noise === void 0) { noise = false; }
        this.x = x;
        this.y = y;
        this.visited = visited;
        this.noise = noise;
        this.clusterId = clusterId;
    }
    return Point;
}());
var MIN_PTS = 3;
var EPSILON = 20;
var CLUSTERING_DONE = false;
var examplePoints = [
    {
        "x": 138,
        "y": 110,
        "visited": false,
        "noise": false,
    },
    {
        "x": 137,
        "y": 127,
        "visited": false,
        "noise": false
    },
    {
        "x": 125,
        "y": 119,
        "visited": false,
        "noise": false
    },
    {
        "x": 125,
        "y": 104,
        "visited": false,
        "noise": false
    },
    {
        "x": 154,
        "y": 74,
        "visited": false,
        "noise": false
    },
    {
        "x": 157,
        "y": 84,
        "visited": false,
        "noise": false
    },
    {
        "x": 165,
        "y": 76,
        "visited": false,
        "noise": false
    },
    {
        "x": 169,
        "y": 85,
        "visited": false,
        "noise": false
    },
    {
        "x": 163,
        "y": 96,
        "visited": false,
        "noise": false
    },
    {
        "x": 179,
        "y": 98,
        "visited": false,
        "noise": false
    },
    {
        "x": 177,
        "y": 107,
        "visited": false,
        "noise": false
    },
    {
        "x": 112,
        "y": 178,
        "visited": false,
        "noise": false
    },
    {
        "x": 130,
        "y": 218,
        "visited": false,
        "noise": false
    },
    {
        "x": 51,
        "y": 239,
        "visited": false,
        "noise": false
    },
    {
        "x": 63,
        "y": 221,
        "visited": false,
        "noise": false
    },
    {
        "x": 44,
        "y": 219,
        "visited": false,
        "noise": false
    },
    {
        "x": 46,
        "y": 208,
        "visited": false,
        "noise": false
    },
    {
        "x": 57,
        "y": 208,
        "visited": false,
        "noise": false
    },
    {
        "x": 89,
        "y": 94,
        "visited": false,
        "noise": false
    },
    {
        "x": 81,
        "y": 111,
        "visited": false,
        "noise": false
    },
    {
        "x": 77,
        "y": 128,
        "visited": false,
        "noise": false
    },
    {
        "x": 70,
        "y": 119,
        "visited": false,
        "noise": false
    },
    {
        "x": 71,
        "y": 94,
        "visited": false,
        "noise": false
    },
    {
        "x": 89,
        "y": 76,
        "visited": false,
        "noise": false
    },
    {
        "x": 65,
        "y": 109,
        "visited": false,
        "noise": false
    },
    {
        "x": 70,
        "y": 79,
        "visited": false,
        "noise": false
    },
    {
        "x": 96,
        "y": 59,
        "visited": false,
        "noise": false
    },
    {
        "x": 99,
        "y": 72,
        "visited": false,
        "noise": false
    },
    {
        "x": 118,
        "y": 50,
        "visited": false,
        "noise": false
    },
    {
        "x": 104,
        "y": 67,
        "visited": false,
        "noise": false
    }
];
var points = examplePoints;
var w = 650;
var h = 400;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    var myCanvas = createCanvas(w, h);
    myCanvas.parent('canvasDiv');
    frameRate(10);
}
function draw() {
    for (var i = 0; i < points.length; i++) {
        var point_1 = points[i];
        var color_1 = point_1.clusterId !== undefined ? colors[point_1.clusterId] : '#000000';
        fill(color_1 !== null && color_1 !== void 0 ? color_1 : '#000000');
        circle(point_1.x, point_1.y, 10);
    }
}
var clusterPoints = function () {
    if (CLUSTERING_DONE) {
        clearClustering();
    }
    MIN_PTS = +document.getElementById('min-pts').value;
    EPSILON = +document.getElementById('epsilon').value;
    console.log('Start clustering ', points, 'with MIN_PTS=', MIN_PTS, 'EPSILON=', EPSILON);
    var clusterId = 0;
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        var point_2 = points_1[_i];
        if (point_2.visited) {
            continue;
        }
        point_2.visited = true;
        var neighbors = getPointsInRange(point_2);
        if (neighbors.length < MIN_PTS) {
            point_2.noise = true;
        }
        else {
            clusterId += 1;
            expandCluster(point_2, neighbors, clusterId);
        }
    }
    CLUSTERING_DONE = true;
};
var clearClustering = function () {
    points.forEach(function (p) {
        p.visited = false;
        p.clusterId = undefined;
        p.noise = false;
    });
    CLUSTERING_DONE = false;
};
var getPointsInRange = function (p1) {
    var neighbors = [p1];
    for (var _i = 0, points_2 = points; _i < points_2.length; _i++) {
        var p2 = points_2[_i];
        if (isNear(p1, p2)) {
            neighbors.push(p2);
        }
    }
    return neighbors;
};
var expandCluster = function (point, neighbors, clusterId) {
    point.clusterId = clusterId;
    for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
        var p2 = neighbors_1[_i];
        if (!p2.visited) {
            p2.visited = true;
            var neighbors2 = getPointsInRange(p2);
            if (neighbors2.length >= MIN_PTS) {
                neighbors.push.apply(neighbors, neighbors2.filter(function (n) { return neighbors.indexOf(n) === -1; }));
            }
        }
        if (p2.clusterId === undefined) {
            p2.clusterId = clusterId;
            p2.noise = false;
        }
    }
};
var resetPoints = function () {
    console.log('Clearing points.');
    points = [];
    clear();
};
var randomPoints = function () {
    for (var i = 0; i < 50; i++) {
        points.push(new Point(Math.random() * w, Math.random() * h));
    }
};
var getMousePos = function (canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return new Point(event.clientX - rect.left, event.clientY - rect.top);
};
var isNear = function (p1, p2) {
    var x2 = Math.pow(Math.abs(p1.x - p2.x), 2);
    var y2 = Math.pow(Math.abs(p1.y - p2.y), 2);
    return Math.pow((x2 + y2), 0.5) < EPSILON;
};
function mouseClicked(event) {
    var canvas = document.getElementsByTagName('canvas')[0];
    var pos = getMousePos(canvas, event);
    if (pos.x >= 0 && pos.x < w && pos.y > 0 && pos.y < h) {
        points.push(pos);
        console.log('Current points:', points);
    }
}
//# sourceMappingURL=../src/src/build.js.map