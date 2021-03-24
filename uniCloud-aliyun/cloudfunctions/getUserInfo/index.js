'use strict';
const uniID = require('uni-id')

// exports.main = async function(event, context) {
// 	const {
// 		result
// 	} = uniID.wxBizDataCrypt(event)
// 	return result
// }

exports.main = async function(event, context) {
	context.PLATFORM = 'mp-weixin'
	const result = await uniID.loginByWeixin({
		code: event.code
	})
	return result
}
