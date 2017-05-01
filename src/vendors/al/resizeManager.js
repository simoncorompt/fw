/**
 * Scroll Manager
 */
import _ from '_';
import $ from 'jquery';
import EventEmitter from 'events';

export class ResizeManager extends EventEmitter {
    constructor() {
        super();

        this.setMaxListeners(1000);

        this.$body = $('body');
        this.$window = $(window);
        this.MARGIN_SIZE = 30 * 2;
        this.MIN = 910;
        this.MAX = 1220;
        this.windowHeight = this.getWindowHeight();
        this.windowWidth = this.getWindowWidth();
        this.SIZE = {
            MAX: this.MAX,
            MIN: this.MIN
        };

        this.resize = this.resize.bind(this);
        // Resize event
        this.$window.on('resize', this.resize);

    }

    purgeCache() {
        this.pageWidth = null;
        this.windowHeight = null;
        this.windowWidth = null;
    }

    resize() {
        // Cache & dispatch
        this.purgeCache();
        this.emit('change');
    }


    getWindowHeight() {
        if (this.getMobileOperatingSystem() === 'iOS') {
            this.windowHeight = window.screen.availHeight;
        } else {
            this.windowHeight = window.innerHeight;
        }

        return this.windowHeight;
    }


    getWindowWidth() {
        this.windowWidth = window.innerWidth;
        return this.windowWidth;
    }

    getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
            return 'iOS';

        }
        else if (userAgent.match(/Android/i)) {

            return 'Android';
        }
        else {
            return 'unknown';
        }
    }

}
var resizeManager = new ResizeManager();
export default resizeManager;