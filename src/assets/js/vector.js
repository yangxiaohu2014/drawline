/**
 * 只写了二维向量运算
 */

import {flattenDeep, isNaN} from 'lodash'
import {defaultZero} from './config'

const PI = Math.PI
const sqrt = Math.sqrt
const pow = Math.pow
const abs = Math.abs
const acos = Math.acos
const atan = Math.atan
const round = Math.round

/**
 * [model 求向量模]
 * @param  {Array}  vector [向量]
 * @return {[num]}        [向量模即长度]
 */
export function model(vector = []) {
	return sqrt(pow(vector[0], 2) + pow(vector[1], 2))
}

/**
 * [vector 通过点求向量]
 * @param  {Array}  points [两个点坐标]
 * @return {[Array]}       [向量]
 */
export function vector(...points) {
	points = flattenDeep(points)

	if (points.length === 2) {
		return points
	} else if (points.length === 4) {
		return [points[2] - points[0], points[3] - points[1]]
	} else {
		console.warn('unexpected points ', points)
	}
}

/**
 * [unit 求单位向量]
 * @param  {Array}  point1 [起点]
 * @param  {Array}  point2 [终点]
 * @return {[Array]}        [向量]
 */
export function unit(...points) {
	points = flattenDeep(points)

	let v = vector(points)
	let m = model(v)

	return [v[0] / m, v[1] / m]
}

/**
 * [add 向量求和]
 * @param  {Array}  vector1 [description]
 * @param  {Array | Num}  vector2 [向量或数值]
 * @return {[Array]}         [返回数组]
 */
export function add(vector1 = [], vector2 = []) {
	return [vector1[0] + vector2[0], vector1[1] + vector2[1]]
}

export function minus(vector1 = [], vector2 = []) {
	return [vector1[0] - vector2[0], vector1[1] - vector2[1]]
}
/**
 * [scale 向量缩放，向量乘常数]
 * @param  {Array}  vector [description]
 * @param  {Number} ratio  [description]
 * @return {[type]}        [向量]
 */
export function scale(vector = [], ratio = 1) {
	return [vector[0] * ratio, vector[1] * ratio]
}
/**
 * [multiply 点乘，向量乘向量]
 * @param  {Array}  vector1 [description]
 * @param  {Array}  vector2 [description]
 * @return {[type]}         [description]
 */
export function multiply(vector1 = [], vector2 = []) {
	return vector1[0] * vector2[0] + vector1[1] * vector2[1]
}

/**
 * [cross 叉乘]
 * @param  {Array}  vector1 [description]
 * @param  {Array}  vector2 [description]
 * @return {[num]}         [description]
 */
export function cross(vector1 = [], vector2 = []) {
	return vector1[0] * vector2[1] - vector1[1] * vector2[0]
}

/**
 * [angle 向量相对x轴正向的夹角，逆时针方向为正，顺时针方向为负]
 * @param  {Array}  vector [description]
 * @return {[num]}        [description]
 */

export function angle(vector = []) {
	if (abs(vector[0]) < defaultZero) {
		if (abs(vector[1]) < defaultZero) {
			return 0
		} else {
			return vector[1] > 0 ? 90 : -90
		}
	}

	let ang = atan(vector[1] / vector[0]) * 180 / PI

	if (vector[0] < 0) {
		ang = ang > 0 ? (ang - 180) : (180 - ang)
	}

	return ang
}

/**
 * [sweepAngle 向量vector1到向量vector2的夹角]
 * @param  {Array}  vector1 [description]
 * @param  {Array}  vector2 [description]
 * @return {[num]}         [description]
 */
export function sweepAngle(vector1 = [], vector2 = []) {
	let ang = round(angle(vector2) - angle(vector1))

	if (ang < 180) {
		return 2 * 180 + ang
	} else if (ang > 180) {
		return ang - 2 * 180
	}

	return ang
}

