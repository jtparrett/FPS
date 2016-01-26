var FPS = function(){
  this.stats = [];
  this.startTime = 0;
  this.frame = 0;
  this.width = 100;
  this.height = 60;

  this.createCanvas();
  this.loop();
};

FPS.prototype = {
  createCanvas: function(){
    this.el = document.createElement('canvas');
    this.context = this.el.getContext('2d');
    this.el.width = this.width;
    this.el.height = this.height;
    this.context.fillStyle = '#58fd09';
    this.el.setAttribute('style', '
      position: fixed;
      top: 0;
      right: 0;
      background: red;
      z-index: 200');
    document.body.appendChild(this.el);
  },

  loop: function(){
    var self = this;
    window.requestAnimationFrame(function(){
      self.update();
      self.loop();
    }); 
  },

  update: function(){
    var prevFps = this.getFPS();

    this.context.clearRect(0, 0, this.width, this.height);

    for(var i = 0; i < this.width; i++){
      var tmpPrevFps = this.stats[i];
      this.stats[i] = prevFps;
      prevFps = tmpPrevFps;
      this.context.fillRect(this.width - i - 1, this.height - tmpPrevFps, 1, tmpPrevFps);
    }
  },

  getFPS: function(){
    this.frame++;

    var d = new Date().getTime();
    var currentTime = (d - this.startTime) / 1000;
    var result = Math.floor((this.frame / currentTime));

    if(currentTime > 1){
      this.startTime = new Date().getTime();
      this.frame = 0;
    }

    return result;
  }
};

new FPS();