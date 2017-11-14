import {flattenDeep} from 'lodash'
import {defaultZero, maxDisError, maxAngleError, minAngleError} from './config'
import {angleOfLines, disOfPoint2Line, mirrorPoint} from './util'
import * as _v from './vector'

const PI = Math.PI
const sqrt = Math.sqrt
const pow = Math.pow
const abs = Math.abs
const acos = Math.acos

/**
 * [getControlPoint 获取控制点]
 * @param  {[Array]} p1(x1, y1) [起点]
 * @param  {[Array]} p2(x2, y2) [中间某点]
 * @param  {[Array]} p3(x3, y3) [终点]
 * @return {[Array]}    [控制点]
 * @theory [向量运算]
 *   V1 = _v.vector(P1, P2) = (x2 - x1, y2 - y1)
 *   V2 = _v.vector(P2, P3) = (x3 - x2, y3 - y2)
 *   M1 = _v.model(V1)
 *   M2 = _v.model(V2)
 *
 * 	 Vc = Pc = P2 + a*(unitV21 + unitV23)
 * 	 a = -0.5*sqrt(M1 * M2)
 * 	 unitV21 = _v.scale(V1, -1/M1)
 * 	 unitV23 = _v.scale(V2, 1/M2)
 *
 *   Pc = P2 + 0.5*sqrt(|P2 - P1||P2 - P3|)[(P2 - P1)/|P2 - P1| + (P2 - P3)/|P2 - P3|]
 */
export function getControlPointByThreePoints(...points) {
	points = flattenDeep(points)

	let p1 = points.splice(0, 2)
	let p2 = points.splice(0, 2)
	let p3 = points.splice(0, 2)
	let v12 = _v.vector(p1, p2)
	let v32 = _v.vector(p3, p2)
	let m12 = _v.model(v12)
	let m32 = _v.model(v32)
	let ratio = 0.5 * sqrt(m12 * m32)
	let v1232 = _v.add(_v.unit(v12), _v.unit(v32))
	let rP = m12 <= defaultZero ? p1 : 
		m32 <= defaultZero ? p3 :
		_v.add(p2, _v.scale(v1232, ratio))
	
	return [+rP[0].toFixed(0), +rP[1].toFixed(0)]
}

/**
 * [fit 根据有序的散点拟合二次贝塞尔曲线]
 * @param  {[Array]} points [散点集合]
 * @return {[string]}        [路径字符串]
 */
export function fit(points = []) {
	let p = flattenDeep(points)
	let path = `M${p[0]} ${p[1]}`
	let append = function(p1 = [], p2 = []) {
		p1 = p1.concat(p2)
		path += `Q${p1[0]} ${p1[1]}, ${p1[2]} ${p1[3]}`
	}

	if (p.length < 4) {
		return path
	}

	if (p.length < 6) {
		append(p.slice(0, 4))
		return path
	}

	for (let i = 5, len = p.length; i < len; i += 4) {
		let Pc = getControlPointByThreePoints(p.slice(i - 5, i + 1))
		append(Pc, [p[i - 1], p[i]])
	}

	return path
}

export function fitWithAngleFilter(points = [], error) {
	const test = function(ps = [], error, ) {
		ps = flattenDeep(ps)

		if (ps.length < 6) return false

		return abs(angleOfLines(ps)) < error
	}
	//简版求点集中除收尾两点之外的离收尾两点连线距离最远的点
	const findConvexPoint = function(ps = []) {
		let firstPoint = ps.splice(0, 2)
		let lastPoint = ps.splice(-2)
		let line = firstPoint.concat(lastPoint)
		let maxDis = 0
		let maxIndex = 0

		if (!ps.length) {
			return lastPoint
		}

		for (let i = 0, len = ps.length; i < len; i += 2) {
			let dis = disOfPoint2Line(line, [ps[i], ps[i + 1]])

			if (dis > maxDis) {
				maxDis = dis
				maxIndex = i
			}
		}

		return ps.slice(maxIndex, maxIndex + 2)
	}
	const append = function(p1 = [], p2 = []) {
		p1 = p1.concat(p2)
		path += `Q${p1[0]} ${p1[1]} ${p1[2]} ${p1[3]}`
	}

	let p = flattenDeep(points)
    let path = `M${p[0]} ${p[1]}`
	let stop = 0 //上一段曲线的终点
	let averAngle = 0

	error = error || maxAngleError

	//去掉和起点非常靠近的点
	while(p.length && _v.model(_v.vector(p.slice(0, 4))) <= 0.1) {
		p.splice(2, 2)
	}

	for (let i = 2, len = p.length; i < len; i += 2) {
		// let angel = abs(angleOfLines(p.slice(i - 2, i + 4)))

		if (
			// (averAngle && angel > minAngleError && (angel - averAngle) / averAngle > 4) ||  
			!test([p.slice(stop, stop + 4), p.slice(i, i + 4)], error) || 
			!test(p.slice(i - 2, i + 4), error)
		) {
			let convexP = findConvexPoint(p.slice(stop, i + 2))
			let controlP = getControlPointByThreePoints(p.slice(stop, stop + 2), convexP, p.slice(i, i + 2))
			append(controlP, p.slice(i, i + 2))
			stop = i
			// averAngle = 0
		} else {
			// averAngle = (averAngle + angel) * .5
		}
	}

	console.log('stop', stop, p.slice(stop))

	return path
}