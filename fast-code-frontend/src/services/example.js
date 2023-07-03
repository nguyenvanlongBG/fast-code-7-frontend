import request from '../utils/request'
export function getMerchandises() {

    return request({url: '/Merchandise/filter', method: "get"})
}
