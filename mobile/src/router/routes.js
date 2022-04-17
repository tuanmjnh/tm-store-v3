import fakeLayout from 'layouts/fake-layout'

export const constant = [
  {
    path: '',
    redirect: '/dashboard',
    // component: () => import('pages/dashboard')
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
    name: 'dashboard',
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
    path: '/home',
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
    path: '/profile',
    name: 'profile',
    meta: {
      title: 'profile',
      icon: 'assignment_ind',
      hidden: true,
      constant: true
    },
    component: () => import('pages/profile'),
    // redirect: '/profile/information',
    children: [
      {
        path: 'information',
        name: 'profile-information',
        meta: { title: 'information', icon: 'assignment', hidden: true, constant: true },
        component: () => import('pages/profile/information')
      },
      {
        path: 'security',
        name: 'profile-security',
        meta: { title: 'security', icon: 'security', hidden: true, constant: true },
        component: () => import('pages/profile/security')
      },
      {
        path: 'setting',
        name: 'profile-setting',
        meta: { title: 'setting', icon: 'settings', hidden: true, constant: true },
        component: () => import('pages/profile/setting')
      }
    ]
  },
  {
    path: '/notification',
    name: 'notification',
    meta: {
      title: 'notification',
      icon: 'notifications',
      hidden: true,
      constant: true
    },
    component: () => import('pages/notification')
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: 'login', icon: 'login', hidden: true, constant: true },
    component: fakeLayout
  }
]

export const dynamic = [
  // {
  //   path: '/store',
  //   name: 'store',
  //   // redirect: '/store/warehouse',
  //   meta: { title: 'store', icon: 'store' },
  //   // component: fakeLayout,
  //   component: () => import('pages/store'),
  //   children: [
  //     {
  //       path: 'warehouse',
  //       name: 'store-warehouse',
  //       meta: { title: 'data', icon: 'home_work', parent: 'store', component: 'pages/store/index' },
  //       component: () => import('pages/store/index')
  //     },
  //     {
  //       path: 'report',
  //       name: 'store-report',
  //       meta: { title: 'report', icon: 'pie_chart', parent: 'store', component: 'pages/store/report' },
  //       component: () => import('pages/store/report')
  //     },
  //     {
  //       path: 'import-list',
  //       name: 'store-import-list',
  //       meta: { title: 'importList', icon: 'playlist_add_check', parent: 'store', component: 'pages/store/import-list' },
  //       component: () => import('pages/store/import-list')
  //     },
  //     {
  //       path: 'import',
  //       name: 'store-import',
  //       meta: { title: 'import', icon: 'addchart', parent: 'store', component: 'pages/store/import' },
  //       component: () => import('pages/store/import')
  //     },
  //     {
  //       path: 'export-list',
  //       name: 'store-export-list',
  //       meta: { title: 'exportList', icon: 'playlist_play', parent: 'store', component: 'pages/store/export-list' },
  //       component: () => import('pages/store/export-list')
  //     },
  //     {
  //       path: 'export',
  //       name: 'store-export',
  //       meta: { title: 'export', icon: 'double_arrow', parent: 'store', component: 'pages/store/export' },
  //       component: () => import('pages/store/export')
  //     }
  //   ]
  // },
  {
    path: '/warehouse',
    name: 'warehouse',
    meta: { title: 'warehouse', icon: 'store' },
    component: fakeLayout,
    redirect: '/warehouse/data',
    // component: () => import('pages/warehouse/index'),
    children: [
      {
        path: 'data',
        name: 'warehouse-data',
        meta: { title: 'data', icon: 'home_work', hidden: true, parent: 'warehouse', component: 'pages/warehouse/index' },
        component: () => import('pages/warehouse/index')
      },
      {
        path: 'report',
        name: 'warehouse-report',
        meta: { title: 'report', icon: 'pie_chart', hidden: true, parent: 'warehouse', component: 'pages/reports/index' },
        component: () => import('pages/reports/index')
      },
      {
        path: 'import',
        name: 'import',
        meta: { title: 'import', icon: 'playlist_add_check', dialog: true, parent: 'warehouse', component: 'pages/imports/index' },
        // component: () => import('pages/import/index'),
        component: fakeLayout,
        redirect: '/warehouse/import/list',
        children: [
          {
            path: 'list',
            name: 'import-list',
            meta: { title: 'list', icon: 'playlist_add_check', hidden: true, noCache: true, flag: 1, parent: 'import' },
            component: () => import('pages/imports/index')
          },
          {
            path: 'add',
            name: 'import-add',
            meta: { title: 'add', icon: 'addchart', hidden: true, parent: 'import' },
            component: () => import('pages/imports/add')
          },
          {
            path: 'edit',
            name: 'import-edit',
            meta: { title: 'edit', icon: 'edit', hidden: true, parent: 'import' },
            component: () => import('pages/imports/add')
          }
        ]
      },
      {
        path: 'export',
        name: 'export',
        meta: { title: 'export', icon: 'playlist_play', dialog: true, parent: 'warehouse', component: 'pages/exports/index' },
        // component: () => import('pages/store/export-list')
        component: fakeLayout,
        redirect: '/warehouse/export/list',
        children: [
          {
            path: 'list',
            name: 'export-list',
            meta: { title: 'list', icon: 'playlist_play', hidden: true, noCache: true, flag: 1, parent: 'export' },
            component: () => import('pages/exports/index')
          },
          {
            path: 'add',
            name: 'export-add',
            meta: { title: 'add', icon: 'double_arrow', hidden: true, parent: 'export' },
            component: () => import('pages/exports/add')
          },
          {
            path: 'edit',
            name: 'export-edit',
            meta: { title: 'edit', icon: 'edit', hidden: true, parent: 'import' },
            component: () => import('pages/exports/add')
          }
        ]
      }
    ]
  },
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
        meta: { title: 'list', icon: 'collections', color: "", dialog: true, parent: 'product', component: 'pages/products/index' },
        component: fakeLayout,
        redirect: '/product/list/view',
        // component: () => import('pages/products/index'),
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
        meta: { title: 'category', icon: 'category', type: 'product', dialog: true, parent: 'product', component: 'pages/category/index' },
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
      }
    ]
  },
  {
    path: '/orders',
    name: 'orders',
    meta: { title: 'orders', icon: 'class', hidden: true, component: 'pages/orders/index' },
    redirect: '/orders/view',
    component: fakeLayout,
    // component: () => import('pages/orders/index'),
    children: [
      {
        path: 'view',
        name: 'orders-view',
        meta: {
          title: 'view',
          icon: 'list',
          hidden: false,
          noCache: true,
          flag: 1,
          parent: 'orders',
          component: 'pages/orders/index'
        },
        component: () => import('pages/orders/index')
      },
      {
        path: 'add',
        name: 'orders-add',
        meta: {
          title: 'add',
          icon: 'add',
          hidden: false,
          parent: 'orders',
          component: 'pages/orders/add'
        },
        component: () => import('pages/orders/add')
      },
      {
        path: 'edit/:id?',
        name: 'orders-edit',
        meta: {
          title: 'edit',
          icon: 'edit',
          hidden: true,
          noCache: true,
          activeMenu: '/orders/view',
          parent: 'orders'
        },
        component: () => import('pages/orders/add')
      },
      {
        path: 'trash',
        name: 'orders-trash',
        meta: {
          title: 'trash',
          icon: 'delete',
          hidden: true,
          noCache: true,
          flag: 0,
          parent: 'orders'
        },
        component: () => import('pages/orders/index')
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
        meta: { title: 'list', icon: 'collections_bookmark', dialog: true, parent: 'news', component: 'pages/news/index' },
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
        meta: { title: 'category', icon: 'category', type: 'news', dialog: true, parent: 'news', component: 'pages/category/index' },
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
    path: '/manager',
    name: 'manager',
    redirect: '/manager/users/view',
    meta: { title: 'manager', icon: 'security' },
    component: fakeLayout,
    children: [
      {
        path: 'users',
        name: 'manager-users',
        meta: { title: 'users', icon: 'account_box', dialog: true, parent: 'manager', component: 'pages/users/index' },
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
        meta: { title: 'roles', icon: 'verified_user', dialog: true, parent: 'manager', component: 'pages/roles/index' },
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
        meta: { title: 'types', icon: 'scatter_plot', dialog: true, parent: 'manager', component: 'pages/types/index' },
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
      },
      {
        path: 'configs',
        name: 'manager-configs',
        meta: { title: 'configs', icon: 'settings', dialog: true, parent: 'manager', component: 'pages/configs/index' },
        component: fakeLayout,
        redirect: '/manager/configs/view',
        children: [
          {
            path: 'view',
            name: 'manager-configs-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1,
              parent: 'manager-configs'
            },
            component: () => import('pages/configs/index')
          },
          {
            path: 'add',
            name: 'manager-configs-add',
            meta: {
              title: 'add',
              icon: 'add',
              hidden: true,
              parent: 'manager-configs'
            },
            component: () => import('pages/configs/add')
          },
          {
            path: 'edit/:id?',
            name: 'manager-configs-edit',
            props: true,
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/configs/view',
              parent: 'manager-configs'
            },
            component: () => import('pages/configs/add')
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
            name: 'manager-configs-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0,
              parent: 'manager-configs'
            },
            component: () => import('pages/configs/index')
          }
        ]
      }
    ]
  }
]

export const exception = []
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  constant.push({
    path: '/:catchAll(.*)*',
    name: '404',
    constant: true,
    meta: { title: 'error404', icon: '404', hidden: true },
    component: () => import('pages/error/error404')
  })
}

// export default constant
