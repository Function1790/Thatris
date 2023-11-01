arr = [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
]


def turnRight(arr):
    lenX = len(arr[0])
    lenY = len(arr)

    arr2 = []

    for i in range(lenX):
        arr2.append([0 for i in range(lenY)])

    for i in range(lenY):
        for j in range(lenX):
            # left -> arr2[lenX-1-j][i] = arr[i][j]
            arr2[j][lenY-1-i] = arr[i][j]
    return arr2



def display(arr):
    for i in arr:
        for j in i:
            print(end=f"{j} ")
        print()


display(turnLeft(arr))
