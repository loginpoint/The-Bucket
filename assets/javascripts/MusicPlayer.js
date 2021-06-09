const music = new Audio();
var path    = 'assets/Music/';
var sp;
var perc;
var interval;
var prop = false;
var playCounter = 1;
var playlist = 0;
var shuffle = false;
var isDown = false;
var volDown = false;
var $this;
var payLoad = [
    ['song1.mp3','Evancsence','Bring me to life','http://music.flatfull.com/waveme/wp-content/uploads/sites/2/2020/09/Artboard-28.png'],
    ['song2.mp3','Evancsence','My Immortal','http://music.flatfull.com/waveme/wp-content/uploads/sites/2/2020/09/Artboard-23.png'],
    ['song3.mp3','Evancsence','Lithum','http://music.flatfull.com/waveme/wp-content/uploads/sites/2/2020/09/Artboard-22.png']
];
music.volume = 0.5;
class pl {
    constructor(_sn,_sb,_ss,_sm) {
        this.sn = _sn;
        this.sb = _sb;
        this.ss = _ss;
        this.sm = _sm;
    }
    formate = (time) => {
       var min = Math.floor(time/60);
       var sec = Math.floor(time%60);
       min = (min < 10) ? '0' + min : min;
       sec = (sec < 10) ? '0' + sec : sec;
       return `${min}:${sec}`; 
    }
    load = () => {
        $this = this;
        music.src = path + this.ss;
        sn.innerText = this.sn;
        an.innerText = this.sb;
        musicImg.src = this.sm;
        music.src = path + this.ss;
        music.addEventListener('loadedmetadata',function(){
           dur.innerText = $this.formate(music.duration);
        })
    }
    playToggle = () => {
        if(!music.paused) {
            music.pause();
            play.setAttribute('name','play')
            clearInterval(interval)
        } else {
            music.play();
            play.setAttribute('name','pause')
            intervalSet();
        }
    }
    next = () => {
        reset();
        if(playCounter >= payLoad.length - 1) {
            playCounter = 0;
        } else {
            playCounter++;
        }
        init()
    }
    prev = () => {
        if(playCounter == 0) {
            playCounter = payLoad.length - 1;
        } else {
            playCounter--;
        }
        init()
    }
    looper = (ele,event,init,fn) => {
       
        if(init == null || init == true) {
            event = window.event;
            var spaceArea = ele.getBoundingClientRect().x;
            var mouseLocation = event.pageX;
            var initPoint = mouseLocation - spaceArea;
            perc   =  initPoint/ele.clientWidth;
            fn(perc);
        }
    }
    volume = () => {
        brVl.style.width = perc*100 + '%';
        ballVl.style.left = perc*100 + '%';
        music.volume = perc;
    }
    reset = () => {
        curr.innerText = '00:00';
        clearInterval(interval);
        br.removeAttribute('style');
        ball.removeAttribute('style');
    }
}


init();
function init() {
    sp = new pl(payLoad[playCounter][2],payLoad[playCounter][1],payLoad[playCounter][0],payLoad[playCounter][3]);
    sp.load();
}
function intervalSet() {
    clearInterval(interval);
    interval = setInterval(function(ele){
        var perc = music.currentTime/music.duration * 100;
        curr.innerText = sp.formate(music.currentTime);
        br.style.width = perc + '%';
        ball.style.left = perc + '%';
    },1000)
}
//propagtion controll 

ball.addEventListener('mousedown',function(){
   isDown  = true;
   clearInterval(interval);
});
ballVl.addEventListener('mousedown',function(){
    volDown = true;
})
document.addEventListener('mouseup',function(){
    if(isDown) {
        isDown = false;
        music.currentTime = music.duration * perc;
    }
    volDown = false;
    intervalSet();
});

document.addEventListener('mousemove',function(e){
    sp.looper(pr,e,isDown,function(){
        perc = (perc >= 1) ? 1 : (perc <0 ) ? 0 : perc;
        br.style.width = perc*100 + '%';
        ball.style.left = perc*100 + '%';
        curr.innerText = sp.formate(music.currentTime);
    })
    if(volDown) {
       sp.looper(volpr,e,volDown,function(){
            perc = (perc >= 1) ? 1 : (perc <0 ) ? 0 : perc;
            sp.volume();
       });

    }
})
pr.addEventListener('click',function(e){
    sp.looper(this,e,null,function(getpoint){
        var calc = getpoint*100 + '%'
        br.style.width = calc;
        ball.style.left = calc;
        music.currentTime = music.duration * getpoint;
    })
})
volpr.addEventListener('click',function(e){
    sp.looper(this,e,null,function(){
        sp.volume();
    })
})
function reset() {
    
}
//action on end
music.addEventListener('ended',function(){
   if(!shuffle) {
    if(playlist == 0) {
        if(playCounter == payLoad.length - 1) {
         playCounter = 0;
         init();
         sp.reset();
        } else {
           sp.next();
           sp.playToggle();
        }
    } else if(playlist == 1) {
           sp.reset();
           sp.playToggle();
    } else {
       if(playCounter == payLoad.length - 1) {
           sp.reset();
           playCounter = 0;
           init();
           sp.playToggle();
       } else {
           sp.next();
           sp.playToggle();
       }
    }
   } else {
       playCounter = Math.floor(Math.random() * (payLoad.length - 1));
       init();
       console.log(playCounter);
       sp.playToggle();
   }
})
//trigger
nxt.addEventListener('click',function(){
    sp.reset();
    sp.next();
    sp.playToggle();
});
prev.addEventListener('click',function(){
    sp.prev();
    sp.playToggle();
});
play.addEventListener('click',function(){
    sp.playToggle();
});
shuf.addEventListener('click',function(){
    shuffle = (shuffle) ? false : true;
    this.classList.toggle('active');
});
playl.addEventListener('click',function(){
    playlist = (playlist == 0) ? 1 : (playlist == 1) ? 2 : 0;
    if(!playl.classList.contains('rs') && !playl.classList.contains('rp')) {
        playl.classList.add('rs');
    } else if(playl.classList.contains('rs')) {
        playl.classList.add('rp')
        playl.classList.remove('rs')
    } else if(playl.classList.contains('rp')){
        playl.classList.remove('rp');
    }
})
/*

 0 => play only the current song then stop
 1 => repeat song
 2 => repeat playlist 

*/
