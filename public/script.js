async function sortAndDisplay() {
    let inputArray = document.getElementById("inputArray").value.trim();

    if (inputArray === "") {
        document.getElementById("sortedArray").textContent = "Поле ввода пусто";
        return;
    }

    let array = inputArray.split(",").map(function (item) { return item.trim(); });
    let sortedArray = bubbleSort(array, compareFunction);

    await saveSortedArray(sortedArray);

    document.getElementById("sortedArray").textContent = sortedArray.join(", ");
}

async function saveSortedArray(sortedArray) {
    try {
        const response = await fetch('/saveSortedArray', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sortedArray }),
        });

        if (!response.ok) {
            throw new Error('Ошибка при сохранении в базе данных');
        }
    } catch (error) {
        console.error(error.message);
    }
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