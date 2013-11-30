// By Raccoon
// include namespace
var Framework = (function (Framework) {
	Framework.Game = function () {
		// ensure forget use new keyword to call this function
		// as work as use new keyword.
		if (!(this instanceof arguments.callee)) return new arguments.callee();

		// gameloop is running ?
		this._isRun = false;
		// gameloop fps
		this._updateFPS = 60;
		this._drawFPS = 60;
		// show fps's div
		this._fpsContext = null;
		// FPS analysis object
		this._fpsAnalysis = new Framework.FpsAnalysis();
		this._drawfpsAnalysis = new Framework.FpsAnalysis();
		// for gameloop -
		this._runInstance = null;

        //Event Handler
        // mouse event
        this.click = function(e){};
        this.mousedown = function(e){};
        this.mouseup = function(e){};
        this.mousemove = function(e){};
        // touch event
        this.touchstart = function(e){};
        this.touchend = function(e){};
        this.touchmove = function(e){};

        var eventHandler = (function(that){
            return function(e){
                switch (e.type){
                    case "click":
                        that.click(e);
                        break;
                    case "mousedown":
                        that.mousedown(e);
                        break;
                    case "mouseup":
                        that.mouseup(e);
                        break;
                    case "mousemove":
                        that.mousemove(e);
                        break;
                    case "touchstart":
                        e.preventDefault();
                        that.touchstart(e);
                        break;
                    case "touchend":
                        e.preventDefault();
                        that.touchend(e);
                        break;
                    case "touchmove":
                        e.preventDefault();
                        that.touchmove(e);
                        break;
                }
            }
        })(this);

		// defined default Game screen (canvas object)
		this._convas = document.createElement("canvas");
		this._convas.setAttribute("id", "__game_canvas__");
		this._context = this._convas.getContext("2d");

		this.initialize = function () {
		};
		this.update = function () {
		};
		this.draw = function () {
		};

		this.start = function () {
			this.initialize();
            this._canvas.addEventListener("click" , eventHandler);
            this._canvas.addEventListener("mousedown" , eventHandler);
            this._canvas.addEventListener("mouseup" , eventHandler);
            this._canvas.addEventListener("mousemove" , eventHandler);
            this._canvas.addEventListener("touchstart" , eventHandler);
            this._canvas.addEventListener("touchend" , eventHandler);
            this._canvas.addEventListener("touchmove" , eventHandler);
			if (!this._isRun) {
				this.run();
			}
		};

		this.run = function () {
			// dynamic product runnable function
			this._run = (function (that) {
				// local variable for Game loop use
				var nextGameTick = (new Date()).getTime();
				var skipTicks = 1000 / that._updateFPS;
				return function () {
					while ((new Date()).getTime() > nextGameTick) {
						// update FPS counter
						that._fpsAnalysis.update();
						// show FPS information
						if (that.fpsContext) that.fpsContext.innerHTML = "update FPS:" + that._fpsAnalysis.getUpdateFPS() + "<br />draw FPS:" + that._drawfpsAnalysis.getUpdateFPS();
						// run Game's update
						that.update();
						// setup next run update time
						nextGameTick += skipTicks;
					}
					// run Game's draw
					that.draw(that._context);
					that._drawfpsAnalysis.update();
					if (that.fpsContext) that.fpsContext.innerHTML = "update FPS:" + that._fpsAnalysis.getUpdateFPS() + "<br />draw FPS:" + that._drawfpsAnalysis.getUpdateFPS();
				}
			})(this);
			this._runInstance = setInterval(this._run, 1000 / this._drawFPS);
			this._isRun = true;
		};

		this.stop = function () {
			if (this._isRun) {
				clearInterval(this._runInstance);
				this._runInstance = null;
				this._isRun = false;
			}
		};

		// propetity
		this.setUpdateFPS = function (fps) {
			this._updateFPS = fps;
			this.stop();
			this.run();
		};

		this.getUpdateFPS = function () {
			return this._updateFPS;
		};

		this.setDrawFPS = function (fps) {
			if (fps > 60) {
				Framework.DebugInfo.Log.warring("FPS must smaller than 60");
				fps = 60;
			}
			this._drawFPS = fps;
			this.stop();
			this.run();
		};

		this.getDrawFPS = function () {
			return this._drawFPS;
		};

        this.setCanvas = function(canvas){
            if(canvas){
                this._canvas = null;
                this._context = null;
                this._canvas = canvas;
                this._context = this._canvas.getContext("2d");
            }
        }

		this.setContext = function (context) {
			if (context) {
				this.context = null;
				this._canvas = null;
				this.context = context;
			} else {
				Framework.DebugInfo.Log.error("Game SetContext Error")
			}
		};

		this.getContext = function () {
			return this.context;
		};

		return this;
	};
	return Framework;
})(Framework || {});