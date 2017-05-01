import {router, ensure} from 'base'

router.add('home', 'home')
router.add('about', 'about')
router.add('*', 'notfound')

export default router
