var matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

const sin = (seta) => { return Math.sin(seta) + 1 - 1 }
const cos = (seta) => { return Math.cos(seta) + 1 - 1 }
const print = (t) => { console.log(t) }

function rotateMatrix(pos, delta= 2,seta = Math.PI / 2) {
    x2 = pos[0] * cos(seta) - pos[1] * sin(seta) + 1
    y2 = pos[0] * sin(seta) + pos[1] * cos(seta) + 1
    return [x2, y2]
}

rotated = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
]
for (var i in matrix) {
    print(`${rotateMatrix([0, i])}\t${rotateMatrix([1, i])}\t${rotateMatrix([2, i])}`)
    for (var j in matrix[i]) {
    }
}//https://withhamit.tistory.com/429