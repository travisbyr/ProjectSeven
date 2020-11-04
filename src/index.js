// NOTE
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 */
// ANCHOR Show/Close DOM selectors
const rulesBtn = document.getElementById('rules-btn')
const closeBtn = document.getElementById('close-btn')
const    rules = document.getElementById('rules')

// ANCHOR Canvas DOM selectors
const canvas = document.getElementById('canvas')
const    ctx = document.getElementById('2d')

// TODO
/**
 * 1. Create canvas context
 * 2. Create and draw ball
 * 3. Create and draw paddle
 * 4. Create bricks
 * 5. Draw score
 * 6. Add update function to animate
 * 7. Function for animation frame
 * 8. Move paddle
 * 9. Keyboard event handles to move paddle
 * 10. Move ball
 * 11. Add wall boundaries
 * 12. Increase score when bricks break
 * 13. Lost - redraw bricks, reset score
 */

let score = 0 // Setting our score board to zero

const brickRowCount = 9; // Setting 9 bricks on a row
const brickColumnCount = 5; // Setting 5 bricks on column

// Create ball props
const ball = {
    x: canvas.width / 2,  // Start in the middle
    y: canvas.height / 2, // Start in the middle
    size: 10,             // Ball
    speed: 4,             // Animation speed prop
    dx: 4,                // Animation direction
    dy: -4                // Animation direction with - so it does not move down
}

// Create paddle props
const paddle = {
    x: canvas.width / 2 - 40, // We are taking half width of the paddle
    y: canvas.height - 20, // Center the middle
    w: 80,
    h: 10,
    speed: 8,
    dx: 0 // Only moving on the x-axes
};

// Create brick props
const brickInfo = {
    w: 70,        // Brick sharing same props
    h: 20,
    padding: 10,
    offsetX: 45,  // Position on the x-axes
    offsetY: 60,  // Position on the y-axes
    visible: true // When hit the brick it will be removed
};

// Create bricks
const bricks = []; // Initialise bricks array

for(let i = 0; i < brickRowCount; i++) { // Loop through array row
    bricks[i] = []; // Set the row bricks array iteration to an empty array
    for(let j = 0; j < brickColumnCount; j++) { // Loop through array column
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX; // i is the row iteration for each brick
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY; // We are looping and getting position
        bricks[i][j] = {x, y, ...brickInfo}; // Copy and take the array 2D and give it the values of x,y with the object values
    }
}

console.log(bricks)

// Draw ball on canvas - check MDN canvas drawing paths
function drawBall() {
    ctx.beginPath(); // Create a path
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); // Draw an arc to build a circle
    ctx.fillStyle = '#0095dd'; // Style the property
    ctx.fill();
    ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#0095dd'
    ctx.fill();
    ctx.closePath();
}

// Draw the score board
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30)
}

// Draw bricks on canvas
function drawBricks() {
    bricks.forEach(column => { // For columns
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent'; // This will be conditional
            ctx.fill();
            ctx.closePath();
        });
    });
}

// REVIEW Move paddle on canvas
function movePaddle() { //Every time draw on the canvas with can re-draw with certain element
    paddle.x += paddle.dx; // Paddle will not move until we use the keyboards events

    // Wall detection
    if (paddle.x + paddle.w > canvas.width) { // Entire width of the canvas
        paddle.x = canvas.width - paddle.w; // Minus the paddle width
    }

    if (paddle.x < 0) { // 0 from the x-axes and this is for the borders detection
        paddle.x = 0;
    }
}

// Move ball on canvas
function moveBall() {
    ball.x += ball.dx; // Append the ball on the x-axes
    ball.y += ball.dy; // Append the ball on the y-axes

    // Wall collision (right/left)
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0) { // Right and left walls
        ball.dx *= -1; // ball.dx = ball.dx * -1 the reason we are doing this is to reverse the ball to go the other way and bounce back
    }

    // Wall collision (top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) { // Top and bottom walls
        ball.dy *= -1; // The reason we are doing this is to reverse the ball to go to the other wall and bounce back
    }

    // console.log(ball.x, ball.y);

    // Paddle collision
    if (
        ball.x - ball.size > paddle.x && // Always to in consideration the object size of ball and this check
        ball.x + ball.size < paddle.x + paddle.w && // Checking the right side
        ball.y + ball.size > paddle.y 
    ) {
        ball.dy = -ball.speed; // Reverse the ball object and bounce off
    }

    // Brick collision
    bricks.forEach(column => { // Loop through bricks array
        column.forEach(brick = > {
            if (brick.visible) { // Make sure the bricks are visible
                if (
                    ball.x - ball.size > brick.x && // Left brick side check
                    ball.x + ball.size < brick.x + brick.w && // Right brick side check
                    ball.y + ball.size > brick.y && // Top brick side check
                    ball.y - ball.size < brick.y + brick.h // Bottom brick side check
                ) {
                    ball.dy *= -1; // Bounce off the brick
                    brick.visible = false; // Once bounce off the brick make it visible false
                    increaseScore(); // Increase score
                }
            }
        });
    });

    // Hit bottom wall - lose
    if (ball.y + ball.size > canvas.height) { // If hit bottom wall then lose
        showAllBricks(); // Redraw bricks
        score = 0; // Reset score
    }
}

// Increase Score
function increaseScore() {
    score++; // Increment by one

    if (score % (brickRowCount * brickRowCount) === 0) { // Check the if there are no bricks if true redraw
        showAllBricks(); // Create brick wall
    }
}

// Make all bricks appear
function showAllBricks() { // Loop through the array of bricks
    bricks.forEach(column => { // For column set visible to true
        column.forEach(brick => (brick.visible = true));
    });
}

// REVIEW Setup all the drawing
function draw() {
    // Clear the canvas to make sure ends the event once stop using the keys
    ctx.clearRect(0,0, canvas.width, canvas.height)
    drawBall()
    drawPaddle()
    drawScore()
    drawBricks()
}

// Updat ecanvas drawing and animation
function updates() {
    movePaddle();
    moveBall();
}

