import fakeLayout from 'layouts/fake-layout';

export const constant = [
  {
    path: '',
    component: () => import('pages/dashboard')
    // children: [
    // {
    //   path: '',
    //   name: 'dashboard',
    //   meta: { title: 'dashboard', icon: 'dashboard', constant: true },
    //   component: () => import('pages/dashboard')
    // }
    // ]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout')
    // children: [
    // {
    //   path: '',
    //   name: 'dashboard',
    //   meta: { title: 'dashboard', icon: 'dashboard', constant: true },
    //   component: () => import('pages/dashboard')
    // }
    // ]
  }
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   meta: {
  //     title: 'profile',
  //     icon: 'assignment_ind',
  //     hidden: true,
  //     constant: true
  //   },
  //   component: () => import('@/views/profile'),
  //   children: [
  //     {
  //       path: 'information',
  //       name: 'profile-information',
  //       meta: { title: 'information', icon: 'assignment', constant: true },
  //       component: () => import('@/views/profile/information')
  //     },
  //     {
  //       path: 'security',
  //       name: 'profile-security',
  //       meta: { title: 'security', icon: 'security', constant: true },
  //       component: () => import('@/views/profile/security')
  //     },
  //     {
  //       path: 'setting',
  //       name: 'profile-setting',
  //       meta: { title: 'userSetting', icon: 'settings', constant: true },
  //       component: () => import('@/views/profile/setting')
  //     }
  //   ]
  // },
  // {
  //   path: '/login',
  //   name: 'login',
  //   meta: { title: 'login', icon: 'login', hidden: true, constant: true },
  //   component: () => import('pages/login')
  // }
];

export const dynamic = [
  {
    path: '/product',
    name: 'product',
    redirect: '/product/list/view',
    meta: { title: 'product', icon: 'perm_media' },
    component: fakeLayout,
    children: [
      {
        path: 'list',
        name: 'product-list',
        meta: { title: 'list', icon: 'collections', parent: 'product' },
        component: fakeLayout,
        redirect: '/product/list/view',
        children: [
          {
            path: 'view',
            name: 'product-list-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1,
              parent: 'product-list'
            },
            component: () => import('pages/products/index')
          },
          {
            path: 'add',
            name: 'product-list-add',
            meta: {
              title: 'add',
              icon: 'add',
              hidden: true,
              parent: 'product-list'
            },
            component: () => import('pages/products/add')
          },
          {
            path: 'edit/:id?',
            name: 'product-list-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/product-list/view',
              parent: 'product-list'
            },
            component: () => import('pages/products/add')
          },
          {
            path: 'trash',
            name: 'product-list-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0,
              parent: 'product-list'
            },
            component: () => import('pages/products/index')
          }
        ]
      },
      {
        path: 'category',
        name: 'category-product',
        meta: { title: 'category', icon: 'category', type: 'product', parent: 'product' },
        component: fakeLayout,
        redirect: '/product/category/view',
        children: [
          {
            path: 'view',
            name: 'category-product-view',
            meta: {
              title: 'view',
              icon: 'list',
              type: 'product',
              hidden: true,
              noCache: true,
              flag: 1,
              parent: 'category-product'
            },
            component: () => import('pages/category/index')
          },
          {
            path: 'add',
            name: 'category-product-add',
            meta: {
              title: 'add',
              icon: 'add',
              type: 'product',
              hidden: true,
              parent: 'category-product'
            },
            component: () => import('pages/category/add')
          },
          {
            path: 'edit/:id?',
            name: 'category-product-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              type: 'product',
              hidden: true,
              noCache: true,
              activeMenu: '/category-product/view',
              parent: 'category-product'
            },
            component: () => import('pages/category/add')
          },
          {
            path: 'trash',
            name: 'category-product-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              type: 'product',
              hidden: true,
              noCache: true,
              flag: 0,
              parent: 'category-product'
            },
            component: () => import('pages/category/index')
          }
        ]
      },
      {
        path: 'orders',
        name: 'product-orders',
        meta: { title: 'orders', icon: 'class', parent: 'product' },
        component: fakeLayout,
        redirect: '/product/orders/view',
        children: [
          {
            path: 'view',
            name: 'product-orders-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1,
              parent: 'product-orders'
            },
            component: () => import('pages/orders/index')
          },
          {
            path: 'add',
            name: 'product-orders-add',
            meta: {
              title: 'add',
              icon: 'add',
              hidden: true,
              parent: 'product-orders'
            },
            component: () => import('pages/orders/add')
          },
          {
            path: 'edit/:id?',
            name: 'product-orders-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/product-orders/view',
              parent: 'product-orders'
            },
            component: () => import('pages/orders/add')
          },
          {
            path: 'trash',
            name: 'product-orders-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0,
              parent: 'product-orders'
            },
            component: () => import('pages/orders/index')
          }
        ]
      }
    ]
  },
  {
    path: '/news',
    name: 'news',
    redirect: 'news-list',
    meta: { title: 'news', icon: 'library_books' },
    component: fakeLayout,
    children: [
      {
        path: 'list',
        name: 'news-list',
        meta: { title: 'list', icon: 'collections_bookmark', parent: 'news' },
        component: fakeLayout,
        redirect: '/news/list/view',
        children: [
          {
            path: 'view',
            name: 'news-list-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1,
              parent: 'news-list'
            },
            component: () => import('pages/news/index')
          },
          {
            path: 'add',
            name: 'news-list-add',
            meta: {
              title: 'add',
              icon: 'add',
              hidden: true,
              parent: 'news-list'
            },
            component: () => import('pages/news/add')
          },
          {
            path: 'edit/:id?',
            name: 'news-list-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/news-list/view',
              parent: 'news-list'
            },
            component: () => import('pages/news/add')
          },
          {
            path: 'trash',
            name: 'news-list-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0,
              parent: 'news-list'
            },
            component: () => import('pages/news/index')
          }
        ]
      },
      {
        path: 'category',
        name: 'category-news',
        meta: { title: 'category', icon: 'category', type: 'news', parent: 'news' },
        component: fakeLayout,
        redirect: '/news/category/view',
        children: [
          {
            path: 'view',
            name: 'category-news-view',
            meta: {
              title: 'view',
              icon: 'list',
              type: 'news',
              hidden: true,
              noCache: true,
              flag: 1,
              parent: 'category-news'
            },
            component: () => import('pages/category/index')
          },
          {
            path: 'add',
            name: 'category-news-add',
            meta: {
              title: 'add',
              icon: 'add',
              type: 'news',
              hidden: true,
              parent: 'category-news'
            },
            component: () => import('pages/category/add')
          },
          {
            path: 'edit/:id?',
            name: 'category-news-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              type: 'news',
              hidden: true,
              noCache: true,
              activeMenu: '/category-news/view',
              parent: 'category-news'
            },
            component: () => import('pages/category/add')
          },
          {
            path: 'trash',
            name: 'category-news-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              type: 'news',
              hidden: true,
              noCache: true,
              flag: 0,
              parent: 'category-news'
            },
            component: () => import('pages/category/index')
          }
        ]
      }
    ]
  },
  {
    path: '/store',
    name: 'store',
    redirect: '/store/warehouse',
    meta: { title: 'store', icon: 'store' },
    component: fakeLayout,
    children: [
      {
        path: 'warehouse',
        name: 'store-warehouse',
        meta: { title: 'data', icon: 'home_work', parent: 'store' },
        component: () => import('pages/store/index')
      },
      {
        path: 'report',
        name: 'store-report',
        meta: { title: 'report', icon: 'pie_chart', parent: 'store' },
        component: () => import('pages/store/report')
      },
      {
        path: 'import-list',
        name: 'store-import-list',
        meta: { title: 'importList', icon: 'playlist_add_check', parent: 'store' },
        component: () => import('pages/store/import-list')
      },
      {
        path: 'import',
        name: 'store-import',
        meta: { title: 'import', icon: 'playlist_add', parent: 'store' },
        component: () => import('pages/store/import')
      },
      {
        path: 'export-list',
        name: 'store-export-list',
        meta: { title: 'exportList', icon: 'playlist_remove', parent: 'store' },
        component: () => import('pages/store/export-list')
      },
      {
        path: 'export',
        name: 'store-export',
        meta: { title: 'export', icon: 'double_arrow', parent: 'store' },
        component: () => import('pages/store/export')
      }
    ]
  },
  {
    path: '/manager',
    name: 'manager',
    redirect: '/manager/users/view',
    meta: { title: 'manager', icon: 'security' },
    component: fakeLayout,
    children: [
      {
        path: 'users',
        name: 'manager-users',
        meta: { title: 'users', icon: 'account_box', parent: 'manager' },
        component: fakeLayout,
        redirect: '/manager/users/view',
        children: [
          {
            path: 'view',
            name: 'manager-users-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1,
              parent: 'manager-users'
            },
            component: () => import('pages/users/index')
          },
          {
            path: 'add',
            name: 'manager-users-add',
            meta: {
              title: 'add',
              icon: 'add',
              hidden: true,
              parent: 'manager-users'
            },
            component: () => import('pages/users/add')
          },
          {
            path: 'edit/:id?',
            name: 'manager-users-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/users/view',
              parent: 'manager-users'
            },
            component: () => import('pages/users/add')
          },
          {
            path: 'trash',
            name: 'manager-users-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0,
              parent: 'manager-users'
            },
            component: () => import('pages/users/index')
          },
          {
            path: 'import',
            name: 'manager-users-import',
            meta: {
              title: 'import',
              icon: 'cloud_upload',
              hidden: true,
              noCache: true,
              flag: 0,
              parent: 'manager-users'
            },
            component: () => import('pages/users/import')
          }
        ]
      },
      {
        path: 'roles',
        name: 'manager-roles',
        meta: { title: 'roles', icon: 'verified_user', parent: 'manager' },
        component: fakeLayout,
        redirect: '/manager/roles/view',
        children: [
          {
            path: 'view',
            name: 'manager-roles-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1,
              parent: 'manager-roles'
            },
            component: () => import('pages/roles/index')
          },
          {
            path: 'add',
            name: 'manager-roles-add',
            meta: {
              title: 'add',
              icon: 'add',
              hidden: true,
              parent: 'manager-roles'
            },
            component: () => import('pages/roles/add')
          },
          {
            path: 'edit/:id?',
            name: 'manager-roles-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/roles/view',
              parent: 'manager-roles'
            },
            component: () => import('pages/roles/add')
          },
          {
            path: 'trash',
            name: 'manager-roles-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0,
              parent: 'manager-roles'
            },
            component: () => import('pages/roles/index')
          }
        ]
      },
      {
        path: 'types',
        name: 'manager-types',
        meta: { title: 'types', icon: 'scatter_plot', parent: 'manager' },
        component: fakeLayout,
        redirect: '/manager/types/view',
        children: [
          {
            path: 'view',
            name: 'manager-types-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1,
              parent: 'manager-types'
            },
            component: () => import('pages/types/index')
          },
          {
            path: 'add',
            name: 'manager-types-add',
            meta: {
              title: 'add',
              icon: 'add',
              hidden: true,
              parent: 'manager-types'
            },
            component: () => import('pages/types/add')
          },
          {
            path: 'edit/:id?',
            name: 'manager-types-edit',
            props: true,
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/types/view',
              parent: 'manager-types'
            },
            component: () => import('pages/types/add')
            // beforeEnter: (to, from, next) => {
            //   if (to.redirectedFrom) {
            //     to.query = to.redirectedFrom.query
            //     to.href = to.redirectedFrom.href
            //     to.fullPath = to.redirectedFrom.fullPath
            //   }
            //   next()
            // }
          },
          {
            path: 'trash',
            name: 'manager-types-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0,
              parent: 'manager-types'
            },
            component: () => import('pages/types/index')
          }
        ]
      }
      // {
      //   path: 'table',
      //   name: 'manager-table',
      //   meta: { title: 'table', icon: 'scatter_plot' },
      //   component: () => import('pages/types/table')
      // }
    ]
  }
];

export const exception = [];
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  constant.push({
    path: '/:catchAll(.*)*',
    name: '404',
    constant: true,
    meta: { title: 'error404', icon: '404', hidden: true },
    component: () => import('pages/error/error404')
  });
}

// export default constant
