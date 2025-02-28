// Dades proporcionades amb noms nous
const costosSubministraments = {
    "fecha": "20/06/2024",
    "total_mensual": 620.05,
    "total_anual_laborable": 5975.1,
    "estimacion_2026": 6154.353
};

const consumAigua = {
    "consumo_diario": 5003,
    "consumo_mensual": 150090,
    "consumo_anual": 1801080,
    "estimacion_2026": { "total_anual": 1855112.4 }
};

const costosNeteja = {
    "total_mensual": 928.20,
    "total_anual": 11138.40,
    "estimacion_2026": { "total_anual": 11472.55 },
    "tendencias_temporales": { "hivern": "Incremento del 5%", "estiu": "Incremento del 1%", "resto_meses": "Incremento del 3%" }
};

const facturesTelecomunicacions = {
    "totales": {
        "total_mensual": 40.00,
        "total_anual": 480.00,
        "estimacion_2026": 494.40
    }
};

const transaccionsServeis = {
    "transacciones": [
        { "total_anual": 3909.47, "estimacion_2026": 4026.76 },
        {}, // Sense total_anual
        {}
    ]
};

const consumiblesOficina = {
    "total_anual": 771.29,
    "estimacion_2026": 794.43
};

// Variables globals per emmagatzemar instàncies dels gràfics
let chartPersonalitzat, chartSubministraments, chartAigua, chartNeteja, chartTelecomunicacions, chartServeis, chartOficina, chartElectric, chartAiguaCurs, chartOficinaCurs, chartNetejaCurs;

// Funció per obrir pestanyes
function openTab(tabName) {
    const tabs = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    const buttons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add("active");

    // Executar càlcul automàtic si és la pestanya Dades Propies
    if (tabName === 'dadesPropies') {
        calcularDadesPropies();
    }
}

// Funció per obrir/tancar desplegables
function toggleCollapsible(id) {
    const content = document.getElementById(id);
    content.classList.toggle("active");
}

// Funció per exportar a PDF amb text i gràfic
function exportToPDF(section) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const results = document.getElementById(`resultats${section.charAt(0).toUpperCase() + section.slice(1)}`) || document.getElementById(`mitjana${section.charAt(0).toUpperCase() + section.slice(1)}`);
    const chartCanvas = document.getElementById(`chart${section.charAt(0).toUpperCase() + section.slice(1)}`);

    if (results && results.innerText) {
        doc.setFontSize(16);
        doc.text(`Resultats ${section.charAt(0).toUpperCase() + section.slice(1)}`, 10, 10);
        doc.setFontSize(12);
        const textLines = doc.splitTextToSize(results.innerText, 180);
        doc.text(textLines, 10, 20);

        if (chartCanvas) {
            const chartImg = chartCanvas.toDataURL("image/png");
            const imgHeight = (chartCanvas.height * 180) / chartCanvas.width;
            doc.addImage(chartImg, 'PNG', 10, 60, 180, imgHeight);
            doc.save(`Resultats_${section}.pdf`);
        } else {
            doc.save(`Resultats_${section}.pdf`);
        }
    } else {
        alert("No hi ha resultats per exportar. Fes un càlcul primer!");
    }
}

// Càlculs per a la pestanya Personalitzat (amb gràfic corregit)
function calcularPersonalitzat() {
    const electricBase = parseFloat(document.getElementById("electricBase").value) || 0;
    const aiguaBase = parseFloat(document.getElementById("aiguaBase").value) || 0;
    const oficinaBase = parseFloat(document.getElementById("oficinaBase").value) || 0;
    const netejaBase = parseFloat(document.getElementById("netejaBase").value) || 0;

    const electricMensual = electricBase / 12;
    const electricHivern = electricMensual * 1.20;
    const electricEstiu = electricMensual * 0.85;
    const electricNormal = electricMensual;

    const aiguaMensual = aiguaBase / 12;
    const aiguaEstiu = aiguaMensual * 1.30;
    const aiguaHivern = aiguaMensual * 0.80;
    const aiguaNormal = aiguaMensual;

    const oficinaMensual = oficinaBase / 12;
    const oficinaCurs = oficinaMensual * 1.25;
    const oficinaEstiu = oficinaMensual * 0.50;

    const netejaMensual = netejaBase / 12;
    const netejaCurs = netejaMensual * 1.15;
    const netejaEstiu = netejaMensual;

    const electricAnual = (3 * electricHivern) + (3 * electricEstiu) + (6 * electricNormal) * 1.05;
    const electricCurs = (3 * electricHivern) + (7 * electricNormal);
    const aiguaAnual = (3 * aiguaEstiu) + (3 * aiguaHivern) + (6 * aiguaNormal) * 1.05;
    const aiguaCurs = (3 * aiguaHivern) + (7 * aiguaNormal);
    const oficinaAnual = (10 * oficinaCurs) + (2 * oficinaEstiu);
    const oficinaCursTotal = 10 * oficinaCurs;
    const netejaAnual = (10 * netejaCurs) + (2 * netejaEstiu);
    const netejaCursTotal = 10 * netejaCurs;

    document.getElementById("resultatsPersonalitzat").innerHTML = `
        <h2>Resultats</h2>
        <p>1. Consum elèctric pròxim any: ${electricAnual.toFixed(2)} kWh</p>
        <p>2. Consum elèctric setembre-juny: ${electricCurs.toFixed(2)} kWh</p>
        <p>3. Consum d’aigua pròxim any: ${aiguaAnual.toFixed(2)} m³</p>
        <p>4. Consum d’aigua setembre-juny: ${aiguaCurs.toFixed(2)} m³</p>
        <p>5. Consumibles oficina pròxim any: ${oficinaAnual.toFixed(2)} €</p>
        <p>6. Consumibles oficina setembre-juny: ${oficinaCursTotal.toFixed(2)} €</p>
        <p>7. Productes neteja pròxim any: ${netejaAnual.toFixed(2)} €</p>
        <p>8. Productes neteja setembre-juny: ${netejaCursTotal.toFixed(2)} €</p>
    `;

    // Destruir el gràfic anterior si existeix
    if (chartPersonalitzat) {
        chartPersonalitzat.destroy();
        console.log("Gràfic anterior destruït");
    }

    // Comprovar i obtenir el context del canvas
    const canvas = document.getElementById("chartPersonalitzat");
    if (!canvas) {
        console.error("Error: No s'ha trobat el canvas 'chartPersonalitzat'");
        return;
    }
    canvas.width = 400; // Assegurar dimensions fixes
    canvas.height = 200;
    const ctx1 = canvas.getContext("2d");
    if (!ctx1) {
        console.error("Error: No es pot obtenir el context del canvas 'chartPersonalitzat'");
        return;
    }

    // Crear el gràfic amb tots els resultats
    try {
        chartPersonalitzat = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Elèctric Any', 'Elèctric Curs', 'Aigua Any', 'Aigua Curs', 'Oficina Any', 'Oficina Curs', 'Neteja Any', 'Neteja Curs'],
                datasets: [{
                    label: 'Consum Personalitzat',
                    data: [electricAnual, electricCurs, aiguaAnual, aiguaCurs, oficinaAnual, oficinaCursTotal, netejaAnual, netejaCursTotal],
                    backgroundColor: ['#36A2EB', '#36A2EB', '#FF6384', '#FF6384', '#4BC0C0', '#4BC0C0', '#FFCE56', '#FFCE56']
                }]
            },
            options: {
                responsive: true, // Habilita la resposta automàtica a canvis de mida
                maintainAspectRatio: false, // Permet ajustar l’aspecte
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Valor' },
                        ticks: {
                            callback: function(value, index, values) {
                                const labels = ['Elèctric Any', 'Elèctric Curs', 'Aigua Any', 'Aigua Curs', 'Oficina Any', 'Oficina Curs', 'Neteja Any', 'Neteja Curs'];
                                return value.toLocaleString() + (labels[index].includes('Elèctric') ? ' kWh' : labels[index].includes('Aigua') ? ' m³' : ' €');
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${value.toLocaleString()} ${label.includes('Elèctric') ? 'kWh' : label.includes('Aigua') ? 'm³' : '€'}`;
                            }
                        }
                    }
                }
            }
        });
        console.log("Gràfic creat amb èxit");
    } catch (error) {
        console.error("Error al crear el gràfic:", error);
    }

    document.getElementById("exportPersonalitzat").style.display = "block";
}

// Càlculs i gràfics per a la pestanya Dades Propies (automàtic)
function calcularDadesPropies() {
    // Costos de Subministraments
    const subministramentsMensual = costosSubministraments.total_anual_laborable / 12;
    const subministramentsHivern = subministramentsMensual * 1.20;
    const subministramentsEstiu = subministramentsMensual * 0.85;
    const subministramentsNormal = subministramentsMensual;
    const subministramentsAnual = (3 * subministramentsHivern) + (3 * subministramentsEstiu) + (6 * subministramentsNormal) * 1.05;
    const subministramentsCurs = (3 * subministramentsHivern) + (7 * subministramentsNormal);
    const mitjanaSubministraments = (costosSubministraments.total_anual_laborable + costosSubministraments.estimacion_2026) / 2;
    document.getElementById("mitjanaSubministraments").innerHTML = `
        Mitjana 2026: ${mitjanaSubministraments.toFixed(2)} €<br>
        Pròxim any: ${subministramentsAnual.toFixed(2)} €<br>
        Setembre-Juny: ${subministramentsCurs.toFixed(2)} €
    `;
    if (chartSubministraments) {
        chartSubministraments.destroy();
    }
    chartSubministraments = new Chart(document.getElementById("chartSubministraments"), {
        type: 'bar',
        data: {
            labels: ['Actual', 'Estimació 2026', 'Pròxim Any', 'Setembre-Juny'],
            datasets: [{
                label: 'Costos de Subministraments (€)',
                data: [costosSubministraments.total_anual_laborable, costosSubministraments.estimacion_2026, subministramentsAnual, subministramentsCurs],
                backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    // Consum d'Aigua
    const aiguaMensual = consumAigua.consumo_anual / 12;
    const aiguaEstiu = aiguaMensual * 1.30;
    const aiguaHivern = aiguaMensual * 0.80;
    const aiguaNormal = aiguaMensual;
    const aiguaAnual = (3 * aiguaEstiu) + (3 * aiguaHivern) + (6 * aiguaNormal) * 1.05;
    const aiguaCurs = (3 * aiguaHivern) + (7 * aiguaNormal);
    const mitjanaAigua = (consumAigua.consumo_anual + consumAigua.estimacion_2026.total_anual) / 2;
    document.getElementById("mitjanaAigua").innerHTML = `
        Mitjana 2026: ${mitjanaAigua.toFixed(2)} m³<br>
        Pròxim any: ${aiguaAnual.toFixed(2)} m³<br>
        Setembre-Juny: ${aiguaCurs.toFixed(2)} m³
    `;
    if (chartAigua) {
        chartAigua.destroy();
    }
    chartAigua = new Chart(document.getElementById("chartAigua"), {
        type: 'bar',
        data: {
            labels: ['Actual', 'Estimació 2026', 'Pròxim Any', 'Setembre-Juny'],
            datasets: [{
                label: 'Consum d\'Aigua (m³)',
                data: [consumAigua.consumo_anual, consumAigua.estimacion_2026.total_anual, aiguaAnual, aiguaCurs],
                backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    // Costos de Neteja
    const netejaMensual = costosNeteja.total_anual / 12;
    const netejaCurs = netejaMensual * 1.15;
    const netejaEstiu = netejaMensual;
    const netejaAnual = (10 * netejaCurs) + (2 * netejaEstiu);
    const netejaCursTotal = 10 * netejaCurs;
    const mitjanaNeteja = (costosNeteja.total_anual + costosNeteja.estimacion_2026.total_anual) / 2;
    document.getElementById("mitjanaNeteja").innerHTML = `
        Mitjana 2026: ${mitjanaNeteja.toFixed(2)} €<br>
        Pròxim any: ${netejaAnual.toFixed(2)} €<br>
        Setembre-Juny: ${netejaCursTotal.toFixed(2)} €
    `;
    if (chartNeteja) {
        chartNeteja.destroy();
    }
    chartNeteja = new Chart(document.getElementById("chartNeteja"), {
        type: 'bar',
        data: {
            labels: ['Actual', 'Estimació 2026', 'Pròxim Any', 'Setembre-Juny'],
            datasets: [{
                label: 'Costos de Neteja (€)',
                data: [costosNeteja.total_anual, costosNeteja.estimacion_2026.total_anual, netejaAnual, netejaCursTotal],
                backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    // Factures de Telecomunicacions
    const telecomMensual = facturesTelecomunicacions.totales.total_anual / 12;
    const telecomCurs = telecomMensual * 1.10;
    const telecomEstiu = telecomMensual * 0.95;
    const telecomAnual = (10 * telecomCurs) + (2 * telecomEstiu);
    const telecomCursTotal = 10 * telecomCurs;
    const mitjanaTelecomunicacions = (facturesTelecomunicacions.totales.total_anual + facturesTelecomunicacions.totales.estimacion_2026) / 2;
    document.getElementById("mitjanaTelecomunicacions").innerHTML = `
        Mitjana 2026: ${mitjanaTelecomunicacions.toFixed(2)} €<br>
        Pròxim any: ${telecomAnual.toFixed(2)} €<br>
        Setembre-Juny: ${telecomCursTotal.toFixed(2)} €
    `;
    if (chartTelecomunicacions) {
        chartTelecomunicacions.destroy();
    }
    chartTelecomunicacions = new Chart(document.getElementById("chartTelecomunicacions"), {
        type: 'bar',
        data: {
            labels: ['Actual', 'Estimació 2026', 'Pròxim Any', 'Setembre-Juny'],
            datasets: [{
                label: 'Factures de Telecomunicacions (€)',
                data: [facturesTelecomunicacions.totales.total_anual, facturesTelecomunicacions.totales.estimacion_2026, telecomAnual, telecomCursTotal],
                backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    // Transaccions de Serveis
    const serveisMensual = transaccionsServeis.transacciones[0].total_anual / 12;
    const serveisCurs = serveisMensual * 1.15;
    const serveisEstiu = serveisMensual;
    const serveisAnual = (10 * serveisCurs) + (2 * serveisEstiu);
    const serveisCursTotal = 10 * serveisCurs;
    const mitjanaServeis = (transaccionsServeis.transacciones[0].total_anual + transaccionsServeis.transacciones[0].estimacion_2026) / 2;
    document.getElementById("mitjanaServeis").innerHTML = `
        Mitjana 2026: ${mitjanaServeis.toFixed(2)} €<br>
        Pròxim any: ${serveisAnual.toFixed(2)} €<br>
        Setembre-Juny: ${serveisCursTotal.toFixed(2)} €
    `;
    if (chartServeis) {
        chartServeis.destroy();
    }
    chartServeis = new Chart(document.getElementById("chartServeis"), {
        type: 'bar',
        data: {
            labels: ['Actual', 'Estimació 2026', 'Pròxim Any', 'Setembre-Juny'],
            datasets: [{
                label: 'Transaccions de Serveis (€)',
                data: [transaccionsServeis.transacciones[0].total_anual, transaccionsServeis.transacciones[0].estimacion_2026, serveisAnual, serveisCursTotal],
                backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    // Consumibles d'Oficina
    const oficinaMensual = consumiblesOficina.total_anual / 12;
    const oficinaCurs = oficinaMensual * 1.25;
    const oficinaEstiu = oficinaMensual * 0.50;
    const oficinaAnual = (10 * oficinaCurs) + (2 * oficinaEstiu);
    const oficinaCursTotal = 10 * oficinaCurs;
    const mitjanaOficina = (consumiblesOficina.total_anual + consumiblesOficina.estimacion_2026) / 2;
    document.getElementById("mitjanaOficina").innerHTML = `
        Mitjana 2026: ${mitjanaOficina.toFixed(2)} €<br>
        Pròxim any: ${oficinaAnual.toFixed(2)} €<br>
        Setembre-Juny: ${oficinaCursTotal.toFixed(2)} €
    `;
    if (chartOficina) {
        chartOficina.destroy();
    }
    chartOficina = new Chart(document.getElementById("chartOficina"), {
        type: 'bar',
        data: {
            labels: ['Actual', 'Estimació 2026', 'Pròxim Any', 'Setembre-Juny'],
            datasets: [{
                label: 'Consumibles d\'Oficina (€)',
                data: [consumiblesOficina.total_anual, consumiblesOficina.estimacion_2026, oficinaAnual, oficinaCursTotal],
                backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

// Càlculs per a la pestanya Consum Elèctric (amb gràfic)
function calcularConsumElectric() {
    const electricBase = parseFloat(document.getElementById("electricCursBase").value);
    const electricMensual = electricBase / 12;
    const electricHivern = electricMensual * 1.20;
    const electricEstiu = electricMensual * 0.85;
    const electricNormal = electricMensual;
    const electricAnual = (3 * electricHivern) + (3 * electricEstiu) + (6 * electricNormal) * 1.05;
    const electricCurs = (3 * electricHivern) + (7 * electricNormal);

    document.getElementById("resultatsConsumElectric").innerHTML = `
        <h2>Resultat</h2>
        <p>Consum elèctric pròxim any: ${electricAnual.toFixed(2)} kWh</p>
        <p>Consum elèctric setembre-juny: ${electricCurs.toFixed(2)} kWh</p>
    `;

    if (chartElectric) {
        chartElectric.destroy();
    }
    const ctx = document.getElementById("chartConsumElectric").getContext("2d");
    if (ctx) {
        chartElectric = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pròxim Any', 'Setembre-Juny'],
                datasets: [{
                    label: 'Consum Elèctric (kWh)',
                    data: [electricAnual, electricCurs],
                    backgroundColor: ['#36A2EB', '#FF6384']
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    } else {
        console.error("Error: No es pot obtenir el context del canvas 'chartConsumElectric'");
    }

    document.getElementById("exportConsumElectric").style.display = "block";
}

// Càlculs per a la pestanya Consum d'Aigua (amb gràfic)
function calcularConsumAigua() {
    const aiguaBase = parseFloat(document.getElementById("aiguaCursBase").value);
    const aiguaMensual = aiguaBase / 12;
    const aiguaEstiu = aiguaMensual * 1.30;
    const aiguaHivern = aiguaMensual * 0.80;
    const aiguaNormal = aiguaMensual;
    const aiguaAnual = (3 * aiguaEstiu) + (3 * aiguaHivern) + (6 * aiguaNormal) * 1.05;
    const aiguaCurs = (3 * aiguaHivern) + (7 * aiguaNormal);

    document.getElementById("resultatsConsumAigua").innerHTML = `
        <h2>Resultat</h2>
        <p>Consum d’aigua pròxim any: ${aiguaAnual.toFixed(2)} m³</p>
        <p>Consum d’aigua setembre-juny: ${aiguaCurs.toFixed(2)} m³</p>
    `;

    if (chartAiguaCurs) {
        chartAiguaCurs.destroy();
    }
    const ctx = document.getElementById("chartConsumAigua").getContext("2d");
    if (ctx) {
        chartAiguaCurs = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pròxim Any', 'Setembre-Juny'],
                datasets: [{
                    label: 'Consum d\'Aigua (m³)',
                    data: [aiguaAnual, aiguaCurs],
                    backgroundColor: ['#36A2EB', '#FF6384']
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    } else {
        console.error("Error: No es pot obtenir el context del canvas 'chartConsumAigua'");
    }

    document.getElementById("exportConsumAigua").style.display = "block";
}

// Càlculs per a la pestanya Consumibles d'Oficina (amb gràfic)
function calcularConsumOficina() {
    const oficinaBase = parseFloat(document.getElementById("oficinaCursBase").value);
    const oficinaMensual = oficinaBase / 12;
    const oficinaCurs = oficinaMensual * 1.25;
    const oficinaEstiu = oficinaMensual * 0.50;
    const oficinaAnual = (10 * oficinaCurs) + (2 * oficinaEstiu);
    const oficinaCursTotal = 10 * oficinaCurs;

    document.getElementById("resultatsConsumOficina").innerHTML = `
        <h2>Resultat</h2>
        <p>Consumibles oficina pròxim any: ${oficinaAnual.toFixed(2)} €</p>
        <p>Consumibles oficina setembre-juny: ${oficinaCursTotal.toFixed(2)} €</p>
    `;

    if (chartOficinaCurs) {
        chartOficinaCurs.destroy();
    }
    const ctx = document.getElementById("chartConsumOficina").getContext("2d");
    if (ctx) {
        chartOficinaCurs = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pròxim Any', 'Setembre-Juny'],
                datasets: [{
                    label: 'Consumibles d\'Oficina (€)',
                    data: [oficinaAnual, oficinaCursTotal],
                    backgroundColor: ['#36A2EB', '#FF6384']
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    } else {
        console.error("Error: No es pot obtenir el context del canvas 'chartConsumOficina'");
    }

    document.getElementById("exportConsumOficina").style.display = "block";
}

// Càlculs per a la pestanya Productes de Neteja (amb gràfic)
function calcularConsumNeteja() {
    const netejaBase = parseFloat(document.getElementById("netejaCursBase").value);
    const netejaMensual = netejaBase / 12;
    const netejaCurs = netejaMensual * 1.15;
    const netejaEstiu = netejaMensual;
    const netejaAnual = (10 * netejaCurs) + (2 * netejaEstiu);
    const netejaCursTotal = 10 * netejaCurs;

    document.getElementById("resultatsConsumNeteja").innerHTML = `
        <h2>Resultat</h2>
        <p>Productes neteja pròxim any: ${netejaAnual.toFixed(2)} €</p>
        <p>Productes neteja setembre-juny: ${netejaCursTotal.toFixed(2)} €</p>
    `;

    if (chartNetejaCurs) {
        chartNetejaCurs.destroy();
    }
    const ctx = document.getElementById("chartConsumNeteja").getContext("2d");
    if (ctx) {
        chartNetejaCurs = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pròxim Any', 'Setembre-Juny'],
                datasets: [{
                    label: 'Productes de Neteja (€)',
                    data: [netejaAnual, netejaCursTotal],
                    backgroundColor: ['#36A2EB', '#FF6384']
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    } else {
        console.error("Error: No es pot obtenir el context del canvas 'chartConsumNeteja'");
    }

    document.getElementById("exportConsumNeteja").style.display = "block";
}

// Carregar valors per defecte dels JSONs
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("electricBase").value = costosSubministraments.total_anual_laborable;
    document.getElementById("aiguaBase").value = consumAigua.consumo_anual;
    document.getElementById("oficinaBase").value = consumiblesOficina.total_anual;
    document.getElementById("netejaBase").value = costosNeteja.total_anual;
    document.getElementById("electricCursBase").value = costosSubministraments.total_anual_laborable;
    document.getElementById("aiguaCursBase").value = consumAigua.consumo_anual;
    document.getElementById("oficinaCursBase").value = consumiblesOficina.total_anual;
    document.getElementById("netejaCursBase").value = costosNeteja.total_anual;

    // Executar càlcul automàtic a Dades Propies al carregar
    if (document.getElementById('dadesPropies').classList.contains('active')) {
        calcularDadesPropies();
    }
});

// Obrir la pestanya "Personalitzat" per defecte
openTab('personalitzat');