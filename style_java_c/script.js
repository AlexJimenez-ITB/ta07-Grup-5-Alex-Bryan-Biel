let dataE, dataH2O, dataNeteja;

// Cargar datos desde los JSON
Promise.all([
    fetch('Consum-E.json').then(res => res.json()),
    fetch('Consum-H2O.json').then(res => res.json()),
    fetch('Consum-Neteja.json').then(res => res.json())
]).then(([jsonE, jsonH2O, jsonNeteja]) => {
    dataE = jsonE;
    dataH2O = jsonH2O;
    dataNeteja = jsonNeteja;
    console.log("Dades carregades:", { dataE, dataH2O, dataNeteja });
}).catch(error => console.error("Error carregant dades:", error));

// Inicializar gráfico
const ctx = document.getElementById('energyChart').getContext('2d');
let energyChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Consum',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    }
});

// Actualizar gráfico con datos
function updateChart() {
    if (!dataE || !dataH2O || !dataNeteja) {
        alert("Les dades encara no s'han carregat.");
        return;
    }
    
    energyChart.data.labels = ["Electricitat", "Aigua", "Neteja"];
    energyChart.data.datasets[0].data = [dataE.total_anual, dataH2O.consumo_anual, dataNeteja.total_anual];
    energyChart.update();
}

// Funció per calcular resultats
function calculateResult() {
    const calculationType = document.getElementById('calculationType').value;
    let result = "No s'ha pogut calcular.";
    
    if (!dataE || !dataH2O || !dataNeteja) {
        alert("Les dades encara no s'han carregat.");
        return;
    }
    
    switch (calculationType) {
        case "electricitat_any":
            result = `Consum anual estimat: ${dataE.total_anual} kWh`;
            break;
        case "electricitat_periode":
            result = `Consum de gener: ${dataE.consumo.enero} kWh, Consum de juliol: ${dataE.consumo.julio} kWh`;
            break;
        case "aigua_any":
            result = `Consum anual estimat: ${dataH2O.consumo_anual} litres`;
            break;
        case "aigua_periode":
            result = `Consum diari: ${dataH2O.consumo_diario} litres`;
            break;
        case "neteja_any":
            result = `Consum anual neteja: ${dataNeteja.total_anual}€`;
            break;
        case "neteja_periode":
            result = dataNeteja.productos.map(p => `${p.descripcion}: ${p.importe}€`).join("\n");
            break;
        default:
            result = "Càlcul no implementat.";
    }
    
    document.getElementById('result').innerText = result;
}

// Exportar a PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Calculadora d'Estalvi Energètic", 10, 10);
    doc.text(document.getElementById('result').innerText, 10, 20);
    doc.save("estalvi_energetic.pdf");
}