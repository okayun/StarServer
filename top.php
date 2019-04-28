
    <h1> おかゆのホームページ(開発中) </h1>
    ここでは適当に何かを作ったり実験したりしています. 過度な期待はご遠慮ください.
    <!--
    <h2> 画像 </h2>
    <div class="slideshow">
        <div class="slideshow-wrapper">
            <div class="slideshow-element"><img src="img/muteki.jpg" alt="muteki"></div>
            <div class="slideshow-element"><img src="img/yoshi.png" alt="yoshi"></div>
            <div class="slideshow-element"><img src="img/hinnyu.jpg" alt="hinnyu"></div>
        </div>
    </div>
    -->

    <div id="menu1" class="section">
        <h1>canvas のテスト</h1>
        <p>
            迷路を 棒倒し法 または 壁伸ばし法(嘘) で生成できます.<br>
            bfs, dfs をクリックすると, それぞれの手法で迷路を探索します.<br>
            Q-Learning をクリックすると, 現場ネコがゴールまでの最短経路を頑張って学習します.<br>
            Q-Learning はサイズの小さい迷路でやるとすぐ終わるのでおすすめです.
        </p>

        <canvas id="canvas_test" width="500" height="500">代替テキストです</canvas>
        <br>
        <p>水色のマスがゴールです.<p>
        <br>

        <form action="/script/maze.js" name="maze">
            迷路サイズ<br>
            [高さ] : 
            <select name="maze_h">
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="7" selected>7</option>
                <option value="9">9</option>
                <option value="11">11</option>
                <option value="13">13</option>
                <option value="15">15</option>
                <option value="17">17</option>
                <option value="19">19</option>
                <option value="21">21</option>
                <option value="23">23</option>
                <option value="25">25</option>
                <option value="27">27</option>
                <option value="29">29</option>
            </select>

            <br>

            [幅] :
            <select name="maze_w">
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="7" selected>7</option>
                <option value="9">9</option>
                <option value="11">11</option>
                <option value="13">13</option>
                <option value="15">15</option>
                <option value="17">17</option>
                <option value="19">19</option>
                <option value="21">21</option>
                <option value="23">23</option>
                <option value="25">25</option>
                <option value="27">27</option>
                <option value="29">29</option>
            </select>

            <br>

            <input type="button" value="変更" onclick="Maze.changeSize();">
        </form>

        <br>

        <input type="button" value="迷路の初期化" onclick="Maze.prepareWall();">
        <input type="button" value="棒倒し法" onclick="Maze.stickDown();">
        <input type="button" value="壁伸ばし法(嘘)" onclick="Maze.wallExtend();">
        <input type="button" value="???" onclick="Maze.changeCharacter();">
        <br>

        <input type="button" value="bfs" onclick="Maze.runBfs();">
        <input type="button" value="dfs" onclick="Maze.runDfs();">
        <input type="button" value="Q-Learning" onclick="Maze.runQLearning();">
        <input type="button" value="stop" onclick="Maze.stop();">
        <input type="button" value="clear" onclick="Maze.clearCanvas();">
        <br>

        <p>各状態での一番良い行動</p>
        <div id="q_table"></div>
        <br>
        [<strong>O</strong>] : 壁, [<strong>&and;</strong>] : 上, [<strong>&or;</strong>] : 下, [<strong>&lt;</strong>] : 左, [<strong>&gt;</strong>] : 右
    </div>

    <div id="menu2" class="section">
        <h1>ソートアルゴリズムのデモ</h1>
            <p>ここでは, ソートアルゴリズムのデモを行います. 好きなソートを選んで実行してみてください.</p>
            <div id="demo_message"></div>

            <canvas id="demo" width="900" height="200">代替テキストです</canvas>
            <br>
            <input type="button" value="シャッフル" onclick="Demo.shuffle();">
            <br>
            <form action="./script/demo.js" name="demo">
                [ソートの種類] :
                <select name="kind">
                    <option value="1" selected>挿入ソート</option>
                    <option value="2">バブルソート</option>
                    <option value="3">マージソート</option>
                    <option value="4">バケットソート</option>
                    <option value="5">ボゴソート</option>
                </select>
                <input type="button" value="変更" onclick="Demo.changeKindOfSort(); Demo.sendMessage();">
            </form>
            <input type="button" value="Start!" onclick="Demo.runSort();">
            <br>
    </div>

    <div id="menu3" class="section">
        <h1>工事中</h1>
        <p>実装内容は未定です</p>
    </div>
