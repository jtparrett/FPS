var FPS = function(){
  this.stats = [];
  this.startTime = 0;
  this.frame = 0;
  this.width = 150;
  this.height = 60;

  this.createCanvas();
  this.toggle();
};

FPS.prototype = {
  toggle: function(){
    this.hidden = (this.hidden)? false : true;
    if(this.hidden){
      this.el.style.display = 'none';
    } else {
      this.el.style.display = 'block';
    }
  },

  createCanvas: function(){
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.context.font = "14px Arial";
    this.canvas.classList.add('fps__canvas');

    this.el = document.createElement('div');
    this.el.classList.add('fps');

    this.el.appendChild(this.canvas);
    document.body.appendChild(this.el);
  },

  loop: function(){
    var self = this;
    window.requestAnimationFrame(function(){
      if(self.hidden){
        return false;
      }
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
    this.context.fillText(curFps + 'fps', 8, this.height - 8);

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
    inst.loop();
  }
});