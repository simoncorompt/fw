import {Is} from 'base'

export class LazyLoad {

  /**
   * Init constructor.
   * @param {opts} Elements DOM need to load.
   */
  constructor(opts) {

    /**
     * @name aElements
     * @desc Array of elements representing a LazyLoad load item
     * @access public
     * @instance
     * @member LazyLoad
     * @type {Array.<Object>}
     */
    this.aElements = [];

    /**
     * @name isMobile
     * @desc If you want the lazy load to load the source provided in data-src-m
     * @access public
     * @instance
     * @member LazyLoad
     * @type {boolean}
     */
    this.isMobile =	Is.isMobileTablet;

    /**
     * @name aType
     * @desc <p>Array of different types allowed with their extensions</p>
     * <p>Types allowed:</p>
     * <p><ul>
     * <li>image (.gif, .png, .jpg, .svg, .webp)</li>
     * <li>video (.mp4)</li>
     * <li>iframe</li>
     * </ul></p>
     * @access public
     * @instance
     * @member LazyLoad
     * @type {Object}
     */
    this.aType = {
      image: ['gif', 'jpg', 'webp', 'png', 'svg'],
      video: ['mp4'],
      iframe: []
    };

    /**
     * @name viewport
     * @desc Viewport object representing the current width/height of the browser
     * @access public
     * @instance
     * @member LazyLoad
     * @type {Object}
     */
    this.viewport = {
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    };

    /**
     * @name allLoaded
     * @desc Are all the elements loaded?
     * @access public
     * @instance
     * @member LazyLoad
     * @type {boolean}
     */
    this.allLoaded = false;

    /**
     * Ticket to access the scrollY on RAF
     * @access public
     * @member LazyLoad
     * @instance
     * @type {boolean}
     */
    this.ticketScroll = false;

    /**
     * Are the events binded?
     * @access public
     * @member LazyLoad
     * @instance
     * @type {boolean}
     */
    this.isBinded = false;

    /**
     * Current scrollY value
     * @access public
     * @member LazyLoad
     * @instance
     * @type {int}
     */
    this.scrollY = window.scrollY || window.pageYOffset;

    /**
     * Contains all the handler references
     * @access public
     * @member LazyLoad
     * @instance
     * @type {Object}
     */
    this.handlers = {
      onImageLoaded: this._onImageLoaded.bind(this),
      onScroll: this._onScroll.bind(this),
      onUpdate: this._onUpdate.bind(this)
    };

    console.log("init lazyLoad")

    // this.isDispose = false;
    this.rafID = 0;
    // convert to array
    var arrayElements = Object.keys(opts.elements).map(key => opts.elements[key]);
    // reverse the array
    arrayElements = arrayElements.reverse();
    this.init(arrayElements);

  }

  init(els) {

    this.scrollY = window.scrollY || document.documentElement.scrollTop;

    if(els){
      els.map((el, i)=>{
        var element = this._createElements.call(this, el, i, els);

        if (element.error) {
          console.info(this.aElements[i].errorMessage, this.aElements[i]);
        } else {
          this.aElements.push(element);
        }
      })
    }

    // remove references
    this.elements = null;

    this._bindEvents();

    // first pass
    this.load();

  };

  /**
   * Load elements.
   */
  load() {

    for (var i = this.aElements.length - 1; i >= 0; i--) {

      var element = this.aElements[i];
      if (!this._isVisible(element) || element.isLoaded || element.isLoading) continue;

      var type = this.isMobile ? element.typeMobile : element.type;

      switch (type) {
        case 'image': this._loadImage(element); break;
        case 'video': this._loadVideo(element); break;
        case 'iframe':this._loadIframe(element); break;
      }
    }

    return this;

  };

  /**
   * Create Elements and get a type of the element.
   * @param {el_} the element from the DOM.
   * @param {idx_}
   * @param {list_}
   */
  _createElements(el_, idx_, list_) {
    let element = this._createBasicElement.call(this, el_);

    // SRC
    if (el_.getAttribute('data-src') === null) {
      element.error = true;
      element.errorMessage = 'no src provided';
      element.isLoaded = true;
      return element;
    }

    element.src = el_.getAttribute('data-src').replace(' ', '');
    element.src = element.src.substr(0, 4) !== 'http' && element.src.substr(0, 2) !== '//' ? element.src.substr(0, 1) === '/' ? '//' + window.location.hostname + element.src : '//' + window.location.hostname + window.location.pathname + element.src : element.src;
    element.src = encodeURI(element.src);

    element.srcMobile = el_.getAttribute('data-src-m') !== null ? el_.getAttribute('data-src-m').replace(' ', '') : element.src;
    element.srcMobile = element.srcMobile.substr(0, 4) !== 'http' && element.srcMobile.substr(0, 2) !== '//' ? element.srcMobile.substr(0, 1) === '/' ? '//' + window.location.hostname + element.srcMobile : '//' + window.location.hostname + window.location.pathname + element.srcMobile : element.srcMobile;
    element.srcMobile = encodeURI(element.srcMobile);
    // misc
    element.height = el_.getAttribute('data-height') !== null ? parseInt(el_.getAttribute('data-height'), 0) : el_.clientHeight;
    element.top = el_.getBoundingClientRect().top + this.scrollY;

    element.type = el_.getAttribute('data-type') ? this._validateType(el_.getAttribute('data-type')) : this._getType(element.src);
    element.typeMobile = el_.getAttribute('data-type-m') ? this._validateType(el_.getAttribute('data-type-m')) : this._getType(element.srcMobile);

    if (element.typeMobile === null && element.src === element.srcMobile)
      element.typeMobile = element.type;

    if (element.type === null) {
      element.error = true;
      element.errorMessage = 'no type recognized';
      element.isLoaded = true;
      return element;
    }

    console.log('-->', element);

    return element;

  };

  /**
   * Create basic object of an element
   * @param {el_} the DOM element.
   * @return {El} Object with the different information about this element.
   */
  _createBasicElement(el_) {

    return {
      container: el_,
      src: null,
      error: false,
      errorMessage: '',
      srcMobile: null,
      isLoaded: false,
      isLoading: false,
      isShown: false,
      height: 0,
      top: 0,
      type: null,
      typeMobile: null
    };

  };

  _getType(src_) {

    var extension = src_.split('.').pop();
    extension = extension.split('?')[0].toLowerCase();

    for (var type in this.aType) {

      var extensions = this.aType[type];

      for (var i = extensions.length - 1; i >= 0; i--) {
        if (extensions[i] === extension) return type;
      }

    }

    return null;
  };

  _validateType(type_) {

    for (var type in this.aType) {
      if (type === type_.toLowerCase()) return type;
    }

    return null;
  };


  _onImageLoaded(img_, element_) {

    element_.isLoaded = true;
    element_.isLoading = false;

    // Pinterest!
    var src = this.isMobile ? element_.srcMobile : element_.src;
    var pinSrc = src.substr(0, 4) !== 'http' ?  window.location.protocol + src : src;

    element_.el.setAttribute('data-pin-media', pinSrc);
    element_.el.setAttribute('srcset', pinSrc);
    element_.el.setAttribute('data-pin-url', window.location.pathname);

    // Clean URL
    if (URL) {
      URL.revokeObjectURL(img_.src);
    }

    if (element_.xhr !== null)
      element_.xhr = null;

    element_.container.appendChild(element_.el);

    this._showElement(element_);

  };

  _onScroll(e) {
    this.ticketScroll = true;
  };

  /**
   * Call on every frame(request animation frame), get a current scroll and call a load function.
   */
  _isVisible(element_){
    var top = element_.top;
    return (top <= this.viewport.height + this.scrollY && top + element_.height >= this.scrollY);
  };

  // Actions

  _loadImage(element_) {

    element_.xhr = null;
    element_.isLoading = true;

    // create image
    var img = new Image();
    var src = this.isMobile ? element_.srcMobile : element_.src;
    element_.el = img;

    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

    // Trigger the loading with a XHR request
    if ( !isSafari && URL && Blob && XMLHttpRequest) {

      var xhr = new XMLHttpRequest();
      xhr.open( 'GET', src, true );
      xhr.responseType = 'arraybuffer';

      element_.xhr = xhr;

      xhr.onerror = ((e)=> {

        // load old fashion way
        img.addEventListener('onload', this.handlers.onImageLoaded(img, element_));
        img.src = src;

      });

      xhr.onload = (function(e) {

        if (xhr.readyState === 4) {

          if ( xhr.status === 200) {

            var extension = src.split('.').pop();
            extension = extension.split('?')[0].toLowerCase();

            // Obtain a blob: URL for the image data.
            var arrayBufferView = new window.Uint8Array(xhr.response);
            var blob = new Blob( [ arrayBufferView ], {type: 'image/' + extension} );
            var imageUrl = URL.createObjectURL(blob);

            // load from the cache as the blob is here already
            img.addEventListener('onload', this.handlers.onImageLoaded(img, element_));
            img.src = imageUrl;

          } else {

            // somwthign went wrong..
            img.addEventListener('onload', this.handlers.onImageLoaded(img, element_));
            img.src = src;

          }

        }

      }).bind(this);

      xhr.send();

    } else {

      // load old fashion way
      img.addEventListener('onload', this.handlers.onImageLoaded(img, element_));
      img.src = src;

    }

  };

  _onImageLoaded(img_, element_) {

    element_.isLoaded = true;
    element_.isLoading = false;

    // Pinterest!
    var src = this.isMobile ? element_.srcMobile : element_.src;
    var pinSrc = src.substr(0, 4) !== 'http' ?  window.location.protocol + src : src;

    element_.el.setAttribute('data-pin-media', pinSrc);
    element_.el.setAttribute('srcset', pinSrc);
    element_.el.setAttribute('data-pin-url', window.location.pathname);

    // Clean URL
    if (URL) {
      URL.revokeObjectURL(img_.src);
    }

    if (element_.xhr !== null)
      element_.xhr = null;

    element_.container.appendChild(element_.el);

    this._showElement(element_);

  };

  _loadVideo(element_) {

    element_.isLoading = true;

    var vid = document.createElement('video');
    element_.el = vid;

    vid.autoplay 	= element_.container.getAttribute('data-autoplay') !== null ? element_.container.getAttribute('data-autoplay') : true;
    vid.muted 		= element_.container.getAttribute('data-muted') !== null ? element_.container.getAttribute('data-muted') : true;
    vid.loop 			= element_.container.getAttribute('data-loop') !== null ? element_.container.getAttribute('data-loop') : true;
    vid.controls 	= element_.container.getAttribute('data-controls') !== null ? element_.container.getAttribute('data-controls') : false;

    vid.src = this.isMobile ? element_.srcMobile : element_.src;

    vid.onloadedmetadata = ()=>{

      element_.isLoaded = true;
      element_.isLoading = false;

      vid.onloadedmetadata = null;

      element_.container.appendChild(vid);

      this._showElement(element_);

    };

  };

  _loadIframe(element_) {

    element_.isLoading = true;
    element_.xhr = null;

    if (XMLHttpRequest) {

      var xhr = new XMLHttpRequest();
      xhr.open('GET', element_.src, true);
      xhr.responseType = 'document';

      element_.xhr = xhr;

      xhr.onreadystatechange = (function(e) {

        if (xhr.readyState !== 4) return;

        // What about errors? 200 doesn't seem to ever come, probably a security stuff.
        // if (xhr.status !== 200) return;

        this._iframeLoaded(element_);

      }).bind(this);

      xhr.send(null);

    } else {
      this._iframeLoaded(element_);
    }

  };

  _iframeLoaded(element_) {

    element_.isLoaded = true;
    element_.isLoading = false;

    if (element_.xhr !== null)
      element_.xhr = null;

    var iframe = document.createElement('iframe');
    iframe.src = element_.src;

    element_.container.appendChild(iframe);
    element_.el = iframe;

    this._showElement(element_);

  };

  _showElement(element_) {

    //var event = new CustomEvent(LazyLoad.EVENT.ELEMENT_LOADED, {detail: element_});
    //this.el.dispatchEvent(event);

    setTimeout(()=>{

      element_.container.classList.add('show');
      element_.container.classList.add('loaded');
      element_.isShown = true;

    }, 300);

    this._checkIfAllLoaded();

  };

  _checkIfAllLoaded() {

    var check = true;

    for (var i = this.aElements.length - 1; i >= 0; i--) {
      if (!this.aElements[i].isLoaded) check = false;
    }

    if (check) {

      console.log(check)

      //var event = new CustomEvent(LazyLoad.EVENT.COMPLETE);
      this.el.dispatchEvent(event);

      this.allLoaded = true;
      this._unbindEvents();
    }


  };

  /**
   * Bind events, specially a scroll event. The goal is to get a current scroll.
   */
  _bindEvents() {

    if (this.isBinded) return this;

    this.isBinded = true;

    window.addEventListener('scroll', this.handlers.onScroll);
    this.rafID = requestAnimationFrame(this.handlers.onUpdate);

    return this;
  };

  _unbindEvents() {

    if (!this.isBinded) return this;

    this.isBinded = false;

    window.removeEventListener('scroll', this.handlers.onScroll);
    if (this.rafID) window.cancelAnimationFrame(this.rafID);
    this.rafID = 0;

    return this;

  };

  // Events
  _onScroll(e) {
    this.ticketScroll = true;
  };

  /**
   * Call on every frame(request animation frame), get a current scroll and call a load function.
   */
  _onUpdate(e) {

    // once everything is loaded, no need to check
    if (this.allLoaded) return;

    if (this.ticketScroll) {

      this.ticketScroll = false;
      this.scrollY =  window.scrollY || window.pageYOffset;

      this.load();

    }

    this.rafID = requestAnimationFrame(this.handlers.onUpdate);

  };

  /**
   * Stop a process and remove the different elements loaded
   */
  dispose() {

    this._unbindEvents();
    // this.raf= null;

    for (var i = this.aElements.length - 1; i >= 0; i--) {
      this._reset(this.aElements[i]);
    }

    this.aElements.length = 0;
    this.aElements = [];

    this.el = null;

    return this;

  }

  /**
   * Reset the lazy load and init it.
   */
  reset(el_){

    var el = el_ !== undefined ? el_ : null;

    for (var i = this.aElements.length - 1; i >= 0; i--) {

      if (el !== null) {

        // reflow only this one
        if (this.aElements[i].el === el)
          this._reset(this.aElements[i]);

      } else {
        this._reset(this.aElements[i]);
      }

    }

    if (el === null)
      this.allLoaded = false;

    // restart
    this._bindEvents();

    return this;

  };

  _reset(element_) {

    if (element_.xhr !== undefined && element_.xhr !== null) {
      element_.xhr.abort();
      element_.xhr = null;
    }

    element_.isLoaded = false;
    element_.isLoading = false;

    element_.container.classList.remove('show');
    element_.container.classList.remove('loaded');

    if (element_.el !== undefined && element_.el.parentNode !== null)
      element_.el.parentNode.removeChild(element_.el);

  }

}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (function () {
    return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();
}

export default LazyLoad;