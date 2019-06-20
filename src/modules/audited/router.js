const Home=(resolve) => {
    import('./components/home').then((module) => {
        resolve(module)
    })
}


const routes = [
    { path: '/', name: 'home', component: Home, meta: { title: '物料申购' }},
]

const router = new VueRouter({
    routes: routes
})
router.beforeEach((to, from, next) => {
    next();
})


export default router