/**
 * Manage preloaded contents
 */
export default class CacheManager {
  constructor(options) {
    this.ressources = {}
  }

  save(key, ressource) {
    this.ressources[key] = ressource
  }

  remove(key) {
    this.ressources[key] = null
  }

  get(key) {
    return this.ressources[key]
  }

}

export const Cache = new CacheManager()
window.Cache = Cache
