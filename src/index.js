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