var canvas;
canvas = document.createElement("canvas");

var formatPaysage = window.innerWidth > window.innerHeight;
var blockSize = 0;
if (formatPaysage)
    blockSize = (window.innerHeight * 0.7) / 11;
else
    blockSize = (window.innerWidth * 0.9) / 11;
canvas.width = blockSize * 11;
canvas.height = blockSize * 11;
document.getElementById("canvas").appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.style.display = "block";
canvas.style.margin = "auto";
var imagePlateau = new Image();
imagePlateau.src = "img/plateau.png";
var canvasPosition = canvas.getBoundingClientRect();
var imageTrouOuBille = [new Image(), new Image(), new Image()];
imageTrouOuBille[0].src = "img/trou.png";
imageTrouOuBille[1].src = "img/billeSolitaire.png";
imageTrouOuBille[2].src = "img/billeSolitaire2.png";
var listeBille = [[-1, -1, 1, 1, 1, -1, -1], [-1, -1, 1, 1, 1, -1, -1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [-1, -1, 1, 1, 1, -1, -1], [-1, -1, 1, 1, 1, -1, -1]];
var billeSelect = false;
var posBilleSelect = [0, 0];
var directionDeplacement = "";
var nbBilles = 32;
var btnReset = document.getElementById("btnReset");
btnReset.style.display = "none";
refresh();

function refresh() {
    if (formatPaysage)
    blockSize = (window.innerHeight * 0.7) / 11;
else
    blockSize = (window.innerWidth * 0.9) / 11;
canvas.width = blockSize * 11;
canvas.height = blockSize * 11;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imagePlateau, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgb(255,255,255)";

    for (var i = 2; i < 9; i++) {
        for (var j = 2; j < 9; j++) {
          
            if (listeBille[i - 2][j - 2] != -1)
                ctx.drawImage(imageTrouOuBille[listeBille[i - 2][j - 2]], j * blockSize, i * blockSize, blockSize, blockSize);


        }
    }
    setTimeout(refresh, 100);

}

canvas.addEventListener("click", function (e) {
   
    canvasPosition = canvas.getBoundingClientRect();
    var posXClick = parseInt((e.clientX - canvasPosition.left) / blockSize);
    var posYClick = parseInt((e.clientY - canvasPosition.top) / blockSize);
    for (var i = 2; i < 9; i++) {
        for (var j = 2; j < 9; j++) {
            if (posYClick == i && posXClick == j) {

                if (listeBille[i - 2][j - 2] == 1 && !billeSelect) {
                    directionDeplacement = "";



                    if (listeBille[i - 2][j - 1] == 1 && listeBille[i - 2][j] == 0) {
                        directionDeplacement = "droite";

                    }



                    if (listeBille[i - 2][j - 3] == 1 && listeBille[i - 2][j - 4] == 0) {
                        directionDeplacement = "gauche";

                    }
                    if (i > 4) {
                        if (listeBille[i - 3][j - 2] == 1 && listeBille[i - 4][j - 2] == 0) {
                            directionDeplacement = "haut";

                        }
                    }

                    if (i < 7) {
                        if (listeBille[i - 1][j - 2] == 1 && listeBille[i][j - 2] == 0) {
                            directionDeplacement = "bas";
                        }
                    }

                    if (directionDeplacement != "") {
                        listeBille[i - 2][j - 2] = 2;
                        billeSelect = true;
                        posBilleSelect = [i - 2, j - 2];
                    }


                }
                else if (billeSelect) {
                    if (listeBille[i - 2][j - 2] == 2)
                        listeBille[i - 2][j - 2] = 1;
                    if (listeBille[i - 2][j - 2] == 0) {
                        listeBille[i - 2][j - 2] = 1;
                        listeBille[posBilleSelect[0]][posBilleSelect[1]] = 0;
                        switch (directionDeplacement) {
                            case "droite":
                                try {
                                    listeBille[i - 2][j - 3] = 0;
                                } catch {
                                    console.log("erreur");
                                }
                                break;
                            case "gauche":
                                try {
                                    listeBille[i - 2][j - 1] = 0;
                                } catch {
                                    console.log("erreur");
                                }
                                break;
                            case "haut":
                                try {
                                    listeBille[i - 1][j - 2] = 0;
                                } catch {
                                    console.log("erreur");
                                }

                                break;
                            case "bas":
                                try {
                                    listeBille[i - 3][j - 2] = 0;
                                } catch {
                                    console.log("erreur");
                                }

                                break;
                        }
                    }
                    billeSelect = false;
                    if (checkGameOver()) {
                        $('#exampleModalCenter').modal('toggle');
                        $('#score').text("partie terminée, il vous reste " + nbBilles + " billes");
                        $('#btnClose').click(function (event) {
                            $('#exampleModalCenter').modal('toggle');
                            btnReset.style.display = "block";
                        });
                    }
                }

            }
        }
    }
});
btnReset.addEventListener("click", function (e) {
    btnReset.style.display = "none";
    listeBille = [[-1, -1, 1, 1, 1, -1, -1], [-1, -1, 1, 1, 1, -1, -1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [-1, -1, 1, 1, 1, -1, -1], [-1, -1, 1, 1, 1, -1, -1]];
    billeSelect = false;
    posBilleSelect = [0, 0];
    directionDeplacement = "";
    nbBilles = 32;

});
function checkGameOver() {
    var isGameOver = false;
    nbBilles = 0;
    for (var i = 2; i < 9; i++) {
        for (var j = 2; j < 9; j++) {
            if (listeBille[i - 2][j - 2] == 1) {
                nbBilles++;
            }
        }
    }
    for (var i = 2; i < 9; i++) {
        for (var j = 2; j < 9; j++) {
            if (listeBille[i - 2][j - 2] == 1 && !billeSelect) {




                if (listeBille[i - 2][j - 1] == 1 && listeBille[i - 2][j] == 0) {
                    return isGameOver;

                }



                if (listeBille[i - 2][j - 3] == 1 && listeBille[i - 2][j - 4] == 0) {
                    return isGameOver;

                }
                if (i > 4) {
                    if (listeBille[i - 3][j - 2] == 1 && listeBille[i - 4][j - 2] == 0) {
                        return isGameOver;

                    }
                }

                if (i < 7) {
                    if (listeBille[i - 1][j - 2] == 1 && listeBille[i][j - 2] == 0) {
                        return isGameOver;
                    }
                }

            }
        }

    }
    return true;
}