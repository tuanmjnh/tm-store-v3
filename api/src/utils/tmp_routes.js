module.exports.data = [
  {
    path: '/categories',
    name: 'categories',
    meta: { title: 'category', icon: 'category' },
    component: 'fakeLayout',
    children: [
      {
        path: 'list',
        name: 'categories/list',
        meta: { title: 'list', icon: 'list', noCache: true, flag: 1 },
        component: 'categories/index'
      },
      {
        path: 'add',
        name: 'categories/add',
        meta: { title: 'add', icon: 'playlist_add' },
        component: 'categories/add'
      },
      {
        path: 'edit/:id',
        name: 'template/edit',
        meta: { title: 'edit', icon: 'edit', noCache: true, activeMenu: '/template/list' },
        hidden: true,
        component: 'users/add'
      },
      {
        path: 'trash',
        name: 'template/trash',
        meta: { title: 'trash', icon: 'delete_sweep', noCache: true, flag: 0 },
        component: 'users/index'
      }
    ]
  },
  {
    path: '/products',
    name: 'products',
    meta: { title: 'products', icon: 'perm_media' },
    component: 'fakeLayout',
    children: [
      {
        path: 'list',
        name: 'products/list',
        meta: { title: 'list', icon: 'list', noCache: true, flag: 1 },
        component: 'products/index'
      },
      {
        path: 'add',
        name: 'products/add',
        meta: { title: 'add', icon: 'playlist_add' },
        component: 'products/add'
      },
      {
        path: 'edit/:id',
        name: 'products/edit',
        meta: { title: 'edit', icon: 'edit', noCache: true, activeMenu: 'products/list' },
        hidden: true,
        component: 'products/add'
      },
      {
        path: 'trash',
        name: 'products/trash',
        meta: { title: 'trash', icon: 'delete_sweep', noCache: true, flag: 0 },
        component: 'products/index'
      }
    ]
  },
  {
    path: '/news',
    name: 'news',
    meta: { title: 'news', icon: 'library_books' },
    component: 'fakeLayout',
    children: [
      {
        path: 'list',
        name: 'news/list',
        meta: { title: 'list', icon: 'list', noCache: true, flag: 1 },
        component: 'news/index'
      },
      {
        path: 'add',
        name: 'news/add',
        meta: { title: 'add', icon: 'playlist_add' },
        component: 'news/add'
      },
      {
        path: 'edit/:id',
        name: 'news/edit',
        meta: { title: 'edit', icon: 'edit', noCache: true, activeMenu: 'news/list' },
        hidden: true,
        component: 'news/add'
      },
      {
        path: 'trash',
        name: 'news/trash',
        meta: { title: 'trash', icon: 'delete_sweep', noCache: true, flag: 0 },
        component: 'news/index'
      }
    ]
  },
  {
    path: '/manager',
    name: 'manager',
    redirect: 'noRedirect',
    meta: { title: 'manager', icon: 'security' },
    component: 'fakeLayout',
    children: [
      {
        path: 'users',
        name: 'manager/users',
        // component: () => import('@/views/users'),
        meta: { title: 'users', icon: 'account_box' },
        component: 'users/index',
        children: [
          {
            path: 'list',
            name: 'manager/users/list',
            meta: { title: 'list', hidden: false, noCache: true, flag: 1 },
            component: 'users/index'
          },
          {
            path: 'add',
            name: 'manager/users/add',
            meta: { title: 'add', hidden: false },
            component: 'users/add'
          },
          {
            path: 'edit/:id',
            name: 'manager/users/edit',
            meta: { title: 'edit', noCache: true, activeMenu: '/template/list' },
            hidden: true,
            component: 'users/add'
          },
          {
            path: 'trash',
            name: 'manager/users/trash',
            meta: { title: 'trash', noCache: true, flag: 0 },
            component: 'users/index'
          }
        ]
      },
      {
        path: 'roles',
        name: 'manager/roles',
        meta: { title: 'roles', icon: 'verified_user' },
        component: 'roles/index'
      }
    ]
  }
]
