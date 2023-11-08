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
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
            ], [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]
        ]
    },
    { //L
        'color': 'rgb(254, 168, 38)',
        'metrix': [
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 1],
                [0, 0, 0, 0],
            ], [
                [0, 0, 0, 1],
                [0, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ], [
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0],
            ], [
                [0, 0, 0, 0],
                [0, 1, 1, 1],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
            ],
        ]
    },
    { //T
        'color': 'rgb(230, 111, 220)',
        'metrix': [
            [
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0],
            ], [
                [0, 0, 0, 0],
                [0, 1, 1, 1],
                [0, 0, 1, 0],
                [0, 0, 0, 0],
            ], [
                [0, 0, 1, 0],
                [0, 0, 1, 1],
                [0, 0, 1, 0],
                [0, 0, 0, 0],
            ], [
                [0, 0, 1, 0],
                [0, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]
        ]
    },
    { //O
        'color': 'rgb(255, 231, 44)',
        'metrix': [[
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ]]
    },
    { //J
        'color': 'rgb(67, 80, 235)',
        'metrix': [
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
            ], [
                [0, 0, 0, 0],
                [0, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 0],
            ], [
                [0, 0, 1, 1],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0],
            ], [
                [0, 1, 0, 0],
                [0, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]

        ]
    },
    { //S
        'color': 'rgb(41, 240, 55)',
        'metrix': [
            [
                [0, 0, 0, 0],
                [0, 0, 1, 1],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
            ], [
                [0, 0, 1, 0],
                [0, 0, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 0],
            ]
        ]
    },
    { //Z
        'color': 'rgb(237, 77, 77)',
        'metrix': [[
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 0],
        ], [
            [0, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0],
        ]]
    },
]

//Class
class Cursor {
    constructor(x, y = 4) {
        this.pos = [x, y]
        const mertix_n = Math.floor(Math.random() * 7)
        this.mertixIndex = mertix_n
        this.rotateIndex = 0
        this.metrix = copyMetrix(metrixType[mertix_n].metrix[this.rotateIndex])
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
        if (this.isCrashOnMove(0, 1)) {
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
    isCrashOnMove(dx, dy) {
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
    isCrashOnTurn(turnedMetrix) {
        const x = this.pos[0]
        const y = this.pos[1]
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                try {
                    if (turnedMetrix[i][j] + map[y + i][x + j].value > 2) {
                        return true
                    }
                } catch (err) {
                    continue
                }
            }
        }
        return false
    }
    rotateMetrix(direction) {
        var n = this.mertixIndex
        var nextIndex = correctRotateIndex(n, this.rotateIndex + direction)
        if(this.isCrashOnTurn(metrixType[n].metrix[nextIndex])){
            return
        }
        this.rotateIndex = nextIndex
        this.metrix = copyMetrix(metrixType[n].metrix[this.rotateIndex])
        this.processEdge()
    }
}

class Block {
    constructor(x, y) {
        this.pos = [x * BlockSize, y * BlockSize]
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
    updateY(y) {
        this.pos[1] = y * BlockSize
    }
}


//Function
const print = (data) => { console.log(data) }

function correctRotateIndex(n, rotateIndex){
    if (rotateIndex >= metrixType[n].metrix.length) {
        return 0
    } else if (rotateIndex < 0) {
        return metrixType[n].metrix.length - 1
    }
    return rotateIndex
}

function destroyLine(y) {
    for (var i = 0; i < y; i++) {
        for (var x in map[i]) {
            map[i][x].updateY(i + 1)
        }
    }
    map.pop(y)
    var emptyLine = []
    for (var i = 0; i < MapXLength; i++) {
        emptyLine.push(new Block(i, 0))
    }
    map.unshift(emptyLine)
}

function isStackedLine(y) {
    for (var x in map[y]) {
        if (map[y][x].value == 0) {
            return false
        }
    }
    return true
}

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

    for (var i = 0; i < 4; i++) {
        var y = cursor.pos[1] + i
        if (y >= MapYLength || y < 0) {
            continue
        }

        if (isStackedLine(y)) {
            destroyLine(y)
        }
    }

    const lastX = cursor.pos[0]
    cursor = new Cursor(lastX)
}

function moveHorizontal(dx) {
    if (cursor.isCrashOnMove(dx, 0)) {
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
    // keyUp -> turn Right
    switch (ev.code) {
        case 'KeyA':
            moveHorizontal(-1)
            break
        case 'KeyD':
            moveHorizontal(1)
            break
        case 'KeyW':
            cursor.rotateMetrix(1)
            break
        case 'KeyS':
            cursor.rotateMetrix(-1)
            break
    }
})

//Main
var cursor = new Cursor(0)

for (var i = 0; i < MapYLength; i++) {
    map.push([])
    for (var j = 0; j < MapXLength; j++) {
        map[i].push(new Block(j, i))
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