function sortAndDisplay() {
    let inputArray = document.getElementById("inputArray").value;
    let array = inputArray.split(",").map(function (item) { return item.trim(); });
    let sortedArray = bubbleSort(array, compareFunction);
    document.getElementById("sortedArray").textContent = sortedArray.join(", ");
}

function bubbleSort(arr, compareFn) {
    var n = arr.length;
    for (var i = 0; i < n - 1; i++)
        for (var j = 0; j < n - i - 1; j++)
            if (compareFn(arr[j], arr[j + 1]) > 0) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
    return arr;
}

function compareFunction(a, b) {
    if (!isNaN(Number(a)) && !isNaN(Number(b))) {
        return Number(a) - Number(b);
    }
    else {
        return String(a).localeCompare(String(b));
    }
}
