import request from '@/utils/request'

/**
 *  创建新任务
 * @param payload
 * @returns {Promise<*>}
 */
export async function createWork(payload) {
  return request(`/work/createWork`, {
    method: 'POST',
    data: payload,
  })
}

/**
 *  获取员工信息
 *  @param payload
 * @returns {Promise<*>}
 */
export async function getWorker(payload) {
  return request(`/worker/get_worker?team_id=${payload.team_id}`, {
    method: 'GET',
  })
}
