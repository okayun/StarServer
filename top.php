
    <h1> おかゆのホームページ(開発中) </h1>

    <h2> 画像 </h2>
    <div class="slideshow">
        <div class="slideshow-wrapper">
            <div class="slideshow-element"><img src=<?php echo ROOT . "img/muteki.jpg";?> alt="muteki"></div>
            <div class="slideshow-element"><img src=<?php echo ROOT . "img/yoshi.png";?> alt="yoshi"></div>
            <div class="slideshow-element"><img src=<?php echo ROOT . "img/hinnyu.jpg";?> alt="hinnyu"></div>
        </div>
    </div>

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

    <form action="/script/test.js" name="maze">
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

        <input type="button" value="変更" onclick="change_size();">
    </form>

    <br>

    <input type="button" value="迷路の初期化" onclick="prepare_wall();">
    <input type="button" value="棒倒し法" onclick="stick_down();">
    <input type="button" value="壁伸ばし法(嘘)" onclick="wall_extend();">
    <input type="button" value="???" onclick="change_character();">
    <br>

    <input type="button" value="bfs" onclick="run_bfs();">
    <input type="button" value="dfs" onclick="run_dfs();">
    <input type="button" value="Q-Learning" onclick="run_q_learning();">
    <input type="button" value="stop" onclick="stop();">
    <input type="button" value="clear" onclick="clear_canvas();">
    <br>

    <p>各状態での一番良い行動</p>
    <div id="q_table"></div>
    <ul style="list-style: none; float: left;">
        <li><strong>O</strong> : 壁</li>
        <li><strong>&and;</strong> : 上</li>
        <li><strong>&or;</strong> : 下</li>
        <li><strong>&lt;</strong> : 左</li>
        <li><strong>&gt;</strong> : 右</li>
    </ul>
