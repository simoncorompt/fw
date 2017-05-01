import _ from '_';
import resize from 'resize';

class Values {

  constructor() {
    this.onResize = this.onResize.bind(this)
    this.init()
  }

  init() {

    resize.add(this.onResize)

    /**
     * Viewport object
     * @type {Object}
     */
    this.viewport = {width: 0, height: 0, wrapperWidth: 0};

    /**
     * Mouse object
     * @type {Object}
     */
    this.mouse = {x: 0, y: 0};

    /**
     * Touch object
     * @type {Object}
     */
    this.touch = {x: 0, y: 0, startX: 0, startY: 0, deltaX: 0, deltaY: 0};

    /**
     * Is mouse out of window?
     * @type {boolean}
     */
    this.outWindow = false;

    /**
     * scroll Y value
     * @type {number}
     */
    this.scrollY = 0;

    /**
     * scroll Y direction
     * @type {number}
     */
    this.scrollYDirection = 'down';

    /**
     * Is scroll/touch ?
     * @type {boolean}
     */
    this.isTouch = 0;

  }

  onResize() {

  }
}
var values = new Values();
export default values;
