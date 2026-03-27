// Marrim referencat e elementeve DOM
const forma = document.getElementById('rezervimiForm');
const emriInput = document.getElementById('emri');
const tavolinaInput = document.getElementById('tavolina');
const dataInput = document.getElementById('data');
const oraInput = document.getElementById('ora');
const rezervimetLista = document.getElementById('rezervimetLista');

// Vargu ku do të ruhen rezervimet (në memorie)
let rezervimet = [];

// Funksioni për të shfaqur rezervimet në faqe
function shfaqRezervimet() {
    // Pastrojmë përmbajtjen ekzistuese
    rezervimetLista.innerHTML = '';

    if (rezervimet.length === 0) {
        rezervimetLista.innerHTML = '<p>Nuk ka rezervime për momentin.</p>';
        return;
    }

    // Krijojmë një element për çdo rezervim
    rezervimet.forEach((rez, index) => {
        const rezervimDiv = document.createElement('div');
        rezervimDiv.classList.add('rezervim-item');

        rezervimDiv.innerHTML = `
            <div class="rezervim-info">
                <strong>${rez.emri}</strong> - Tavolina ${rez.tavolina} <br>
                <small>${rez.data} në orën ${rez.ora}</small>
            </div>
            <button class="fshi-btn" data-index="${index}">Fshi</button>
        `;

        rezervimetLista.appendChild(rezervimDiv);
    });

    // Shtojmë event listener për butonat "Fshi"
    document.querySelectorAll('.fshi-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            fshiRezervimin(index);
        });
    });
}

// Funksioni për të shtuar një rezervim të ri
function shtoRezervim(event) {
    event.preventDefault(); // Parandalojmë dërgimin e formës dhe rifreskimin e faqes

    // Krijojmë objektin e rezervimit
    const rezervimiRi = {
        emri: emriInput.value,
        tavolina: tavolinaInput.value,
        data: dataInput.value,
        ora: oraInput.value
    };

    // Shtojmë në varg
    rezervimet.push(rezervimiRi);

    // Rifreskojmë listën në UI
    shfaqRezervimet();

    // Pastrojmë inputet
    forma.reset();
}

// Funksioni për të fshirë një rezervim sipas indeksit
function fshiRezervimin(index) {
    rezervimet.splice(index, 1); // Heqim elementin nga vargu
    shfaqRezervimet(); // Rifreskojmë listën
}

// Event listener për dërgimin e formës
forma.addEventListener('submit', shtoRezervim);

// Inicializimi: shfaqim rezervimet (fillimisht bosh)
shfaqRezervimet();