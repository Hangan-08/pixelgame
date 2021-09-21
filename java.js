document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector(".grid");
    const player = document.querySelector(".player");
    const instr = document.querySelector(".instr");
    const gameOver = document.querySelector(".gameOver");
    const menu = document.getElementById('menu');
    const body = document.querySelector('body');

    const background1 = document.querySelector(".background1");
    const background2 = document.querySelector(".background2");

    let backgroundMoveSpeed = 0.1;

////highscore
        const scoreHTML = document.getElementById('score');
        const highScoreHTML = document.getElementById('highScore');

//highscore var
    let highScore = localStorage.getItem('highScore');
    let score = 0;
    let scoreSpeed = 0.01; //score running

///player variables
        player.style.backgroundImage = "url(walk1.png)";
        let playerAnimationSpeed = 180;
        let playerPosition = 8;


////player running & jumping
let frame = 1;
let jumpHeight = playerPosition;
let jumpTimeInterval = 10;
let jumpSpeed = 2; 
let downSpeed = 0.1;
let gravity = 0.1; // how geometric the jumps of the player will be
jumpHeight += 35; // how high the player can jump --- percentage (%)
let ground = playerPosition;

/////obstacless
let obstacleSpeed = 2;


//game mechanics
let isMenu = true;
let isJumping = false;
let isGameOver = false;


// space press checking////

        document.addEventListener('keydown', (e)=>{
            if (!isGameOver && e.code === "Space")
                {  
                    // ... call input function
                    input();
                    console.log("space pressed");
                }
            // else is game is over AND space is pressed ...

            else if (isGameOver && e.code === "Space")
            {
                    location.reload();
            }


        })

// Listening for tap on screen
         document.addEventListener('touchstart', (e)=>{
        if(isGameOver) 
            {
                location.reload();
            }
            else {
                    console.log("Screen tapped"); 

                    input();
            }
})


// Menu Transitions//

        function menuTransitions(){

            console.log("Menu gone");

            // hide instructions
            instr.style.visibility = "hidden";

            
}

/////GAME MECHANICS/////
            function input(e) 
            {
                if(isMenu)
                    {
                        isMenu = false;
                        menuTransitions();
                        playerRun();
                        console.log("start");
                        manageObstacles();
                        scrollBackground();
                        addScore();

                        
                    }
                 
                if(!isMenu && !isJumping && !isGameOver)    
                    {
                        isJumping = true;
                        jump();

                        console.log("CAN JUMP");
                    }

            }


//player animation
        function playerRun()
            {
                setInterval(runningLoop, playerAnimationSpeed)

                function runningLoop()
                    {
                        console.log("RUNNING");
                        if (frame == 1 && !isGameOver && !isJumping)
                            {
                                player.style.backgroundImage = "url(walk1.png) ";
                                frame = 2
                            }
                    
                        else if (frame == 2 && !isGameOver && !isJumping)
                            {
                                player.style.backgroundImage = "url(walk2.png) ";
                                frame = 3
                            }
                        
                        else if (frame == 3 && !isGameOver && !isJumping)
                        {
                            player.style.backgroundImage = "url(walk3.png) ";
                            frame = 4
                        }
                        else if (frame == 4 && !isGameOver && !isJumping)
                        {
                            player.style.backgroundImage = "url(walk4.png) ";
                            frame = 1
                        }


                ////if dead game over
                        else if (isGameOver)
                        {
                            player.style.backgroundImage = "url(walk2.png)";
                        }
                

                }

}

///Jumping animation
            function jump()
            {
                    let upTimer = setInterval(function()
                    {
                            if (isGameOver)
                            {
                                clearInterval(upTimer);
                            }

                            console.log("JUMPING UP");
                                 //up and up

                                        //1. change player image
                                        player.style.backgroundImage = "url(jump.png)";

                                        //2. calculate jumping up
                                        jumpSpeed = 1
                                        playerPosition += jumpSpeed;
                                        jumpSpeed = jumpSpeed * gravity;
                                        if (jumpSpeed <= 0.17 ) { jumpSpeed = 0.2;}

                                        //3.feeding new position to css
                                        player.style.bottom = playerPosition + '%';


                                 //reaching jump height
                            if(playerPosition >= jumpHeight)
                                {
                                    console.log("FALLING DOWN");
                                    clearInterval(upTimer); //stop going up

                                    let downTimer = setInterval ( function() { // start falling down interval
                    
                                        // calculating falling motion
                                        playerPosition -= downSpeed;
                                        downSpeed = downSpeed + (downSpeed*0.05);
                    
                                        // feeding calculated result to CSS
                                            player.style.bottom = playerPosition  + '%';
                    
                                        // changing background image
                                            player.style.backgroundImage = "url(crouch.png)" // Replace the player going up sprite with player landing sprite
                    
                                        // if player reaches ground variable ...
                                        if (playerPosition <= ground) 
                                        {     
                                            console.log("Ground");
                    
                                            clearInterval(downTimer); //stop falling down interval
                    
                                            // reset variables
                                                jumpSpeed = 1;
                                                downSpeed = 0.3;
                                                isJumping = false;
                                                playerPosition = ground;
                                                player.style.bottom = playerPosition  + '%';
                                        }
                                    }, jumpTimeInterval)
                                }   
                        }, jumpTimeInterval)
                    }



//////////////////////////////////////OBSTACLE///////////////////////////////



       /////manage 0bstacles//////
                function manageObstacles()
                    {
                            randomCall();
                            
                    }
        /////////random calll

        ///var 4 random time
                    var randomTime;

        ///function for generating random time
                function changeTime()
                    {
                        ////generate random integer between 1 & 5 sec
                            randomTime = Math.floor(Math.random()  * (5000 - 1000) + 1000);
                    }
                    

                function randomCall()
                    {
                            changeTime();
                            setTimeout(randomCall, randomTime);
                            generateObstacle();
                    }
                    
 
                    

                ////obs
                function generateObstacle()
                    {
                        let obstaclePosition = 1300;

                                const obstacle = document.createElement('div');
                            obstacle.classList.add('obstacle');
                            
                            ////add obs to grid
                                grid.appendChild(obstacle);

                            obstacle.style.left = obstaclePosition + "px";

                            console.log("Obstacle appear")

 
                        let moveObstacle = setInterval(() =>
                            {

                                if (!isGameOver)
                                    {
                                        ///move obs
                                        obstaclePosition -=  obstacleSpeed;

                                        ////feed new position to CSS
                                        obstacle.style.left = obstaclePosition + "px";

                                        ///console.log("obstacle");
                                    }


                        /////obs disappear going past player
                            if(obstaclePosition <= -500)
                                    {
                                        console.log("DELETE OBSTACLE")

                                        obstacle.classList.remove('obstacle');

                                        try{grid.removeChild(obstacle)}
                                        catch(error){};

                                    }

                        /////OBS touch player, game over
                            if(obstaclePosition > 10 && obstaclePosition < 25 && playerPosition < 20)
                                    {
                                        console.log("Game Over");
                                        clearInterval(moveObstacle);

                                        GameOver()
                                        

                                    }
                            }, 1);

                    }


/////////////////////////////////////GameOver////////////////////
                function GameOver()
                    {
                        gameOver.style.visibility = "visible";
                        isGameOver = true;
                    }





/////////////////////////////////////////BACKGROUND////////////////////////

////take 2 imgs move to left in loop
                function scrollBackground()
                    {
                        let background1Pos = 0;
                        let background2Pos = 100;

                        setInterval (()=> 
                            {
                                /////game not over
                                    if (!isGameOver)
                                       {
                                        ////move bg
                                           background1Pos = background1Pos - backgroundMoveSpeed;
                                           background2Pos = background2Pos - backgroundMoveSpeed;

                                        ////feed result to css
                                            background1.style.left = background1Pos + '%';
                                            background2.style.left = background2Pos + '%';
                                       
                                        }

                                       ////reset if bg move offscreen

                                       ///if bg moves beyone value
                                       if (background1Pos <= -99) 
                                       {   // ... then reset it
                                           background1Pos = 100; 
                                       }

                                    if (background2Pos <= -99 )    
                                    {   // ... then reset it
                                        background2Pos = 100; 
                                    }
                            }, 1);
                    }


/////////////////////////////HIGH SCORE
                 function addScore()
                    {
                        setInterval(()=>
                            {
                                ///not game over
                                    if (!isGameOver)
                                        {
                                            ////add value to score
                                                score ++;
                                            ///score > hiscore
                                                if (score > highScore)
                                                {
                                                    ////update hiscore
                                                    highScore = score;
                                                }  
                                                
                                                            scoreHTML.innerHTML = score;
                                                      
                                                        /////hiscore with value  
                                                            highScoreHTML.innerHTML = "High Score:  " + highScore;

                                        }

                                        /////every 1000 pts difficulty up
                                        if (score%1000 == 0)
                                        {
                                            obstacleSpeed += 0.3;
                                            backgroundMoveSpeed += 0.035;
                                        }

                                    if (isGameOver) 
                                        {
                                            ///if game over, store score
                                            localStorage.setItem("highScore", highScore);
                                        }

                            },scoreSpeed)   
                    }



        })

