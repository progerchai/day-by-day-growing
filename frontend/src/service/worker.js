import request from '@/utils/request'

/**
 *  更新工作人员信息
 * @param payload
 * @returns {Promise<*>}
 */
export async function updateWorker(payload) {
  return request(`/worker/update_worker`, {
    method: 'POST',
    data: payload,
  })
}

/**
 *  更新工作人员信息
 * @param {openid}
 * @returns {Promise<*>}
 */
export async function getWorkerInfo({ openid }) {
  return request(`/worker/get_worker_info?openid=${openid}`, {
    method: 'GET',
  })
}
