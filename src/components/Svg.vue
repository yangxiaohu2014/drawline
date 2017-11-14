<template>
  <div class="svg">
    <svg ref="svg" width="600" height="600" id='svg' @mousedown='onMouseDown' @mousemove='onMouseMove' @mouseup='onMouseUp'></svg>
  </div>
</template>

<script>
import Snap from 'snapsvg'
import {filterPoints, points2Path} from '@/assets/js/util'

export default {
  name: 'svg',
  data () {
    return {
      paper: null,
      drawing: false,
      newLineCreated: false,
      points: [],
      baseLine: null,
      lineFiltedByDis: null,
      lineFiltedByAngle: null,
      lineFiltedByDisAndAngle: null,
      count: 0,
    }
  },
  mounted() {
    this.paper = Snap('#svg')
  },
  methods: {
    onMouseDown(e) {
      this.restart([e.offsetX, e.offsetY])
    },

    onMouseMove(e) {
      if (!this.drawing) return false
      if (!this.newLineCreated) {
        this.points.push([e.offsetX, e.offsetY])
        this.createBaseLine()
      } else {
        this.append([e.offsetX, e.offsetY])
      }
    },

    onMouseUp(e) {
      if (!this.newLineCreated) return false

      this.drawing = false
      this.newLineCreated = false

      this.append([e.offsetX, e.offsetY])
      // this.drawLineFilteredByDis()
      // this.drawLineFilteredByAngle()
      this.drawLineFilteredByDisAndAngle()
    },

    drawLineFilteredByDis() {
      let filteredPoints = filterPoints(this.points, {errorType: 'dis', maxDisError: 1})

      this.lineFiltedByDis = this.paper.path(points2Path(filteredPoints)).attr({fill: "none", stroke: "red"}).addClass(`drawLineFilteredByDis-${this.count}`)
    },

    drawLineFilteredByAngle() {
      let filteredPoints = filterPoints(this.points, {errorType: 'angle', maxAngleError: 5})

      this.lineFiltedByAngle = this.paper.path(points2Path(filteredPoints)).attr({fill: "none", stroke: "yellow"}).addClass(`lineFiltedByAngle-${this.count}`)
    },

    drawLineFilteredByDisAndAngle() {
      let filteredPoints = filterPoints(this.points, {errorType: 'both', maxAngleError: 30, maxDisError: 2})

      this.lineFiltedByDisAndAngle = this.paper.path(points2Path(filteredPoints)).attr({fill: "none", stroke: "yellow"}).addClass(`lineFiltedByDisAndAngle-${this.count}`)
    },

    append(point = []) {
      let lastPathData = this.baseLine.attr('d')

      this.points.push(point)
      this.baseLine.attr('d', `${lastPathData} L${point[0]} ${point[1]}`)
    },

    createBaseLine() {
      this.baseLine = this.paper.path(points2Path(this.points)).attr({fill: "none", stroke: "green"}).addClass(`baseLine-${this.count}`)

      this.newLineCreated = true
      console.log(this.baseLine.attr('d'))
    },

    restart(point = []) {
      this.count++
      this.points = [point]
      this.drawing = true
      this.newLineCreated = false
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.svg {
  svg {
    border: 1px solid #ccc;
  }
}
</style>
