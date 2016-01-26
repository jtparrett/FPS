var FPS = function(){
  this.startTime = 0;
  this.frame = 0;
  this.el = document.createElement('span');
  this.el.setAttribute('style', '
    position: fixed;
    top: 0;
    right: 0;
    background: red;
    padding: 10px;
    z-index: 200');

  document.body.appendChild(this.el);
  this.loop();
};

FPS.prototype = {
  loop: function(){
    var self = this;
    this.getFPS();
    window.requestAnimationFrame(function(){
      self.loop();
    }); 
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

    this.el.innerHTML = result;
  }
};

new FPS();