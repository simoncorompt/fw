import config from 'config'
import async from 'async'
import React from 'react'
import ReactDOM from 'react-dom'
import _ from '_'
import {i18n, Localize, logger, Is} from 'base'
import App from './components/app'
import router from './router'
import { AppContainer } from 'react-hot-loader'

var setup = []

//Setup Error
function setupError(error) {
  throw new Error('Setup App fail:', error)
}

// Setup Path
setup.push(function (next) {
  i18n.path = `${config.path}locales/`
  router.path = config.path
  next()
})

// Setup logger
setup.push(function (next) {
  logger.enable = config.env === 'dev'
  logger.show('*')
  next()
})

// Setup Locale
setup.push(function (next) {
  // Get the locale from the URL
  function getLocaleFromURL(locale, path) {
    var hash = path || window.location.pathname,
      regex = new RegExp(`^${config.path}({l})(/.*)?$`.replace('{l}', config.locales.join('|')))

    // Fix ie9
    if (Is.lteie9 && _.isUndefined(path)) {
      hash = path || window.location.hash.substr(1)
      regex = new RegExp('^/({l})(/.*)?$'.replace('{l}', config.locales.join('|')))
    }

    return hash.search(regex) > -1 ? hash.replace(regex, '$1') : locale
  }

  // Files
  i18n.addFile('main')
  Localize.defaultFile = 'main'

  // Locale
  i18n.locale = getLocaleFromURL(config.locale)

  // Router middleware
  router.use(function (ctx, next) {
    i18n.locale = getLocaleFromURL(config.locale, ctx.path)
    i18n.sync().then(next)
  })

  // Sync
  i18n.sync().catch(setupError).then(next)
})

// Setup app
setup.push(function (next) {
  ReactDOM.render(
    <AppContainer>
      <App ref={(el) => router.app = el} />
    </AppContainer>,
    document.getElementById('container')
  )

  // Hot Module Replacement API
  if (module.hot) {
    module.hot.accept('./components/app', () => {
      ReactDOM.render(
        <AppContainer>
          <App ref={(el) => router.app = el} />
        </AppContainer>,
        document.getElementById('container')
      )
    });
  }
  next()
})

// Launch app
async.series(setup, function () {
  router.start().catch(setupError)
})


//------o Add Multiple events from same El

console.shallowCloneLog = function () {
  var typeString = Function.prototype.call.bind(Object.prototype.toString)
  console.log.apply(console, Array.prototype.map.call(arguments, function (x) {
    switch (typeString(x).slice(8, -1)) {
      case 'Number':
      case 'String':
      case 'Undefined':
      case 'Null':
      case 'Boolean':
        return x
      case 'Array':
        return x.slice()
      default:
        var out = Object.create(Object.getPrototypeOf(x))
        out.constructor = x.constructor
        for (var key in x) {
          out[key] = x[key]
        }
        Object.defineProperty(out, 'constructor', {value: x.constructor})
        return out
    }
  }))
}
