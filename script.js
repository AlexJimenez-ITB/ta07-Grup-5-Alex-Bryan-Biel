function calcular() {
    // Obtenir valors base
    const electricBase = parseFloat(document.getElementById("electricBase").value);
    const aiguaBase = parseFloat(document.getElementById("aiguaBase").value);
    const oficinaBase = parseFloat(document.getElementById("oficinaBase").value);
    const netejaBase = parseFloat(document.getElementById("netejaBase").value);

    // Càlculs amb ajustos estacionals
    const electricMensual = electricBase / 12;
    const electricHivern = electricMensual * 1.20; // +20%
    const electricEstiu = electricMensual * 0.85;  // -15%
    const electricNormal = electricMensual;

    const aiguaMensual = aiguaBase / 12;
    const aiguaEstiu = aiguaMensual * 1.30;   // +30%
    const aiguaHivern = aiguaMensual * 0.80;  // -20%
    const aiguaNormal = aiguaMensual;

    const oficinaMensual = oficinaBase / 12;
    const oficinaCurs = oficinaMensual * 1.25; // +25%
    const oficinaEstiu = oficinaMensual * 0.50;// -50%

    const netejaMensual = netejaBase / 12;
    const netejaCurs = netejaMensual * 1.15;  // +15%
    const netejaEstiu = netejaMensual;

    // Càlculs sol·licitats
    const electricAnual = (3 * electricHivern) + (3 * electricEstiu) + (6 * electricNormal) * 1.05; // +5% tendència
    const electricCurs = (3 * electricHivern) + (7 * electricNormal);
    const aiguaAnual = (3 * aiguaEstiu) + (3 * aiguaHivern) + (6 * aiguaNormal) * 1.05;
    const aiguaCurs = (3 * aiguaHivern) + (7 * aiguaNormal);
    const oficinaAnual = (10 * oficinaCurs) + (2 * oficinaEstiu);
    const oficinaCursTotal = 10 * oficinaCurs;
    const netejaAnual = (10 * netejaCurs) + (2 * netejaEstiu);
    const netejaCursTotal = 10 * netejaCurs;

    // Mostrar resultats
    document.getElementById("resultats").innerHTML = `
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