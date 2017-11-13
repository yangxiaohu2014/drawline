const defaultZero = 1e-6 //小于此值认为是零值
const maxDisError = 1.5 //最大距离误差
const maxAngleError = 1.5 //最大角度误差
const PI = Math.PI
const sqrt = Math.sqrt
const pow = Math.pow
const abs = Math.abs
const acos = Math.acos

/**
 * [model 求向量模]
 * @param  {Array}  vector [向量]
 * @return {[num]}        [向量模即长度]
 */
function model(vector = []) {
	return sqrt(pow(vector[0], 2) + pow(vector[1], 2))
}

/**
 * [vector 通过点求向量]
 * @param  {Array}  points [两个点坐标]
 * @return {[Array]}       [向量]
 */
function vector(point1 = [], point2 = []) {
	let points = point1.concat(point2)

	return [points[2] - points[0], points[3] - points[1]]
}

/**
 * [disOfPoint2Line 点到直线具体]
 * @param  {Array}  linePoints [直线上的两点]
 * @param  {Array}  point      [直线外的点]
 *  例如：直线上两点A(x1, y1), B(x2, y2)
 *  直线外的点C(x3, y3)，则
 *  linePoints[x1, y1, x2, y2]
 *  point[x3, y3]
 * @return {[num]}        [距离]
 * @theory [向量运算]
 *   d = (AB x AC)/|AB|
 *   AB x AC = (x2 - x1) * (y3 -y1) - (y2 - y1) * (x3 - x2)
 */
export function disOfPoint2Line(points = []) {
	if (points.length < 6) return 0

	let AB = [points[2] - points[0], points[3] - points[1]]
	let AC = [points[4] - points[0], points[5] - points[1]]
	let ABxAC = abs(AB[0] * AC[1] - AB[1] * AC[0])

	if (abs(AB[0]) <= defaultZero && abs(AB[1]) <= defaultZero) {
		return sqrt(AC[0] * AC[0] + AC[1] * AC[1])
	} else {
		return ABxAC / model(AB)
	}
}

/**
 * [angleOfLines 两向量夹角]
 * @param  {Array}  points [确定两条直线的三个点]
 * @return {[num]}        [夹角]
 */
export function angleOfLines(points = []) {
	if (points.length !== 6 && points.length !== 8) return 0

	let AB = [points[2] - points[0], points[3] - points[1]]
	let BC = points.length === 6 ? [points[4] - points[2], points[5] - points[3]] :
			[points[6] - points[4], points[7] - points[5]]
	let ABDotBC = AB[0] * BC[0] + AB[1] * BC[1]
	let ABBC = model(AB) * model(BC)

	if (ABBC < defaultZero) {
		return 0 //视为夹角为零
	} else {
		return acos(ABDotBC / ABBC) / PI * 180
	}
}

export function filterPoints(points = [], opts = {errorType: 'angle'}) {
	let p = points.slice(0)
	let reservedPoints = p.splice(0, 2)
	// 返回true过滤，否则保留
	let test = function(points = [], opts) {
		if (opts.errorType === 'angle') {
			return abs(angleOfLines(points)) < opts.maxAngleError
		} else if (opts.errorType === 'dis') {
			return disOfPoint2Line(points) < opts.maxDisError
		}
	}

	let secondPoint = p.splice(0, 2)

	opts.maxDisError = opts.maxDisError || maxDisError
	opts.maxAngleError = opts.maxAngleError || maxAngleError

	while(p.length && model(vector(reservedPoints, secondPoint)) < opts.maxDisError) {
		secondPoint = p.splice(0, 2)
	}

	reservedPoints.push(...secondPoint)

	if (p.length < 2) {
		return reservedPoints
	}

	p = reservedPoints.concat(p)

	for (let i = 4, len = p.length; i < len - 2; i += 2) {
		let flag = 1

		if (opts.errorType === 'angle') {
			if (!test(p.slice(i - 2, i + 4), {...opts, errorType: 'angle'}) ||
				!test([...reservedPoints.slice(-4), ...p.slice(i, i + 4)], {...opts, errorType: 'angle'})){
				flag = 0
			}
		} else if (opts.errorType === 'dis') {
			if (!test([...reservedPoints.slice(-4), p[i], p[i + 1]], {...opts, errorType: 'dis'})) {
				flag = 0
			}
		} else if (opts.errorType === 'both') {
			if (!test([...reservedPoints.slice(-4), p[i], p[i + 1]], {...opts, errorType: 'dis'}) ||
				!test(p.slice(i - 2, i + 4), {...opts, errorType: 'angle'}) ||
				!test([...reservedPoints.slice(-4), ...p.slice(i, i + 4)], {...opts, errorType: 'angle'})) {
				flag = 0
			}
		}

		if (flag === 0) {
			reservedPoints.push(p[i], p[i + 1])
		} else {
			reservedPoints.splice(-2, 2, p[i], p[i + 1])
		}
	}

	if (model(vector(reservedPoints.slice(-2), p.slice(-2))) > opts.maxDisError) {
		reservedPoints.push(...p.slice(-2))
	}

	console.log('start=======================')
	console.log('origin points ', p.length, p)
	console.log('filtered points ', reservedPoints.length, reservedPoints)
	console.log('end=======================')
	return reservedPoints
}

export function points2Path(points = []) {
	let path = `M${points[0]} ${points[1]}`

	for (let i = 2, len = points.length; i < len; i += 2) {
		path += `L${points[i]} ${points[i + 1]}`
	}

	return path
}

