import EventEmitter from 'events'
import VirtualScroll from 'virtual-scroll'
import raf from 'raf'

const defaults = {
  disableEasingOnEnds: false,
  fromNav: false,
  components: {
    default: []
  },
  key: 'default',
  magnetize: true,
  loading: true,
  canRoute: false,
  ease: .065,
  started: false
}

const scrollDefaults = {
  height: 0,
  targetY: 0,
  currentY: 0,
  direction: 0
}

class ScrollManager extends EventEmitter {
  constructor(options) {
    super(options)
    Object.assign(this, defaults, scrollDefaults)
    this.start()
    window.Scroller = this
  }

  start() {
    this.started = true

    // Disable scrolling on touch devices
    document.addEventListener('touchmove', (e) => {e.preventDefault()})
    window.addEventListener('resize', this.onResize)

    this.virtualScroll = new VirtualScroll({
      touchMultiplier: 4,
      mouseMultiplier: .7,
      firefoxMultiplier: 56
    })

    this.virtualScroll.on(this.onScroll)

    raf.add(this.onRAF)

    return this
  }

  pause() {
    this.started = false
    return this
  }

  play() {
    this.started = true
    return this
  }

  stop() {
    this.started = false
    this.virtualScroll.off(this.onScroll)
    window.removeEventListener('resize', this.onResize)

    raf.remove(this.onRAF)
    Object.assign(this, defaults)
  }

  calculateMagnets() {
    this.magnets = [
      {
        "direction": "forward",
        "start": 0,
        "end": -4 * window.innerHeight
      },
      {
        "direction": "forward",
        "start": -4 * window.innerHeight,
        "end": -8 * window.innerHeight
      },
      {
        "direction": "backward",
        "start": -this.height + 4 * window.innerHeight,
        "end": -this.height,
        "scrollTo": -this.height + 4 * window.innerHeight
      }
    ]
  }

  set({ offset, key, el, magnetize = true, noReset = false, projectData = {} }) {
    this.emit('beforeSet', key)

    if (key == 'about') this.temp = Scroller.currentY

    if (this.fromNav) {
      offset = 'start'
      Object.assign(this, {
        el: el,
        key: key,
        magnetize: magnetize,
        projectData: projectData
      })
    } else {
      Object.assign(this, scrollDefaults, {
        el: el,
        key: key,
        magnetize: magnetize,
        projectData: projectData
      })
    }

    this.height = el.getBoundingClientRect().height - window.innerHeight
    this.viewportHeight = window.innerHeight
    this.offset = offset

    if (!noReset) {
      if (offset == 'end') {
        this.targetY = -this.height
        this.currentY = -this.height
      }

      clearTimeout(this.magnet)
      this.calculateMagnets()
      this.resetAll(offset)
      this.sync()
    }

    this.emit('set', projectData)
    this.fromNav = false
    //console.log('SET SCROLLER KEY (', this.key, ')', this.components);
    return this
  }

  registerComponent(component, key) {
    if (key) {

      if (!this.components[key])
        this.components[key] = []

      if (this.components[key].indexOf(component) === -1)
        this.components[key].push(component)

    } else {
      if (this.components.default.indexOf(component) === -1) {
        this.components.default.push(component)
      }
    }

  }

  unregisterComponent(component, key) {
    this.components[key] = this.components[key].filter(item => item !== component)
  }

  unregisterAllComponents(component) {
    this.resetAll()
    this.components = {
      default: []
    }
  }

  sync() {
    this.components['default'].map(component => {
      component.sync && component.sync()
    })

    this.components[this.key].map(component => {
      component.sync && component.sync()
    })
  }

  resetAll(offset) {
    const perc = (offset === 'start') ? 0 : 1

    this.components['default'].map(component => {
      component.reset && component.reset(perc)
    })

    this.components[this.key].map(component => {
      component.reset && component.reset(perc)
    })
  }

  getPerc(offset, height, negative = false) {
    const scrollStart = -this.currentY - offset
    const perc = negative ?
      Math.min(scrollStart / height, 1)
      : Math.min(Math.max(0, scrollStart / Math.abs(height)), 1)

    return perc
  }

  getViewportPerc(offset) {
    const scrollStart = -this.currentY - offset
    const perc = Math.min(Math.max(0, scrollStart / this.viewportHeight), 1)
    return perc
  }

  getY(offset) {
    return offset
  }

  getOffset(element) {
    let actualOffset = element.offsetTop
    let current = element.offsetParent

    while (current != null) {
      actualOffset += current.offsetTop
      current = current.offsetParent
    }

    return actualOffset
  }

  isInViewport(elOffset) {
    return this.currentY + elOffset < 0
  }

  isVisible(elOffset, elHeight) {
    return (this.currentY + elOffset < this.viewportHeight / 2 && this.currentY + elOffset + elHeight > -this.viewportHeight / 2)
  }

  scrollTo(y, t = .8, distanceRelative = false) {
    return new Promise(resolve => {
      if (this.magnets) clearTimeout(this.magnets)
      this.scrollToActive = true

      const timeFromDistance = Math.abs( t * (this.currentY - y) * .0008 )

      this.scrollToTween = TweenMax.to(this, distanceRelative ? timeFromDistance : t, {
           currentY: y,
           targetY: y,
           ease: Power3.easeInOut,
           onUpdate: () => {
             this.currentY = Math.floor(this.currentY)
             this.targetY = Math.floor(this.targetY)
           },
           onComplete: () => {
             resolve()
             this.scrollToActive = false
           }
      })
    })
  }

  onResize = () => {

    this.viewportHeight = window.innerHeight

    if (this.started && this.el) {
      this.height = this.el.getBoundingClientRect().height - window.innerHeight
    }

    this.calculateMagnets()
    this.sync()
  }

  onScroll = (e) => {
    if (!this.started) return
    this.targetY += e.deltaY

    if (!this.disableEasingOnEnds) {
      this.targetY = Math.max(this.height * -1, this.targetY)
      this.targetY = Math.min(0, this.targetY)
    }

    window.Scroller = this
    if (this.scrollToTween) {
      this.scrollToActive = false
      this.scrollToTween.kill()
    }

    if (this.magnets && this.magnets.length > 0 && this.magnetize) this.magnetizePoints()

  }

  magnetizePoints = () => {
    clearTimeout(this.magnetTimeout)

    this.magnetTimeout = setTimeout(() => {

      if (this.scrollToActive || this.loading) return

      this.magnets.map(magnet => {
        if (magnet.direction === 'backward') {
          if (this.targetY < magnet.start && this.targetY >= magnet.end)
            this.scrollTo(magnet.scrollTo || magnet.end, undefined, true)
        } else {
          if (this.targetY <= magnet.start && this.targetY > magnet.end)
            this.scrollTo(magnet.scrollTo || magnet.end, undefined, true)
        }
      })
    }, 1000)
  }

  onRAF = () => {
    this.currentY += Math.floor( (this.targetY - this.currentY) * this.ease )
    this.direction = (this.targetY - this.currentY) < 0 ? 1 : -1
    this.direction = (this.targetY == this.currentY) ? 0 : this.direction

    let rafFired = 0
    this.components[this.key].map(component => {
      if (!component.active) return
      if (component.height && component.offset && component.autoPause) {
        const active = this.isVisible(component.offset, component.height)

        if (active) {
          rafFired++
          component.raf && component.raf(this.currentY)
        }

      } else {
        component.raf && component.raf(this.currentY)
      }

    })

    rafFired = 0

    this.components['default'].map(component => {
      if (!component.active) return
      component.raf && component.raf(this.currentY)
    })

  }

}

export const Scroller = new ScrollManager()
