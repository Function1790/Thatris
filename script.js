const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const map = []
const MapXLength = 10
const MapYLength = 20
const BlockSize = 38

var GameTick = 0
var GravityTick = 20
var StopingTick = 0
var MaxStopTick = 100

const metrixType = [
    { //I
        'color': 'rgb(39, 179, 255)',
        'metrix': [
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 0, 0, 0],
        ]
    },
    { //L
        'color': 'rgb(254, 168, 38)',
        'metrix': [
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
        ]
    },
    { //T
        'color': 'rgb(230, 111, 220)',
        'metrix': [
            [0, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
        ]
    },
    { //O
        'color': 'rgb(255, 231, 44)',
        'metrix': [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]
    },
    { //J
        'color': 'rgb(67, 80, 235)',
        'metrix': [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
        ]
    },
    { //S
        'color': 'rgb(41, 240, 55)',
        'metrix': [
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]
    },
    { //Z
        'color': 'rgb(237, 77, 77)',
        'metrix': [
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]
    },
]

//Class
class Cursor {
    constructor(x, y = -4) {
        this.pos = [x, y]
        const mertix_n = Math.floor(Math.random() * 7)
        this.metrix = copyMetrix(metrixType[mertix_n].metrix)
        this.color = metrixType[mertix_n].color
        this.processEdge()
        this.pos[0] = 4 - this.startEdge[0]
    }
    processEdge() {
        this.startEdge = [null, null]
        this.endEdge = [null, null]
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.metrix[i][j] == 1) {
                    if (this.startEdge[0] > j || this.startEdge[0] == null) {
                        this.startEdge[0] = j
                    }
                    if (this.startEdge[1] > i || this.startEdge[1] == null) {
                        this.startEdge[1] = i
                    }
                    if (this.endEdge[0] < j || this.endEdge[0] == null) {
                        this.endEdge[0] = j
                    }
                    if (this.endEdge[1] < i || this.endEdge[1] == null) {
                        this.endEdge[1] = i
                    }
                }
            } //end For(j)
        }
    }
    draw() {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.metrix[i][j] == 1) {
                    var x = (this.pos[0] + j) * BlockSize
                    var y = (this.pos[1] + i) * BlockSize
                    ctx.beginPath()
                    ctx.fillStyle = this.color
                    ctx.fillRect(x, y, BlockSize, BlockSize)
                    ctx.closePath()
                }
            }
        }
    }
    applyGravity() {
        if (this.isCrash(0, 1)) {
            StopingTick++
            return
        }
        if (this.pos[1] + this.endEdge[1] + 1 < MapYLength) {
            if (GameTick % GravityTick == 0) {
                this.pos[1]++
            }
            StopingTick = 0
        } else {
            StopingTick++
        }
    }
    isCrash(dx, dy) {
        const x = this.pos[0] + dx
        const y = this.pos[1] + dy
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                try {
                    if (this.metrix[i][j] + map[y + i][x + j].value > 2) {
                        return true
                    }
                } catch (err) {
                    continue
                }
            }
        }
        return false
    }
}

class Block {
    constructor(x, y) {
        this.pos = [x, y]
        this.value = 0
        this.color = 'gray'
    }
    draw() {
        const x = this.pos[0]
        const y = this.pos[1]
        ctx.beginPath()
        if (this.value == 2) {
            ctx.fillStyle = this.color
            ctx.fillRect(x, y, BlockSize, BlockSize)
        } else {
            ctx.strokeStyle = 'gray'
            ctx.strokeRect(x, y, BlockSize, BlockSize)
        }
        ctx.closePath()
    }
    setBlock(value, color) {
        this.value = value
        this.color = color
    }
}


//Function
const print = (data) => { console.log(data) }

function hardenCursor() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (cursor.metrix[i][j] == 1) {
                var x = cursor.pos[0] + j
                var y = cursor.pos[1] + i
                map[y][x].setBlock(2, cursor.color)
            }
        }
    }
    const lastX = cursor.pos[0]
    cursor = new Cursor(lastX)
}

function moveHorizontal(dx) {
    if (cursor.isCrash(dx, 0)) {
        return
    }
    const nextX = cursor.pos[0] + dx
    if (nextX + cursor.startEdge[0] < 0 || nextX + cursor.endEdge[0] >= MapXLength) {
        return
    }
    cursor.pos[0] += dx
}

function copyMetrix(metrix) {
    var result = []
    for (var i = 0; i < metrix.length; i++) {
        result.push([])
        for (var j = 0; j < metrix[i].length; j++) {
            result[i].push(metrix[i][j])
        }
    }
    return result
}

//Event Function
document.addEventListener('keypress', (ev) => {
    //print(ev)
    switch (ev.code) {
        case 'KeyA':
            moveHorizontal(-1)
            break
        case 'KeyD':
            moveHorizontal(1)
            break
    }
})

//Main
var cursor = new Cursor(0)

for (var i = 0; i < MapYLength; i++) {
    map.push([])
    for (var j = 0; j < MapXLength; j++) {
        var pos = [j * (BlockSize), i * (BlockSize)]
        map[i].push(new Block(pos[0], pos[1]))
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < MapYLength; i++) {
        for (var j = 0; j < MapXLength; j++) {
            map[i][j].draw()
        }
    }

    cursor.draw()


    cursor.applyGravity()
    if (StopingTick == MaxStopTick) {
        hardenCursor()
    }
    GameTick++
    requestAnimationFrame(render)
}

render()