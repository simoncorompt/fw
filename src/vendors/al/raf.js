import _ from '_';

// Request animation Singleton
class RAF {

  constructor() {
    this.requestAnimationID = null;
    this.process = this.process.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this)
    this.funcs = [];
  }

  /**
   * Process method of RAF
   */
  process() {
    _.forEach(this.funcs, (func) => {
      func();
    });
    this.requestAnimationID = window.requestAnimationFrame(this.process);
  }

  /**
   * Start RAF
   */
  start() {
    if (this.requestAnimationID === null) {
      this.process();
    }
  }

  /**
   * Add function to RAF and start RAF if needed
   * @param func
   */
  add(func) {

    let index = _.indexOf(this.funcs, func)

    if (index !== -1) return

    this.funcs.push(func);
    if (this.funcs.length > 0) {
      this.start();
    }
  }

  /**
   * Remove function to RAF and stop RAF if needed
   * @param func
   */
  remove(func) {
    this.funcs = _.remove(this.funcs, function (item) {
      return item === func;
    });
    if (this.funcs.length === 0) {
      this.stop();
    }
  }

  /**
   * Remove all functions from RAF and stop
   */
  removeAll() {
    this.funcs = [];
    this.stop();
  }

  /**
   * Stop RAF
   */
  stop() {
    if (this.requestAnimationID) {
      window.cancelAnimationFrame(this.requestAnimationID);
      this.requestAnimationID = null;
    }
  }
}
var raf = new RAF();
export default raf;
