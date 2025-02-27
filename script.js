// Dades proporcionades amb noms nous
const consumEnergia = {
    "total_diario": 620.05,
    "total_mensual": 12401,
    "total_anual": 148812,
    "estimacion_2026": { "total_anual": 153276.36 }
};

const consumAigua = {
    "consumo_diario": 5003,
    "consumo_mensual": 150090,
    "consumo_anual": 1801080,
    "estimacion_2026": { "total_anual": 1855112.4 }
};

const consumNeteja = {
    "total_mensual": 928.20,
    "total_anual": 11138.40,
    "estimacion_2026": { "total_anual": 11472.55 },
    "tendencias_temporales": { "hivern": "Incremento del 5%", "estiu": "Incremento del 1%", "resto_meses": "Incremento del 3%" }
};

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
}

// Funció per obrir/tancar desplegables
function toggleCollapsible(id) {
    const content = document.getElementById(id);
    content.classList.toggle("active");
}

// Càlculs per a la pestanya Personalitzat
function calcularPersonalitzat() {
    const electricBase = parseFloat(document.getElementById("electricBase").value);
    const aiguaBase = parseFloat(document.getElementById("aiguaBase").value);
    const oficinaBase = parseFloat(document.getElementById("oficinaBase").value);
    const netejaBase = parseFloat(document.getElementById("netejaBase").value);

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
}

// Càlculs i gràfics per a la pestanya Dades Propies
function calcularDadesPropies() {
    // Consum d'Energia
    const mitjanaEnergia = (consumEnergia.total_anual + consumEnergia.estimacion_2026.total_anual) / 2;
    document.getElementById("mitjanaEnergia").innerHTML = `Mitjana 2026: ${mitjanaEnergia.toFixed(2)} €`;
    new Chart(document.getElementById("chartEnergia"), {
        type: 'bar',
        data: {
            labels: ['Actual', 'Estimació 2026'],
            datasets: [{
                label: 'Consum d\'Energia (€)',
                data: [consumEnergia.total_anual, consumEnergia.estimacion_2026.total_anual],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    // Consum d'Aigua
    const mitjanaAigua = (consumAigua.consumo_anual + consumAigua.estimacion_2026.total_anual) / 2;
    document.getElementById("mitjanaAigua").innerHTML = `Mitjana 2026: ${mitjanaAigua.toFixed(2)} m³`;
    new Chart(document.getElementById("chartAigua"), {
        type: 'bar',
        data: {
            labels: ['Actual', 'Estimació 2026'],
            datasets: [{
                label: 'Consum d\'Aigua (m³)',
                data: [consumAigua.consumo_anual, consumAigua.estimacion_2026.total_anual],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });

    // Consum de Neteja
    const incrementHivern = 1.05;
    const incrementEstiu = 1.01;
    const incrementResto = 1.03;
    const mitjanaNetejaBase = (consumNeteja.total_anual + consumNeteja.estimacion_2026.total_anual) / 2;
    const mitjanaNetejaAjustada = (mitjanaNetejaBase * (3 * incrementHivern + 3 * incrementEstiu + 6 * incrementResto)) / 12;
    document.getElementById("mitjanaNeteja").innerHTML = `Mitjana 2026 ajustada: ${mitjanaNetejaAjustada.toFixed(2)} €`;
    new Chart(document.getElementById("chartNeteja"), {
        type: 'bar',
        data: {
            labels: ['Actual', 'Estimació 2026'],
            datasets: [{
                label: 'Consum de Neteja (€)',
                data: [consumNeteja.total_anual, consumNeteja.estimacion_2026.total_anual],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

// Càlculs per a la pestanya Consum Elèctric Curs
function calcularConsumCurs() {
    const electricBase = parseFloat(document.getElementById("electricCursBase").value);
    const electricMensual = electricBase / 12;
    const electricHivern = electricMensual * 1.20; // +20% desembre-febrer
    const electricNormal = electricMensual;        // Setembre-novembre, març-juny

    // Setembre-juny = 10 mesos: 3 d'hivern (desembre-febrer) + 7 normals
    const electricCurs = (3 * electricHivern) + (7 * electricNormal);

    document.getElementById("resultatsConsumCurs").innerHTML = `
        <h2>Resultat</h2>
        <p>Consum elèctric de setembre a juny: ${electricCurs.toFixed(2)} kWh</p>
    `;
}

// Obrir la pestanya "Personalitzat" per defecte
openTab('personalitzat');