/**
 * Manage a queue of functions to be executed in order
 * Especially useful for handling mouse hover in/out animations
 */
export default class Queue {
  constructor(options) {
    this.queue = []
    this.active = false
  }

  /**
   * Get the next/currently executed function
   * @return {Promise}
   */
  get currentFunc() {
    return this.queue[0]
  }

  /**
   * Start the execution of the queue
   */
  play() {
    this.active = true
    this.process()
  }

  /**
   * Stop the execution of the queue
   */
  stop() {
    this.active = false
  }

  /**
   * Execute functions in the queue in waterfall
   */
  process() {
    if (this.queue.length == 0) return
    this.processing = true
    this.currentFunc().then(() => {
      this.processing = false
      this.remove(this.currentFunc)
      if (this.active) this.process()
    })
  }

  /**
   * Add a new function to the queue
   * @param {Promise} func
   */
  add(func, type) {
    // If we have pending functions that haven't been
    // executed yet, replace with the last one. Else just add to queue
    if (this.processing && this.queue.length > 1)
      this.queue = this.queue.slice(0, this.queue.length - 1).concat([func])
    else
      this.queue = this.queue.concat([func])

    if (!this.processing) this.play()
  }

  /**
   * Remove a function from the queue
   * @param {Promise} func
   */
  remove(func) {
    this.queue = this.queue.filter(f => f != func)
  }

  /**
   * Remove all functions from queue
   */
  removeAll() {
    this.queue = []
  }

}
