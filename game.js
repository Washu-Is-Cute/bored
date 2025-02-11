<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cube Shooter Game</title>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; }
        canvas { display: block; background-color: #f0f0f0; }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script>
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let gameState = 'start'; // 'start', 'difficulty', 'mode', 'playing', 'gameover'
        let currentDifficulty = 'easy';
        let currentMode = 'tap'; // 'tap' or 'spear'
        let enemies = [];
        let player = { x: canvas.width / 2, y: canvas.height - 50, size: 30, speed: 5 };
        let combo = 0;
        let gameOver = false;
        let paused = false;

        const difficultySettings = {
            easy: { enemyHealth: 1, spawnInterval: 1500, enemySpeed: 1.5 },
            hard: { enemyHealth: 3, spawnInterval: 1200, enemySpeed: 2 },
            insane: { enemyHealth: 5, spawnInterval: 800, enemySpeed: 2.5 },
        };

        // Start screen rendering
        function drawStartScreen() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.font = "40px Arial";
            ctx.fillText("Press Enter to Start", canvas.width / 2 - 120, canvas.height / 2 - 40);
        }

        // Difficulty selection screen rendering
        function drawDifficultyScreen() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText("Select Difficulty", canvas.width / 2 - 100, canvas.height / 2 - 60);
            ctx.fillText("Easy (1)", canvas.width / 2 - 50, canvas.height / 2);
            ctx.fillText("Hard (2)", canvas.width / 2 - 50, canvas.height / 2 + 50);
            ctx.fillText("Insane (3)", canvas.width / 2 - 50, canvas.height / 2 + 100);
        }

        // Mode selection screen rendering
        function drawModeScreen() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText("Select Mode", canvas.width / 2 - 80, canvas.height / 2 - 60);
            ctx.fillText("Tap (1)", canvas.width / 2 - 50, canvas.height / 2);
            ctx.fillText("Spear (2)", canvas.width / 2 - 50, canvas.height / 2 + 50);
        }

        // Start the game
        function startGame() {
            gameState = 'playing';
            combo = 0;
            gameOver = false;
            enemies = [];
            player = { x: canvas.width / 2, y: canvas.height - 50, size: 30, speed: 5 };
            setInterval(spawnEnemy, difficultySettings[currentDifficulty].spawnInterval);
            gameLoop();
        }

        // Spawn enemies
        function spawnEnemy() {
            if (gameOver || paused) return;
            let x = Math.random() < 0.5 ? 0 : canvas.width;
            let speed = x === 0 ? difficultySettings[currentDifficulty].enemySpeed : -difficultySettings[currentDifficulty].enemySpeed;
            enemies.push({ x, y: Math.random() * canvas.height, speed, health: difficultySettings[currentDifficulty].enemyHealth, size: 50 });
        }

        // Game loop function
        function gameLoop() {
            if (gameOver || paused) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPlayer();
            moveEnemies();
            drawEnemies();
            handleCollisions();

            requestAnimationFrame(gameLoop);
        }

        // Draw player
        function drawPlayer() {
            ctx.fillStyle = "blue";
            ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
        }

        // Move enemies
        function moveEnemies() {
            enemies.forEach((enemy, index) => {
                enemy.x += enemy.speed;
                if (enemy.x < 0 || enemy.x > canvas.width) {
                    gameOver = true;
                }
            });
        }

        // Draw enemies
        function drawEnemies() {
            enemies.forEach(enemy => {
                ctx.fillStyle = "red";
                ctx.fillRect(enemy.x - enemy.size / 2, enemy.y - enemy.size / 2, enemy.size, enemy.size);
            });
        }

        // Handle collisions
        function handleCollisions() {
            enemies.forEach((enemy, index) => {
                if (enemy.x < player.x + player.size / 2 && enemy.x + enemy.size / 2 > player.x - player.size / 2 &&
                    enemy.y < player.y + player.size / 2 && enemy.y + enemy.size / 2 > player.y - player.size / 2) {
                    gameOver = true;
                }
            });
        }

        // Event listener for keypresses and mobile taps
        document.addEventListener("keydown", (event) => {
            if (gameState === 'start' && event.key === "Enter") {
                gameState = 'difficulty';
                drawDifficultyScreen();
            } else if (gameState === 'difficulty') {
                if (event.key === "1") {
                    currentDifficulty = "easy";
                    gameState = 'mode';
                    drawModeScreen();
                } else if (event.key === "2") {
                    currentDifficulty = "hard";
                    gameState = 'mode';
                    drawModeScreen();
                } else if (event.key === "3") {
                    currentDifficulty = "insane";
                    gameState = 'mode';
                    drawModeScreen();
                }
            } else if (gameState === 'mode') {
                if (event.key === "1") {
                    currentMode = "tap";
                    startGame();
                } else if (event.key === "2") {
                    currentMode = "spear";
                    startGame();
                }
            }

            // Pause the game
            if (event.key === "p" || event.key === "P") {
                paused = !paused;
            }

            // Reset game with 'R'
            if (event.key === "r" || event.key === "R") {
                gameState = 'start';
                drawStartScreen();
            }
        });

        // Event listener for mobile tap
        canvas.addEventListener("touchstart", (event) => {
            const touch = event.touches[0];
            const x = touch.clientX;
            const y = touch.clientY;

            if (gameState === 'start') {
                gameState = 'difficulty';
                drawDifficultyScreen();
            } else if (gameState === 'difficulty') {
                if (y > canvas.height / 2 && y < canvas.height / 2 + 50) {
                    currentDifficulty = "easy";
                    gameState = 'mode';
                    drawModeScreen();
                } else if (y > canvas.height / 2 + 50 && y < canvas.height / 2 + 100) {
                    currentDifficulty = "hard";
                    gameState = 'mode';
                    drawModeScreen();
                } else if (y > canvas.height / 2 + 100 && y < canvas.height / 2 + 150) {
                    currentDifficulty = "insane";
                    gameState = 'mode';
                    drawModeScreen();
                }
            } else if (gameState === 'mode') {
                if (y > canvas.height / 2 && y < canvas.height / 2 + 50) {
                    currentMode = "tap";
                    startGame();
                } else if (y > canvas.height / 2 + 50 && y < canvas.height / 2 + 100) {
                    currentMode = "spear";
                    startGame();
                }
            }
        });

        // Start the game with the initial screen
        drawStartScreen();
    </script>
</body>
</html>
