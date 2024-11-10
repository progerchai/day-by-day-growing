import request from '@/utils/request'

/**
 *  获取团队信息
 * @param openid
 * @returns {Promise<*>}
 */
export async function getTeam({ openid }) {
  return request(`/team/get_team?openid=${openid}`, {
    method: 'GET',
  })
}

/**
 *  获取所有团队信息
 * @returns {Promise<*>}
 */
export async function getAllTeam() {
  return request(`/team/get_all_team`, {
    method: 'GET',
  })
}

/**
 *  加入团队
 * @returns {Promise<*>}
 */
export async function joinTeam(payload) {
  return request(`/team/join_team`, {
    method: 'POST',
    data: payload,
  })
}

/**
 * 获取加入团队记录
 * @param payload
 * @returns {Promise<*>}
 */
export async function getJoinRequest(payload) {
  return request(`/team/get_join_request?openid=${payload.openid}`, {
    method: 'GET',
  })
}


