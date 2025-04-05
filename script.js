const prezzi = {
  starter: {
    solo: [109, 99, 89, 69, 59, 49, 29, 19],
    crm:  [119, 109, 99, 79, 69, 59, 39, 29]
  },
  plus: {
    solo: [129, 119, 109, 89, 69, 59, 49, 39],
    crm:  [139, 129, 119, 99, 79, 69, 59, 49]
  },
  vip: {
    solo: [139, 129, 119, 99, 79, 69, 59, 49],
    crm:  [149, 139, 129, 109, 89, 79, 69, 59]
  }
};

const setup = [99, 119, 129, 149, 199, 299, 499, 899];
const soglie = [1, 2, 4, 6, 8, 10, 15, 20];

function getIndiceStanze(stanze) {
  for (let i = 0; i < soglie.length; i++) {
    if (stanze <= soglie[i]) return i;
  }
  return soglie.length - 1;
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("calculate-btn").addEventListener("click", calcolaPreventivo);
  document.getElementById("check-btn").addEventListener("click", function () {
    document.getElementById("dettaglio-panel").style.display = "block";
  });
});

function calcolaPreventivo() {
  // Input
  const stanze = parseInt(document.getElementById("rooms").value);
  const medici = parseInt(document.getElementById("doctors").value);
  const bundle = document.getElementById("bundle").value || "plus";
  const crm = document.getElementById("crm").checked;
  const tablet = document.getElementById("tabletFirma").checked;
  const lettore = document.getElementById("lettoreTessera").checked;

  if (isNaN(stanze) || isNaN(medici) || stanze <= 0) {
    alert("Inserisci un numero valido di ambulatori e medici.");
    return;
  }

  // Prezzo unitario per stanza
  const idx = getIndiceStanze(stanze);
  let prezzoUnitario = prezzi[bundle][crm ? "crm" : "solo"][idx];

  // Applica sconto se rapporto medici/stanze ≤ 1.3
  if ((medici / stanze) <= 1.3) {
    prezzoUnitario = prezzoUnitario / 1.5;
  }

  // Canoni
  const canoneMensileBase = prezzoUnitario * stanze;
  const setupFeeBase = setup[idx];

  // Costi opzionali una tantum
  const tabletCosto = tablet ? 429 : 0;
  const lettoreCosto = lettore ? 79 : 0;
  const setupTotale = setupFeeBase + tabletCosto + lettoreCosto;

  // Prezzi a listino (+25%)
  const listinoMensile = canoneMensileBase * 1.25;
  const listinoSetup = setupFeeBase * 1.25;

  // Mostra risultati a listino
  document.getElementById("monthly-list-price").textContent = `${listinoMensile.toFixed(2)} €`;
  document.getElementById("setup-list-price").textContent = `${listinoSetup.toFixed(2)} €`;

  // Precarica i valori reali nel DOM (che si mostreranno solo al click su "Check")
  document.getElementById("default-monthly-price").textContent = `${canoneMensileBase.toFixed(2)} €`;
  document.getElementById("setup-fee").textContent = `${setupFeeBase.toFixed(2)} €`;
  document.getElementById("setup-total").textContent = `${setupTotale.toFixed(2)} €`;

  // Mostra pannello risultati con solo il listino
  document.getElementById("results").style.display = "block";
  document.getElementById("listino-panel").style.display = "block";
  document.getElementById("dettaglio-panel").style.display = "none";
}
