const Home=(resolve) => {
    import('./components/home').then((module) => {
        resolve(module)
    })
}
const Onceout=(resolve) => {
    import('./components/onceout').then((module) => {
        resolve(module)
    })
}
const Infosubmit=(resolve) => {
    import('./components/infosubmit').then((module) => {
        resolve(module)
    })
}
const routes = [
    { path: '/', name: 'home', component: Home, meta: { title: '物料出库' }},
    { path: '/onceout', name: 'onceout', component: Onceout, meta: { title: '直接出库' }},
    { path: '/infosubmit', name: 'infosubmit', component: Infosubmit, meta: { title: '物料出库' }},
]

const router = new VueRouter({
    routes: routes
})
router.beforeEach((to, from, next) => {
    next();
})


export default router