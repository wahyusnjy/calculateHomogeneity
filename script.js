function calculateHomogeneity() {
    const group1Data = document.getElementById('group1').value.split(',').map(Number);
    const group2Data = document.getElementById('group2').value.split(',').map(Number);
    const alphaSelect = document.getElementById('alphaSelect');
    const alpha = parseFloat(alphaSelect.value);

    const headerHasil = document.getElementById('header-result');
    headerHasil.textContent = 'Penyelesaian';

    const titleDistTable = document.getElementById('titleDistributionTable');
    titleDistTable.textContent = 'F Distribution Table';

    const step1 = document.querySelector(".text-result-1");
    step1.textContent = `1. Taraf signifikasi nya adalah : ${(alpha * 100).toFixed(0)}%`

    const step2 = document.querySelector(".text-result-2");
    step2.innerHTML = `
    <p>2. Tentukan hipotesis penelitiannya:</p>
    <p>Ho = σ1² = σ2² (varians 1 sama dengan varians 2 atau 𝐷𝑎𝑡𝑎 homogen)</p>
    <p>H1 = σ1² ≠ σ2² (varians 1 tidak sama dengan varians 2 atau Data tidak homogen)</p>
    <p>Kriteria Pengujian:</p>
    <ul>
        <li>Terima Ho jika Fhitung < Ftabel</li>
        <li>Tolak Ho jika Fhitung > Ftabel</li>
    </ul>
`;  

    const meanGroup1 = calculateMean(group1Data);
    const meanGroup2 = calculateMean(group2Data);

    const varianceGroup1 = calculateVariance(group1Data, meanGroup1);
    const varianceGroup2 = calculateVariance(group2Data, meanGroup2);

    displayMeanVarianceTable(group1Data, group2Data, meanGroup1, meanGroup2, varianceGroup1, varianceGroup2);

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

function displayMeanVarianceTable(group1Data, group2Data, meanGroup1, meanGroup2, varianceGroup1, varianceGroup2) {
    const varianceCountTable = document.getElementById('VariansTable');
    varianceCountTable.innerHTML = `
        <tr>
            <th>No</th>
            <th>Group 1</th>
            <th>(Xai-X̄)^2</th>
            <th>Group 2</th>
            <th>(Xbi-X̄)^2</th>
        </tr>
    `;

    let sumGroup1All = 0; 
    let sumSquaresGroup1 = 0;
    let sumGroup2All = 0;
    let sumSquaresGroup2 = 0;

    for (let i = 0; i < Math.max(group1Data.length, group2Data.length); i++) {
        const squaredDifferenceGroup1 = group1Data[i] !== undefined ? (group1Data[i] - meanGroup1) ** 2 : 0;
        const squaredDifferenceGroup2 = group2Data[i] !== undefined ? (group2Data[i] - meanGroup2) ** 2 : 0;


        sumSquaresGroup1 += squaredDifferenceGroup1;
        sumSquaresGroup2 += squaredDifferenceGroup2;

        sumGroup1All += group1Data[i] !== undefined ? group1Data[i] : 0;
        sumGroup2All += group2Data[i] !== undefined ? group2Data[i] : 0;

        const rowData = `
            <tr>
                <td>${i + 1}</td>
                <td>${group1Data[i] !== undefined ? group1Data[i] : ''}</td>
                <td>${group1Data[i] !== undefined ? parseFloat(squaredDifferenceGroup1).toFixed(3) : ''}</td>
                <td>${group2Data[i] !== undefined ? group2Data[i] : ''}</td>
                <td>${group2Data[i] !== undefined ? parseFloat(squaredDifferenceGroup2).toFixed(3) : ''}</td>
            </tr>
        `;
        varianceCountTable.innerHTML += rowData;
    }

    // Tampilkan total sum of squares
    const totalSquaresRow = `
        <tr>
            <td style="background-color:#f2f2f2; color:black;">Total</td>
            <td style="background-color:#f2f2f2; color:black;">${sumGroup1All}</td>
            <td style="background-color:#f2f2f2; color:black;">${sumSquaresGroup1}</td>
            <td style="background-color:#f2f2f2; color:black;">${sumGroup2All}</td>
            <td style="background-color:#f2f2f2; color:black;"  >${sumSquaresGroup2}</td>
        </tr>
    `;

    varianceCountTable.innerHTML += totalSquaresRow;
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
