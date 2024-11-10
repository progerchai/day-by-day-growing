import request from '@/utils/request'

/**
 *  获取单个任务信息
 * @param _id 任务_id
 * @returns {Promise<*>}
 */
export async function getWorkDetail({ _id }) {
  return request(`/work/get_work_detail?_id=${_id}`, {
    method: 'GET',
  })
}

/**
 *  获取用户所有任务信息
 * @param openid
 * @returns {Promise<*>}
 */
export async function getWorks({ openid }) {
  return request(`/work/get_works?openid=${openid}`, {
    method: 'GET',
  })
}
