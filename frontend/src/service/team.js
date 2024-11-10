import request from '@/utils/request'

/**
 *  获取团队成员
 * @param {openid}
 * @returns {Promise<*>}
 */
export async function getWorkers({ openid }) {
  return request(`/team/get_workers?openid=${openid}`, {
    method: 'GET',
  })
}
