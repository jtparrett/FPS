var FPS = function(){
  this.stats = [];
  this.startTime = 0;
  this.frame = 0;
  this.width = 150;
  this.height = 60;

  this.realWidth = this.width + 24;

  this.create();
  this.toggle();
};

FPS.prototype = {
  create: function(){
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.classList.add('fps__canvas');

    this.context.font = "14px Arial";

    this.el = document.createElement('div');
    this.el.classList.add('fps');

    this.el.appendChild(this.canvas);
    document.body.appendChild(this.el);
    this.dragEvent();
  },

  dragEvent: function(){
    var self = this;
    var diffs = {};
    var dragging = false;

    this.x = this.el.offsetLeft;
    this.y = this.el.offsetTop;

    this.el.onmousedown = function(e){
      diffs.x = e.clientX - self.x;
      diffs.y = e.clientY - self.y;
      dragging = true;
    };

    document.onmouseup = function(){
      dragging = false;
    };

    document.onmousemove = function(e){
      if(dragging){
        var newY = e.clientY - diffs.y;
        var newX = e.clientX - diffs.x;

        if(newX <= 0){
          newX = 0;
        } else if(newX + self.realWidth >= window.innerWidth){
          newX = window.innerWidth - self.realWidth;
        }

        if(newY <= 0){
          newY = 0;
        } else if(newY + self.height >= window.innerHeight){
          newY = window.innerHeight - self.height;
        }

        self.x = newX;
        self.y = newY;
        self.move();
        return false;
      }
    };
  },

  move: function(){
    this.el.style.left = this.x + 'px';
    this.el.style.top = this.y + 'px';
  },

  toggle: function(){
    this.hidden = (this.hidden)? false : true;
    var display = (this.hidden)? 'none' : 'block';
    this.el.style.display = display;
    this.loop();
  },

  loop: function(){
    var self = this;
    if(self.hidden){
      return false;
    }

    window.requestAnimationFrame(function(){
      self.update();
      self.loop();
    }); 
  },

  update: function(){
    var curFps = this.getFPS();
    var prevFps = curFps;

    this.context.fillStyle = '#94d5bf';
    this.context.clearRect(0, 0, this.width, this.height);

    for(var i = 0; i < this.width; i++){
      var tmpPrevFps = this.stats[i];
      this.stats[i] = prevFps;
      prevFps = tmpPrevFps;
      this.context.fillRect(this.width - i - 1, this.height - tmpPrevFps, 1, tmpPrevFps);
    }

    this.context.fillStyle = '#fff';
    this.context.fillText(curFps + ' fps', 5, this.height - 9);

    this.context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.context.fillRect(0, this.height - 30, this.width, 1);
  },

  getFPS: function(){
    this.frame++;

    var d = new Date().getTime();
    var currentTime = (d - this.startTime) / 1000;
    var result = Math.floor(this.frame / currentTime);

    if(currentTime > 1){
      this.startTime = new Date().getTime();
      this.frame = 0;
    }

    return result;
  }
};

var inst = new FPS();
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.message === "clicked_browser_action"){
    inst.toggle();
  }
});