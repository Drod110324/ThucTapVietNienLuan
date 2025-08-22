import Homepage from '../pages/Homepage/Homepage'
import OrderPage from '../pages/OrderPage/OrderPage'
import CartPage from '../pages/CartPage/CartPage'
import ProductPage from '../pages/ProductsPage/ProductPage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import SignupPage from '../pages/SignupPage/SignupPage'
import SigninPage from '../pages/SigninPage/SigninPage'
import TypeProductPage from '../pages/TypeProductPage/TypeProductPage'
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage'
import AccountManagePage from '../pages/AccountManage/AccountManage'
import AdminProductPage from '../pages/AdminProductPage/AdminProductPage'
import DashboardPage from '../pages/DashboardPage/DashboardPage'
export const routes = [
    {
        path: '/',
        page: Homepage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/orders',
        page: OrderPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/cart',
        page: CartPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/products',
        page: ProductPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/:type',
        page: TypeProductPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false,
        isShowFooter: false
    },
    {
        path: '/signup',
        page: SignupPage,
        isShowHeader: false,
        isShowFooter: false
    },
    {
        path: '/signin',
        page: SigninPage,
        isShowHeader: false,
        isShowFooter: false
    },
    {
        path: '/product-details',
        page: ProductDetailsPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/product-details/:id',
        page: ProductDetailsPage,
        isShowHeader: true,
        isShowFooter: true
    }
    ,
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/admin/accounts',
        page: AccountManagePage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/admin/products',
        page: AdminProductPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/dashboard',
        page: DashboardPage,
        isShowHeader: true,
        isShowFooter: true
    },
]
