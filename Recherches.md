Actuellement on a les données de population par commune pour récupérer uniquement les villes de plus de 20k habitants
// --- CONFIGURATION ---
const width = 700;
const height = 650;
let selection = []; // Stocke les villes cliquées

// Création du SVG
const svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

// Groupe pour les départements (Arrière-plan)
const gDeparts = svg.append("g").attr("id", "layer-departments");
// Groupe pour les villes (Premier plan) -> Assure que les villes sont CLIQUABLES
const gVilles = svg.append("g").attr("id", "layer-cities");

// Projection
const projection = d3.geoConicConformal()
    .center([2.454071, 46.279229])
    .scale(2600)
    .translate([width/2, height/2]);

const path = d3.geoPath().projection(projection);

// --- CHARGEMENT ---
const urlMap = "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements.geojson";
const urlCsv = "donnees_communes.csv";

// IMPORTANT : Utilisez d3.csv si virgules, d3.dsv(";", ...) si point-virgules
Promise.all([
    d3.json(urlMap),
    d3.dsv(";", urlCsv) // <-- Modifiez ici si besoin (d3.csv ou d3.dsv)
]).then(function([france, data]) {

    console.log("Données chargées. Première ligne :", data[0]);

    // 1. DESSINER LA FRANCE (Arrière-plan)
    gDeparts.selectAll("path")
        .data(france.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "department");

    // 2. NETTOYER LES DONNÉES
    const villes = data.map(d => {
        return {
            // !!! ADAPTEZ LES NOMS A DROITE SELON VOTRE CONSOLE !!!
            nom: d.Nom_Ville || d.commune || d.Ville, 
            pop: +(d.Population || d.pop_2024 || d.PMUN), 
            lat: +(d.Latitude || d.lat || d.coordonnees_y),
            lon: +(d.Longitude || d.lon || d.coordonnees_x)
        };
    }).filter(d => d.pop > 20000 && !isNaN(d.lat)); // Filtre > 20k et coords valides

    // 3. ECHELLE DE TAILLE
    const scaleSize = d3.scaleSqrt()
        .domain([20000, 2000000]) // De 20k à Paris
        .range([3, 15]);

    // 4. DESSINER LES VILLES (Premier plan)
    gVilles.selectAll("circle")
        .data(villes)
        .enter()
        .append("circle")
        .attr("class", "city")
        .attr("cx", d => projection([d.lon, d.lat])[0])
        .attr("cy", d => projection([d.lon, d.lat])[1])
        .attr("r", d => scaleSize(d.pop))
        .on("click", function(event, d) {
            ajouterVille(d);
            // Effet visuel immédiat
            d3.selectAll(".city").style("fill", "#ff4444"); // Reset couleur
            d3.select(this).style("fill", "#007bff");       // Ville active en bleu
            d3.select(this).raise(); // Met le cercle au dessus des autres
        })
        .append("title")
        .text(d => `${d.nom} (${d.pop} hab.)`);

}).catch(err => console.error("Erreur chargement :", err));


// --- LOGIQUE INTERFACE ---
function ajouterVille(ville) {
    if (selection.length >= 2) selection = []; // Reset si déjà 2
    selection.push(ville);

    updateDisplay();
}

function updateDisplay() {
    // Ville 1
    if (selection[0]) {
        d3.select("#city1 .placeholder").html(`
            <strong>${selection[0].nom}</strong><br>
            Pop: ${selection[0].pop.toLocaleString()}
        `);
        d3.select("#city1").classed("active", true);
    } else {
        d3.select("#city1 .placeholder").text("En attente...");
        d3.select("#city1").classed("active", false);
    }

    // Ville 2
    if (selection[1]) {
        d3.select("#city2 .placeholder").html(`
            <strong>${selection[1].nom}</strong><br>
            Pop: ${selection[1].pop.toLocaleString()}
        `);
        d3.select("#city2").classed("active", true);
        
        // Comparaison
        comparer();
    } else {
        d3.select("#city2 .placeholder").text("En attente...");
        d3.select("#city2").classed("active", false);
        d3.select("#comparison-result").style("display", "none");
    }
}

function comparer() {
    const v1 = selection[0];
    const v2 = selection[1];
    const diff = Math.abs(v1.pop - v2.pop);
    const plusGrande = v1.pop > v2.pop ? v1.nom : v2.nom;

    const div = d3.select("#comparison-result");
    div.style("display", "block");
    div.html(`
        <strong>Analyse :</strong><br>
        La ville la plus peuplée est ${plusGrande}.<br>
        L'écart est de ${diff.toLocaleString()} habitants.
    `);
}
