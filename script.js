function calculateHomogeneity() {
    const group1Data = document.getElementById('group1').value.split(',').map(Number);
    const group2Data = document.getElementById('group2').value.split(',').map(Number);

    const meanGroup1 = calculateMean(group1Data);
    const meanGroup2 = calculateMean(group2Data);

    const varianceGroup1 = calculateVariance(group1Data, meanGroup1);
    const varianceGroup2 = calculateVariance(group2Data, meanGroup2);

    const fValueCount = varianceGroup1 < varianceGroup2 ? varianceGroup2 / varianceGroup1 : varianceGroup1 / varianceGroup2;

    const fValue = fValueCount;

    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = `
        <tr>
            <th>Statistic</th>
            <th>Group 1</th>
            <th>Group 2</th>
        </tr>
        <tr>
            <td>Mean</td>
            <td>${meanGroup1.toFixed(2)}</td>
            <td>${meanGroup2.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Variance</td>
            <td>${varianceGroup1.toFixed(2)}</td>
            <td>${varianceGroup2.toFixed(2)}</td>
        </tr>
        <tr>
            <td>F Value</td>
            <td colspan="2">${fValue.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Result</td>
            <td colspan="2">${fValue > 1 ? 'Groups are likely homogenous' : 'Groups are likely not homogenous'}</td>
        </tr>
    `;

    const alphaSelect = document.getElementById('alphaSelect');
    const alpha = parseFloat(alphaSelect.value);

    const distributionTable = document.getElementById('alphaResultTable');
    distributionTable.innerHTML = `
        <tr>
            <th>Significance Level</th>
            <th>Degree of Freedom</th>
            <th>F Critical Value</th>
        </tr>
        <tr>
            <td>${(alpha * 100).toFixed(0)}%</td>
            <td>${group1Data.length - 1}, ${group2Data.length - 1}</td>
            <td>${formatTableValue(getFTableValue(group1Data.length - 1, group2Data.length - 1, alpha))}</td>
        </tr>
    `;
}

function formatTableValue(value) {
    // Handle the case where value is null
    if (value === null) {
        return 'N/A';  // or any other appropriate value or message
    }

    // Format the value using toFixed
    return value.toFixed(4);
}

function getFTableValue(df1, df2, alpha) {
    // Implementasikan logika untuk mendapatkan nilai tabel distribusi F
    // Sesuaikan dengan sumber atau referensi distribusi F yang kamu gunakan
    // Contoh: menggunakan distribusi F dari JavaScript stats library atau tabel distribusi F yang telah dihitung sebelumnya
    // return fTableValue;
    const fTable = {
        '2, 20': { '0.01': 5.41, '0.05': 3.49, '0.10': 2.85 },
        // Tambahkan nilai lain sesuai kebutuhan
    };

    // Mengecek apakah nilai derajat kebebasan ada dalam tabel
    const key = `${df1}, ${df2}`;
    if (fTable[key]) {
        return fTable[key][alpha.toFixed(2)] || null;
    }

    return null;
}

function calculateMean(data) {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
}


function calculateVariance(data, mean) {
    const squaredDifferences = data.map(val => (val - mean) ** 2);
    return squaredDifferences.reduce((acc, val) => acc + val, 0) / data.length;
}
