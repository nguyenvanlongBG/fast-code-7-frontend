const routes = [{
        path: '',
        name: 'Home',
        component: () => import ('../layouts/DefaultLayout'),
        redirect: "index",
        children: [
            {
                path: 'index',
                name: "Index",
                component: () => import ('../views/MerchandiseView')
            }
        ]
    }]
export default routes
