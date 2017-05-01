export default { 
        "home": function(context, params, route, el) {
          import('components/pages/home')
            .then(module => {
              context.setPage(module.default, params, route, el)
            })
            .catch(e => console.log(e))

          if (module.hot) {
            module.hot.accept('components/pages/home', () => {
              import('components/pages/home')
                .then(module => {
                  context.nextPage.setContent(module.default, params)
                  context.currentPage.setContent(module.default, params)
                })
                .catch(e => console.log(e))
            })
          }
        }
      ,
        "about": function(context, params, route, el) {
          import('components/pages/about')
            .then(module => {
              context.setPage(module.default, params, route, el)
            })
            .catch(e => console.log(e))

          if (module.hot) {
            module.hot.accept('components/pages/about', () => {
              import('components/pages/about')
                .then(module => {
                  context.nextPage.setContent(module.default, params)
                  context.currentPage.setContent(module.default, params)
                })
                .catch(e => console.log(e))
            })
          }
        }
      ,
        "notfound": function(context, params, route, el) {
          import('components/pages/notfound')
            .then(module => {
              context.setPage(module.default, params, route, el)
            })
            .catch(e => console.log(e))

          if (module.hot) {
            module.hot.accept('components/pages/notfound', () => {
              import('components/pages/notfound')
                .then(module => {
                  context.nextPage.setContent(module.default, params)
                  context.currentPage.setContent(module.default, params)
                })
                .catch(e => console.log(e))
            })
          }
        }
       };