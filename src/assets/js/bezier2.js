import {flattenDeep} from 'lodash'
import {defaultZero, maxDisError, maxAngleError} from './config'
import {vector, model} from './vector'

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
 *   V1 = vector(P1, P2) = (x2 - x1, y2 - y1)
 *   V2 = vector(P2, P3) = (x3 - x2, y3 - y2)
 *   M1 = model(V1)
 *   M2 = model(V2)
 *
 * 	 Pc = P2 - 0.5 * sqrt(M1 * M2) * (V2 / M2 - V1 / M2)
 */
export function getControlPointByThreePoints(...points) {
	points = flattenDeep(points)

	let p1 = points.splice(0, 2)
	let p2 = points.splice(0, 2)
	let p3 = points.splice(0, 2)
	

}