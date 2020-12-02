import router from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
    try {

      // hack method to ensure that addRoutes is complete
      // set the replace: true, so the navigation will not leave a history record
      next({ ...to, replace: true })
      NProgress.done()
    } catch (error) {
      Message.error(error || 'Has Error')
      NProgress.done()
    }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
