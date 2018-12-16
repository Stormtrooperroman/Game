var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;

function startGame() {
	myBackground = new component(656, 270, "Space.jpg", 0, 0, "background");
	myGamePiece = new component(30, 30, "rgba(0, 0, 255, 0.5)", 10, 120);
	myObstacle  = new component(10, 200, "red", 300, 120);    
	myScore = new component("30px", "Consolas", "green", 280, 40, "text");
	myGameArea.start();
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }

}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
         if (this.type == "text" ) {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        if (type == "image" || type == "background") {
        ctx.drawImage(this.image, this.x,  this.y, this.width, this.height);
          if (type == "background") {
                ctx.drawImage(this.image,
                this.x + this.width, this.y, this.width, this.height);
            }
        } 
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
    	this.hitBottom();
        this.x += this.speedX;
        this.y += this.speedY;     
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }   
    }
    this.hitBottom = function() {
        if (this.y > myGameArea.canvas.height - this.height) {
            this.y = myGameArea.canvas.height - this.height;
        }
        if (this.x > myGameArea.canvas.width - this.width) {
            this.x = myGameArea.canvas.width - this.width;
        }
        if (this.y < 0 ) {
            this.y = 0;
        }
        if (this.x < 0) {
            this.x = 0;
        }
    }
     this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
           crash = false;
        }

        return crash;
    }
}
  function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        } 
    }
    myGameArea.clear();
    myBackground.speedX = -1; 
    myBackground.newPos(); 
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "red", x, 0));
        myObstacles.push(new component(10, x - height - gap, "red", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    	myGamePiece.speedX = 0;
    	myGamePiece.speedY = 0;    
    	if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; }
    	if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1; }
	    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1; }
	    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1; }
	    myScore.text="SCORE: " + myGameArea.frameNo;
    	myScore.update();
	    myGamePiece.newPos();    
	    myGamePiece.update();
}