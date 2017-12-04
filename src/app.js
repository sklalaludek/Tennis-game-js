(function main() {

    const canvas = document.getElementById('game');
    const c = canvas.getContext('2d');
    const paddleHeight = 100;
    const paddleWidth = 10;
    const max = 3;
    let ballX = 50,
        ballY = 50,
        ballSpeedX = 10,
        ballSpeedY = 4,
        paddle1Y = 250,
        paddle2Y = 250,
        player1Score = 0,
        player2Score = 0,
        winScreen = false;

    canvas.width = 800;
    canvas.height = 600;

    function calculateMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        let mouseX = e.clientX - rect.left - root.scrollLeft;
        let mouseY = e.clientY - rect.top - root.scrollTop;
        return {
            x: mouseX,
            y: mouseY
        }
    }

    function handleMouseClick(e) {
        if (winScreen) {
            player1Score = 0;
            player2Score = 0;
            winScreen = false;
        }
    }

    function ready() {
        /*set update frequency as frames per sec*/
        const framesPerSec = 30;
        setInterval(function myInterval() {
            draw();
            move();
        }, 1000 / framesPerSec);
        /*events*/
        canvas.addEventListener('mousemove', function(e) {
            let mousePos = calculateMousePos(e);
            paddle1Y = mousePos.y - (paddleHeight / 2);
        });
        canvas.addEventListener('mousedown', handleMouseClick);
    }
    /*reset the ball position and the score*/
    function ballReset() {
        if (player1Score >= max || player2Score >= max) {
            winScreen = true;
        }
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }
    /*right paddle movement
     **chasing the ball's vertical position
     */
    function ai() {
        let paddle2YCenter = paddle2Y + (paddleHeight / 2);
        /*above the ball*/
        if (paddle2YCenter < ballY - 35) {
            paddle2Y += 6;
            /*below the ball*/
        } else if (paddle2YCenter > ballY + 35) {
            paddle2Y -= 6;
        }
    }
    /*move all*/
    function move() {
        if (winScreen) {
            return;
        }
        /*move right paddle*/
        ai();
        /*move the ball*/
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        /*bounce the ball off the left side
         **below the bottom && above the top of the paddle
         */
        if (ballX < 0) {
            if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
                let deltaY = ballY - (paddle1Y + paddleHeight / 2);
                ballSpeedY = deltaY * 0.35;
            } else {
                /*the end*/
                player2Score++;
                ballReset();
            }
        }
        /*bounce the ball off the right side*/
        if (ballX > canvas.width) {
            if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
                let deltaY = ballY - (paddle2Y + paddleHeight / 2);
                ballSpeedY = deltaY * 0.35;
            } else {
                /*the end*/
                player1Score++;
                ballReset();
            }
        }
        /*move and bounce the ball vertically
         **bounce the ball off the top
         */
        if (ballY < 0) {
            ballSpeedY = -ballSpeedY;
        }
        /* and bounce the ball off the bottom*/
        if (ballY > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }
    }
    /*the net*/
    function drawNet() {
        for (let i = 0; i < canvas.height; i += 40) {
            c.fillRect(canvas.width / 2 - 1, i, 2, 20);
            c.fillStyle = 'white';
        }
    }
    /*draw*/
    function draw() {
        c.beginPath();
        /*background-color*/
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);
        /*winning screen*/
        if (winScreen) {
            c.fillStyle = 'white';
            if (player1Score >= max) {
                c.fillStyle = 'white';
                c.fillText('Left Player Won', 350, 200);
            } else if (player2Score >= max) {
                c.fillStyle = 'white';
                c.fillText('Right Player Won', 350, 200);
            }
            c.fillText('click to continue', 350, 500);
            return;
        }
        /*draw the net*/
        drawNet();
        /*draw left player paddle*/
        c.fillStyle = 'white';
        c.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
        /*draw right player paddle*/
        c.fillStyle = 'white';
        c.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
        /*ball
         **circle draw
         */
        c.fillStyle = 'white';
        c.beginPath();
        c.arc(ballX, ballY, 10, 0, Math.PI * 2, true);
        c.fill();
        /*draw the score*/
        c.fillText(player1Score, 100, 100);
        c.fillText(player2Score, canvas.width - 100, 100);
    }
    document.addEventListener('DOMContentLoaded', ready);
})();
