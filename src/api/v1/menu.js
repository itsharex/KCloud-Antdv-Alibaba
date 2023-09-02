import request from '@/utils/request'

// 查询菜单列表
export function listMenu (data) {
  return request({
    url: '/admin/v1/menus/list',
    method: 'post',
    data: data
  })
}

// 查询菜单详细
export function getMenu (id) {
  return request({
    url: '/admin/v1/menus' + '/' + id,
    method: 'get'
  })
}

// // 查询菜单下拉树结构
// export function treeSelect () {
//   return request({
//     url: '/admin/sys/menu/api/tree',
//     method: 'get'
//   })
// }
//
// // 根据角色ID查询菜单下拉树结构
// export function roleMenuTreeSelect (roleId) {
//   return request({
//     url: '/admin/sys/menu/api/get?roleId=' + roleId,
//     method: 'get'
//   })
// }
//
// // 租户菜单
// export function tenantTreeSelect () {
//   return request({
//     url: '/admin/sys/menu/api/tenant',
//     method: 'get'
//   })
// }

// 新增菜单
export function insertMenu (data) {
  return request({
    url: '/admin/v1/menus',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu (data) {
  return request({
    url: '/admin/v1/menus',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function deleteMenu (id) {
  return request({
    url: '/admin/v1/menus' + '/' + id,
    method: 'delete'
  })
}
