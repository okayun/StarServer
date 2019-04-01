/* canvas テスト */

HEIGHT = 6 + 1;
WIDTH = 6 + 1;
EDGE = 71; // デフォルトが 7x7 のため

ACTION = 4;
ALPHA = 0.05;
GAMMA = 1.0;

NONE = 0;
WALL = 1;
USED = 2;
AGENT = 3;

IMAGE_NAME = "./img/icon.png";

class Queue {
    constructor() {
        this.head = 0;
        this.tail = 0;
        this.elements = new Array();
    }

    isEmpty() {
        return (this.head == this.tail);
    }

    pop() {
        if (this.head == this.tail) {
            return;
        }
        this.head += 1;
    }

    front() {
        return this.elements[this.head];
    }

    push(elem) {
        this.elements.push(elem);
        this.tail += 1;
    }
};

class Stack {
    constructor() {
        this.size = 0;
        this.element = new Array();
    }

    isEmpty() {
        return this.size == 0;
    }

    top() {
        return this.element[this.size - 1];
    }

    pop() {
        this.element.pop();
        this.size -= 1;
    }

    push(elem) {
        this.element.push(elem);
        this.size += 1;
    }
};

class Unit {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }
};

class UnionFind {
    constructor(n) {
        this.size = n;
        this.par = new Array(n);
        this.rank = new Array(n);

        for (var i = 0; i < this.size; ++i) {
            this.par[i] = i;
            this.rank[i] = 0;
        }
    }

    size() {
        return this.size;
    }

    root(x) {
        return (this.par[x] == x ? x : (this.par[x] = this.root(this.par[x])));
    }

    unite(x, y) {
        x = this.root(x);
        y = this.root(y);

        if (x == y) {
            return;
        }

        if (this.rank[x] < this.rank[y]) {
            this.par[x] = y;
        } else {
            this.par[y] = x;
            if (this.rank[x] == this.rank[y]) {
                this.rank[x]++;
            }
        }
    }

    same(x, y) {
        return this.root(x) == this.root(y);
    }
};

class Edge {
    constructor(s, t, cost) {
        this.s = s;
        this.t = t;
        this.cost = cost;
    }
};

// r, u, l, d
var vx = [1, 0, -1, 0], vy = [0, -1, 0, 1];
var is_running = false;
var field = new Array(HEIGHT);
var Q = new Array(HEIGHT);
var img = new Image();
var agent = new Unit(1, 1);

function getRandomInt(max_value) {
    return Math.floor(Math.random() * Math.floor(max_value));
}

onload = function () {
    canvas = document.getElementById('canvas_test');
    ctx = canvas.getContext('2d');
    q_table = document.getElementById('q_table');

    // 画像の読み込みを考慮
    init();
    setTimeout('draw()', 200);
    setTimeout('draw_q_table()', 210);
}

function init() {
    agent = new Unit(1, 1);
    img.src = IMAGE_NAME;

    for (var h = 0; h < HEIGHT; ++h) {
        field[h] = new Array(WIDTH);
        Q[h] = new Array(WIDTH);

        for (var w = 0; w < WIDTH; ++w) {
            Q[h][w] = new Array(ACTION);

            for (var a = 0; a < ACTION; ++a) {
                Q[h][w][a] = 0;
            }

            if ((h == 0) || (h + 1 == HEIGHT)) {
                field[h][w] = WALL;
            }
            else {
                field[h][w] = NONE;
            }
        }
        field[h][0] = field[h][WIDTH - 1] = WALL;
    }
}

// 壁を初期化する
function prepare_wall() {
    clear_canvas();

    for (var h = 1; h < HEIGHT - 1; h++) {
        for (var w = 1; w < WIDTH - 1; w++) {
            field[h][w] = NONE;
        }
    }
    for (var h = 2; h < HEIGHT - 1; h += 2) {
        for (var w = 2; w < WIDTH - 1; w += 2) {
            field[h][w] = WALL;
        }
    }

    draw();
}

// 棒倒し法
function stick_down() {
    prepare_wall();

    for (var h = 2; h < HEIGHT - 1; h += 2) {
        for (var w = 2; w < WIDTH - 1; w += 2) {
            var candidate = new Array();

            for (var i = 0; i < 4; ++i) {
                // 上方向は除外
                if (h != 2 && i == 1) {
                    continue;
                }

                var ny = h + vy[i], nx = w + vx[i];

                if (field[ny][nx] == NONE) {
                    candidate.push(new Unit(ny, nx));
                }
            }

            var idx = getRandomInt(candidate.length);

            field[candidate[idx].y][candidate[idx].x] = WALL;
        }
    }

    draw();
}

// 壁伸ばし法に使うやつ
// 座標 -> 頂点番号 の変換
function convertVertex(y, x) {
    return Math.floor(y / 2) * (Math.floor(WIDTH / 2) + 1) + Math.floor(x / 2);
}

// 壁伸ばし法
function wall_extend() {
    prepare_wall();

    // 頂点数
    var N = (Math.floor(HEIGHT / 2) + 1) * (Math.floor(WIDTH / 2) + 1);
    var uf = new UnionFind(N);

    // 上端と下端
    for (var w = 0; w < WIDTH - 1; w += 2) {
        var s = convertVertex(0, w);
        var t = convertVertex(0, w + 2);
        uf.unite(s, t);
        s = convertVertex(HEIGHT - 1, w);
        t = convertVertex(HEIGHT - 1, w + 2);
        uf.unite(s, t);
    }

    // 右端と左端
    for (var h = 0; h < HEIGHT - 1; h += 2) {
        var s = convertVertex(h, 0);
        var t = convertVertex(h + 2, 0);
        uf.unite(s, t);
        s = convertVertex(h, WIDTH - 1);
        t = convertVertex(h + 2, WIDTH - 1);
        uf.unite(s, t);
    }

    var edges = new Array();

    // 横方向の辺
    for (var h = 2; h < HEIGHT - 1; h += 2) {
        for (var w = 0; w < WIDTH - 1; w += 2) {
            var s = convertVertex(h, w), t = convertVertex(h, w + 2);

            edges.push(new Edge(s, t, getRandomInt(1000)));
        }
    }

    // 縦方向
    for (var w = 2; w < WIDTH - 1; w += 2) {
        for (var h = 0; h < HEIGHT - 1; h += 2) {
            var s = convertVertex(h, w), t = convertVertex(h + 2, w);

            edges.push(new Edge(s, t, getRandomInt(1000)));
        }
    }

    // コストを昇順にソート
    edges.sort(function (a, b) {
        if (a.cost < b.cost) return 1;
        if (a.cost > b.cost) return -1;
        return 0;
    });

    for (var i = 0; i < edges.length; ++i) {
        if (!uf.same(edges[i].s, edges[i].t)) {
            uf.unite(edges[i].s, edges[i].t);

            // 頂点番号 -> 座標 の変換
            var sh = Math.floor(edges[i].s / (Math.floor(WIDTH / 2) + 1)) * 2, sw = (edges[i].s % (Math.floor(WIDTH / 2) + 1)) * 2,
                th = Math.floor(edges[i].t / (Math.floor(WIDTH / 2) + 1)) * 2, tw = (edges[i].t % (Math.floor(WIDTH / 2) + 1)) * 2;

            if (sh == th) {
                var mh = sh, mw = Math.floor((sw + tw) / 2);
                if (field[mh][mw] == WALL) {
                    alert(edges[i].s + ", " + edges[i].t);
                    alert(mh + ", " + mw);
                    alert("Error");
                }
                field[mh][mw] = WALL;
                //alert(mh + ", " + mw);
            } else {
                var mh = Math.floor((sh + th) / 2), mw = sw;
                if (field[mh][mw] == WALL) {
                    alert(edges[i].s + ", " + edges[i].t);
                    alert(mh + ", " + mw);
                    alert("Error");
                }
                field[mh][mw] = WALL;
                //alert(mh + ", " + mw);
            }
        }
    }

    draw();
}

// キャラ変更
function change_character() {
    IMAGE_NAME = "./img/natori_prof.jpg";
    img.src = IMAGE_NAME;
    setTimeout('draw()', 200);
}

function draw() {
    ctx.beginPath();
    ctx.lineWidth = 1;

    for (var h = 0; h < HEIGHT; ++h) {
        for (var w = 0; w < WIDTH; ++w) {
            if (agent.y == h && agent.x == w) {
                ctx.drawImage(img, w * EDGE, h * EDGE, EDGE, EDGE);
            }
            else if (h == HEIGHT - 2 && w == WIDTH - 2) {
                ctx.fillStyle = 'rgb(128, 255, 255)';
                ctx.fillRect(w * EDGE, h * EDGE, EDGE, EDGE);
            }
            else if (field[h][w] !== NONE) {
                // 指定は (横, 縦, 横の辺, 縦の辺)
                ctx.fillStyle = (field[h][w] === WALL ? 'rgb(100, 100, 100)' : 'rgb(240, 110, 110)');
                ctx.fillRect(w * EDGE, h * EDGE, EDGE, EDGE);
            }
            else {
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(w * EDGE, h * EDGE, EDGE, EDGE);
            }
            /* 枠線を描く */
            ctx.strokeRect(w * EDGE, h * EDGE, EDGE, EDGE);
        }
    }
}

function bfs() {
    if (que.isEmpty()) {
        return;
    }

    var u = que.front();
    que.pop();

    for (var i = 0; i < 4; ++i) {
        var ny = u.y + vy[i], nx = u.x + vx[i];

        if (/*isInner(ny, nx) && */field[ny][nx] == NONE) {
            que.push(new Unit(ny, nx));
            field[ny][nx] = USED;
        }
    }

    draw();
}

function dfs() {
    if (stack.isEmpty()) {
        return;
    }

    var u = stack.top();
    var flag = true;

    for (var i = 0; i < 4; ++i) {
        var ny = u.y + vy[i], nx = u.x + vx[i];

        if (field[ny][nx] == NONE) {
            stack.push(new Unit(ny, nx));
            field[ny][nx] = USED;
            flag = false;
            break;
        }
    }

    if (flag) {
        stack.pop();
    }

    draw();
}

function q_learning() {
    var e = Math.max(1.0 - 0.9 * ql_iter / 10000, 0.05);
    ql_iter++;
    var action = 0;

    if (Math.random() < e) {
        action = getRandomInt(ACTION);
    }
    else {
        var max_q = -1e9;

        for (var a = 0; a < ACTION; ++a) {
            if (max_q < Q[agent.y][agent.x][a]) {
                max_q = Q[agent.y][agent.x][a];
                action = a;
            }
        }
    }

    var ny = agent.y + vy[action], nx = agent.x + vx[action];

    // 行き先が壁ならその場に留まる
    if (field[ny][nx] == WALL) {
        ny = agent.y;
        nx = agent.x;
    }

    var target_q = -1e9;
    for (var a = 0; a < ACTION; ++a) {
        target_q = Math.max(Q[ny][nx][a], target_q);
    }

    // ゴールなら将来の報酬の期待値は 0
    if (ny == HEIGHT - 2 && nx == WIDTH - 2) {
        target_q = 0;
    }

    Q[agent.y][agent.x][action] += ALPHA * (-1 + GAMMA * target_q - Q[agent.y][agent.x][action]);

    agent.y = ny;
    agent.x = nx;

    draw();
    draw_q_table();

    // ゴールなら終了
    if (ny == HEIGHT - 2 && nx == WIDTH - 2) {
        agent.y = 1;
        agent.x = 1;
    }

}

function draw_q_table() {
    q_table.innerHTML = "";

    for (var h = 1; h < HEIGHT - 1; ++h) {
        q_table.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        for (var w = 1; w < WIDTH - 1; ++w) {
            if (field[h][w] == WALL) {
                q_table.innerHTML += "O";
            }
            else if (h == HEIGHT - 2 && w == WIDTH - 2) {
                q_table.innerHTML += "G";
            }
            else {
                var max_q = -1e9;
                var action = 0;

                for (var a = 0; a < ACTION; ++a) {
                    if (max_q < Q[h][w][a]) {
                        max_q = Q[h][w][a];
                        action = a;
                    }
                }

                if (action == 0) {
                    q_table.innerHTML += "&gt;";
                }
                else if (action == 1) {
                    q_table.innerHTML += "&and;";
                }
                else if (action == 2) {
                    q_table.innerHTML += "&lt;";
                }
                else if (action == 3) {
                    q_table.innerHTML += "&or;";
                }
                else {
                    q_table.innerHTML += "O";
                }
            }
        }
        q_table.innerHTML += "<br>";
    }
}

function run_bfs() {
    que = new Queue();
    que.push(new Unit(1, 1));
    field[1][1] = USED;
    running_func = setInterval('bfs()', 50);
    is_running = true;
}

function run_dfs() {
    stack = new Stack();
    stack.push(new Unit(1, 1));
    field[1][1] = USED;
    running_func = setInterval('dfs()', 50);
    is_running = true;
}

function run_q_learning() {
    clear_canvas();

    ql_iter = 0;

    running_func = setInterval('q_learning()', 50);
    is_running = true;
}

function stop() {
    if (is_running) {
        clearInterval(running_func);
        is_running = false;
    }
}

function clear_canvas() {
    if (is_running) {
        clearInterval(running_func);
        is_running = false;
    }

    ctx.beginPath();
    ctx.lineWidth = 1;

    for (var h = 0; h < HEIGHT; ++h) {
        for (var w = 0; w < WIDTH; ++w) {
            if (field[h][w] == USED) {
                field[h][w] = NONE;
            }
        }
    }

    agent.y = 1;
    agent.x = 1;

    draw();
}

function all_clear_canvas() {
    ctx.clearRect(0, 0, 500, 500);
}

function change_size() {
    HEIGHT = document.maze.maze_h.value;
    WIDTH = document.maze.maze_w.value;
    EDGE = Math.min(Math.floor(500 / Math.max(HEIGHT, WIDTH)), 100);
    all_clear_canvas();
    init();
    setTimeout('draw()', 200);
}