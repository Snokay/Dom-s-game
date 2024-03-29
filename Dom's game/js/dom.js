        //This is the variable of the game.
        let nb = 1
        let lvl = 1
        let boxnum = 5
        let name = ""

        //Function storScore is the local score storage for saving the best player score
        function storScore(){
            if (typeof(Storage) !== "undefined") {
                //This part is for check if save is already created or not
                if (localStorage.getItem("BestPlayer") === null) {
                    localStorage.setItem("BestPlayer", JSON.stringify({ nom: "", distance: 0 }));
                }

                //This part is for check if the player have do better if the score is better, save the new score with the new player name
                function updateBestPlayer(newName, newDistance) {
                    var BestPlayer = JSON.parse(localStorage.getItem("BestPlayer"));
                    if (newDistance > BestPlayer.distance) {
                        BestPlayer.nom = newName;
                        BestPlayer.distance = newDistance;
                        localStorage.setItem("BestPlayer", JSON.stringify(BestPlayer));
                    }
                }

                var nomPersonne = name;
                var distanceParcourue = lvl;
                updateBestPlayer(nomPersonne, distanceParcourue);

                //This part is for tell in log the best player and for set the best player in the screen text
                var BestPlayer = JSON.parse(localStorage.getItem("BestPlayer"));
                console.log("La personne qui est allée le plus loin est " + BestPlayer.nom + " est allée jusqu'au level: " + BestPlayer.distance);
                document.getElementById("bestScore").innerHTML = "The best score is " + BestPlayer.nom + " Its max level is: " + BestPlayer.distance;
            } else {
                //This part is for say in the console your browser is not compatible with local storage system
                console.log("Désolé, votre navigateur ne prend pas en charge le stockage local.");
            }
        }

        //Function startGame is called for start the game
        function startGame(){
            //This part is for create button start and box name for launch the game, and get the player name
            var bouton = document.createElement("button");

            bouton.innerHTML = "Start";
            bouton.id = "restartBtn";

            var textName = document.createElement("input");

            textName.innerHTML = "Name";
            textName.name = "nom"
            textName.type = "Name"
            textName.id = "playerName";

            document.getElementById("boutonContainer").appendChild(bouton);
            document.getElementById("boutonContainer").appendChild(textName);

            //This is for launch the game when you have set a name, and press the button
            bouton.addEventListener("click", function() {
                name = document.querySelector('input[name="nom"]').value;
                if(name != ""){
                    createBox()
                    shuffleChildren()
                    storScore()
                    resetTimer()
                    bouton.remove()
                    textName.remove()
                }
            });
        }

        //Function showReaction is for make box have some color when you win, loose, or when you interact with one already check
        function showReaction(type, clickedbox){
            clickedbox.classList.add(type)

            if(type !== "success"){
                setTimeout(function(){
                    clickedbox.classList.remove(type)
                }, 800)
            }
        }

        //Function loose is called when time's up for make GameOver screen
        function loose(board){
            board.innerHTML = ""

            //This is for add a restart button when you have loose
            var bouton = document.createElement("button");
            bouton.innerHTML = "Restart";
            bouton.id = "restartBtn";

            //This is for refresh the window when you press restart button
            bouton.addEventListener("click", function() {
                window.location.reload();
            });

            document.getElementById("boutonContainer").appendChild(bouton);
            storScore()
        }

        //This is some variable for the timer "Date().getTime() + (1 * 60 * 1000);" is for get 1 minute
        let interval;
        let targetTime = new Date().getTime() + (1 * 60 * 1000);

        //Function updateTimer start the timer and update the timer every second
        function updateTimer() {
            const currentTime = new Date().getTime();
            const remainingTime = targetTime - currentTime;
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            //This is for make the timer text in the screen
            document.getElementById("timer").innerHTML = "Time Remaining: " + minutes + "m " + seconds + "s";

            //This is for check if time's up script call loose
            if (remainingTime <= 0) {
                clearInterval(interval);
                document.getElementById("timer").innerHTML = "Time's up!";
                document.getElementById("game").innerHTML = "Game Over!";
                loose(board)
            }
        }

        //Function resetTimer is called for reset the timer when you win the level.
        function resetTimer() {
            clearInterval(interval);
            targetTime = new Date().getTime() + (1 * 60 * 1000);
            interval = setInterval(updateTimer, 1000);
            updateTimer();
        }

        //Function clearBoard is for clear the board when you have finish the current level, and start another level.
        function clearBoard(board, lvl, boxnum){
            board.innerHTML = ""

            document.getElementById("level").innerHTML = "Level: " + lvl;

            createBox()
            shuffleChildren()
            resetTimer()
        }

        const box = document.createElement("div")
        box.classList.add("box")

        const board = document.querySelector("#board")

        //Function createBox is for create the box in the screnn, it creates the boxes following the number put in the boxnum variable.
        function createBox(){
            for(let i = 1; i <= boxnum; i++){
                const newBox = box.cloneNode()

                newBox.innerText = i
                board.appendChild(newBox)

                newBox.addEventListener("click", function(){
                    //This is to check if we click on the right box if yes then we put an animation to the box.
                    if(i == nb){
                        newBox.classList.add("box-valid")

                        //This is for check if all the box hav been pressed and if the level is finish.
                        if(nb == board.children.length){
                            board.querySelectorAll(".box").forEach(function(box){
                                showReaction("success", box)
                            })

                            nb = 1
                            lvl++
                            
                            //This is for stop add box when the number of box is superior or equal to 50.
                            if(boxnum <= 50){
                                boxnum = boxnum + 2
                            }

                            clearBoard(board, lvl, boxnum)
                            return
                        }
                        shuffleChildren()
                        nb++
                    }

                    //This is for check if you press the wrong number, and if its wrong reset the random of all the box, and reset the box you have already press.
                    else if(i > nb){
                        showReaction("error", newBox)

                        nb = 1

                        board.querySelectorAll(".box-valid").forEach(function(validbox){
                            validbox.classList.remove("box-valid")
                            shuffleChildren()
                        })
                    }

                    //This is for check if you press number you already pressed.
                    else{
                        showReaction("notice", newBox)
                    }
                })
            }
        }

        //Function shuffleChildren it's to mix them randomly
        function  shuffleChildren(parent){
            let i = board.children.length, k, temp
            while(--i > 0){
                k = Math.floor(Math.random() * (i+1))

                temp = board.children[k]

                board.children[k] = board.children[i]

                board.appendChild(temp)
            }
        }

        document.getElementById("level").innerHTML = "Level: " + lvl;

        startGame()