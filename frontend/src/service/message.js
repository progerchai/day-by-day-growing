import request from '@/utils/request'

/**
 *  获取信息
 *  @param payload
 * @returns {Promise<*>}
 */
export async function updateMessage(payload) {
  return request(`/message/update_message`, {
    method: 'POST',
    data: payload,
  })
}
