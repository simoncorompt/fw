import _ from '_';

class Resize {

  constructor() {

    this.windowHeight = null;
    this.windowWidth = null;

    this.getSize();
    this.funcs = [];

    //---------0 bind function
    this.onResize = this.onResize.bind(this);
    this.process = this.process.bind(this);
    this.start = this.start.bind(this);

    //---------0 resize Event
    window.addEventListener('resize', this.onResize, this)

  }

  purgeCache() {

    this.pageWidth = null;
    this.windowHeight = null;
    this.windowWidth = null;

  }

  onResize() {
    // Cache & dispatch
    this.purgeCache();
    this.getSize();
    this.process();
  }

  getSize() {

    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;

  }

  removeListerner() {

    window.removeEventListener('resize', this.onResize, this)

  }

  /**
   * Process method of Resize
   */
  process() {

    _.forEach(this.funcs, (func) => {
      func();
    });

  }

  /**
   * Start Resize
   */
  start() {

    //this.process();

  }

  /**
   * Add function to RAF and start RAF if needed
   * @param func
   */
  add(func) {

    let index = _.indexOf(this.funcs, func)

    if (index !== -1) return

    this.funcs.push(func)
  }

  remove(func) {

    this.funcs = _.remove(this.funcs, function (item) {
      return item === func;
    });

  }

}
var resize = new Resize();
export default resize;
