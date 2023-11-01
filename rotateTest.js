var arr = [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
]

function turnRight(arr) {
    var arr2 = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            // Python -> arr2[j][lenY-1-i] = arr[i][j]
            arr2[j][arr.length - 1 - i] = arr[i][j]
        }
    }

    return arr2
}

function turnLeft(arr) {
    var arr2 = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            arr2[arr[i].length-1-j][i] = arr[i][j]
        }
    }

    return arr2
}

console.log(turnLeft(arr))
/* result
[
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 1],
    [0, 0, 0, 0]
]
*/