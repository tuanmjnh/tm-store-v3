// import path from 'path'
// const path = require('path')
// import { i18n } from '../boot/i18n'
// import routes from './routes'

export const ticked = []
export function onlyOneShowingChild (children = [], dependent) {
  let onlyOneChild = null
  const showingChildren = children.filter(item => !item.hidden)

  // When there is only one child route, the child route is displayed by default
  if (showingChildren.length === 1) {
    onlyOneChild = showingChildren[0]
    onlyOneChild.path = path.resolve(dependent.path, onlyOneChild.path)
    return onlyOneChild
  }

  // Show dependent if there are no child route to display
  if (showingChildren.length === 0) {
    onlyOneChild = { ...dependent, path: '', noShowingChildren: true }
    return onlyOneChild
  }

  return false
}

export function Get (nodes, basePath = '/') {
  const res = []
  // this.ticked = []
  for (let node of nodes) {
    // skip some route
    if (node.hidden && node.constant) {
      continue
    }
    if (node.constant && ticked.indexOf(node.name) < 0) ticked.push(node.name)

    const onlyOneShowingChild = this.onlyOneShowingChild(node.children, node)
    if (node.children && onlyOneShowingChild && !node.alwaysShow) {
      node = onlyOneShowingChild
    }

    const data = {
      path: node.path, // path.resolve(basePath, route.path),
      label: node.label,// i18n.t(`route.${node.label}`),
      name: node.name,
      icon: node.icon,
      disabled: node.disabled || false
    }
    // recursive child nodes
    if (node.children) {
      data.children = this.Get(node.children, data.path)
    }
    res.push(data)
    // if (route.constant) this.ticked.push(route.name)
  }
  return res
}

export async function generateRoutes (nodes, dependent = null) {
  const rs = []
  try {
    const childrens = nodes.filter(x => x.dependent !== null)
    for await (const e of nodes) {
      // nodes.forEach(async e => {
      if (e.dependent === dependent) {
        if (e.meta.length) {
          for await (const x of e.meta) {
            if (x.key === 'title') e.label = x.value// i18n.t(`route.${x.value}`)
            if (x.key === 'icon') e.icon = x.value
            if (x.key === 'hidden') e.hidden = x.value
          }
        }
        if (!e.label) e.label = e.name
        // const title = e.meta.find(x => x.key === 'title')
        // if (title) e.label = title.value ? i18n.t(`route.${title.value}`) : e.name
        // e.label = e.meta && e.meta.title ? i18n.t(`route.${e.meta.title}`) : e.name
        const child = await generateRoutes(childrens, e._id.toString())
        if (child.length > 0) e.children = child
        rs.push(e)
      }
    }
  } catch (e) {
    // console.log(e)
  }
  return rs
}

export function generateRoutesRoles (nodes) {
  const rs = []
  try {
    nodes.forEach(_e => {
      const e = { ..._e }
      if (!e.constant) {
        e.label = e.meta.title// i18n.t(`route.${e.meta.title}`)
        e.icon = e.meta.icon
        if (e.children) {
          const child = generateRoutesRoles(e.children)
          if (child.length > 0) e.children = child
        }
        // console.log(e)
        rs.push(e)
      }
    })
  } catch (e) {
    // console.log(e)
  }
  return rs
}

export function generateCategory (nodes, dependent = null) {
  const rs = []
  try {
    const childrens = nodes.filter(x => x.dependent !== null)
    nodes.forEach(e => {
      if (e.dependent === dependent) {
        e.label = e.meta && e.meta.label ? e.meta.label : e.title //i18n.t(`category.${e.meta.label}`)
        e.ticked = false
        const child = generateCategory(childrens, e._id)
        if (child.length > 0) e.children = child
        else e.children = []
        rs.push(e)
      }
    })
  } catch (e) {
    // console.log(e)
  }
  return rs
}

export function findNode (nodes, nodeId, nodeKey = 'id') {
  try {
    for (const e of nodes) {
      if (!nodeId) {
        if (e[nodeKey] === nodeId) return e
      } else {
        if (e[nodeKey] === nodeId) return e
      }
      if (e.children && e.children.length) {
        const child = findNode(e.children, nodeId, nodeKey)
        if (child) return child
      }
    }
  } catch (e) {
    // console.log(e)
  }
}

export function findNodes (nodes, nodeId, nodeKey = 'id') {
  let rs = []
  try {
    nodes.forEach(e => {
      if (nodeId.includes(e[nodeKey])) rs.push(e)

      if (e.children && e.children.length) {
        const child = findNode(e.children, nodeId, nodeKey)
        if (child.length) rs = [...rs, ...child]
      }
    })
  } catch (e) {
    // console.log(e)
  }
  // console.log(rs)
  return rs
}

export function findNodesIfExist (nodes, nodeIds, nodeKey = 'id') {
  let rs = []
  // console.log(nodeIds)
  try {
    nodes.forEach(e => {
      if (nodeIds.includes(e[nodeKey])) rs.push(e[nodeKey])

      if (e.children && e.children.length) {
        const child = findNodesIfExist(e.children, nodeIds, nodeKey)
        if (child.length) rs = [...rs, ...child]
      }
    })
  } catch (e) {
    // console.log(e)
  }
  // console.log(rs)
  return rs
}

export function getParent (nodes, node, nodeKey = 'id') {
  // console.log(nodes)
  // console.log(node)
  // console.log(nodeKey)
  let rs = []
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i][nodeKey] === node[nodeKey]) {
      rs.push(nodes[i])
      break;
    }
    else {
      if (nodes[i].children) {
        const child = getParent(nodes[i].children, node, nodeKey)
        if (child && child.length) {
          rs.push(nodes[i])
          rs = rs.concat(child)
        }
      }
    }
  }
  // nodes.forEach(e => {
  //   if (e[nodeKey] === node[nodeKey]) rs.push(e)
  //   else {
  //     if (e.children) {
  //       const child = getParent(e.children, node, nodeKey)
  //       if (child && child.length) rs.concat(child)
  //     }
  //   }
  // })
  return rs
  // nodes.some(function (n) {
  //   if (n.children) return getParent(n.children, node, nodeKey)
  // }) || null
}

// function getParent(root, id) {
//   var i, node
//   for (var i = 0 i < root.length i++) {
//     node = root[i]
//     if (node.id === id || node.children && (node = getParent(node.children, id))) {
//       return node
//     }
//   }
//   return null
// }

// var mytree = [{ id: 245, parent: '0', title: 'project1', children: [{ id: 246, parent: '245', title: 'sub task 1' }] }, { id: 238, parent: '0', title: 'project2', children: [{ id: 240, parent: '238', title: 'sub task 2' }, { id: 242, parent: '238', title: 'sub task 3', children: [{ id: 241, parent: '242', title: 'sub task 3.1' }] }] }, { id: 173, parent: '0', title: 'project3' }]

// console.log(getParent(mytree, 238))
// // console.log(getParent(mytree, 241))
