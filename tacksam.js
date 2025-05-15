const carousel = document.getElementById('carouselExampleFade');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

carousel.addEventListener('slid.bs.carousel', function () {
    const items = document.querySelectorAll('#carouselExampleFade .carousel-item');
    const activeIndex = [...items].findIndex(item => item.classList.contains('active'));

    // Visa eller dölja vänster
    if (activeIndex === 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = '';
    }

    // Visa eller dölja höger
    if (activeIndex === items.length - 1) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = '';
    }
});

// Initialt körs detta för att dölja rätt knapp
const event = new Event('slid.bs.carousel');
carousel.dispatchEvent(event);


//Formulär
document.addEventListener("DOMContentLoaded", function () {
    function updateLabel(dateStr) {
        const selectedDate = dateStr ? new Date(dateStr) : new Date();
        const startDate = new Date("2025-05-01");
        const diffTime = selectedDate - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const tacksamLabel = document.getElementById("tacksamLabel");
        const background3 = document.getElementById('background3').style.backgroundImage = "url('Bilder/TacksamBilder-1-tacksam1.png')";
        if (tacksamLabel) {
            if ((diffDays + 1) % 8 === 0) {
                tacksamLabel.textContent = "Vad har varit extra speciellt idag?";
            } else {
                tacksamLabel.textContent = "Vad är jag tacksam för idag?";
            }
        }
        if (background3) {
            const imageIndex = Math.floor((diffDays) / 8) % 8;
            background3.style.backgroundImage = `url('Bilder/bild${imageIndex + 1}.png')`;
        }
    }

    // Kör vid sidladdning
    updateLabel();

    // Kör vid ändring av datumfältet
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.addEventListener('change', function () {
            updateLabel(this.value);
        });
    }
});

document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = {
        day: document.getElementById('day').value,
        date: document.getElementById('date').value,
        tacksam: document.getElementById('tacksam').value,
        why: document.getElementById('why').value,
        tankar: document.getElementById('tankar').value
    };

    const dateObj = new Date(formData.date);
    if (!formData.date || isNaN(dateObj.getTime())) {
        alert("Fyll i ett giltigt datum!");
        return;
    }

    // Hämta dagbok och lägg till posten
    let diary = JSON.parse(localStorage.getItem('tacksamhetsdagbok')) || {};
    diary[formData.date] = formData; // Skriv över eller skapa ny post för datumet
    localStorage.setItem('tacksamhetsdagbok', JSON.stringify(diary));
    alert('Dagen är sparad!');
});

//Hämta data
const form = document.querySelector('form');
const dateInput = document.getElementById('date');

dateInput.addEventListener('change', function () {
    // Ladda data för det nya datumet
    loadFormForDate(this.value);
    showEntry(this.value);
});

function loadFormForDate(date) {
    let diary = JSON.parse(localStorage.getItem('tacksamhetsdagbok')) || {};
    if (diary[date]) {
        document.getElementById('day').value = diary[date].day || '';
        document.getElementById('tacksam').value = diary[date].tacksam || '';
        document.getElementById('why').value = diary[date].why || '';
        document.getElementById('tankar').value = diary[date].tankar || '';
    }
}

function showEntry(date) {
    let diary = JSON.parse(localStorage.getItem('tacksamhetsdagbok')) || {};
    let entry = diary[date];
    if (entry) {
        document.getElementById('entryDisplay').innerHTML =
            `<p><strong>Datum:</strong> ${entry.date}</p>
            <p><strong>Veckodag:</strong> ${entry.day}</p>
             <p><strong>Tacksam för:</strong> ${entry.tacksam}</p>
             <p><strong>Varför:</strong> ${entry.why}</p>
             <p><strong>Tankar:</strong> ${entry.tankar}</p>`;
    } else {
        document.getElementById('entryDisplay').innerHTML = '<p>Ingen data sparad för detta datum.</p>';
    }
}


//Töm formuläret när användaren klickar på "Nästa dag"
document.getElementById('nextDay').addEventListener('click', function () {
    document.getElementById('date').value = '';
    document.getElementById('day').value = '';
    document.getElementById('tacksam').value = '';
    document.getElementById('why').value = '';
    document.getElementById('tankar').value = '';
});

function openModal() {
    const diary = JSON.parse(localStorage.getItem('tacksamhetsdagbok')) || {};
    const entries = Object.entries(diary);

    // Sortera på datum, nyaste först
    entries.sort((a, b) => new Date(b[0]) - new Date(a[0]));

    let html = '';
    for (const [date, entry] of entries) {
        html += `
            <div class="entry">
                <h2>${date} - ${entry.day || ''}</h2>
                <p><strong>Tacksam för:</strong> ${entry.tacksam || ''}</p>
                <p><strong>Varför:</strong> ${entry.why || ''}</p>
                <p><strong>Tankar:</strong> ${entry.tankar || ''}</p>
            </div>
        `;
    }
    document.getElementById('allEntriesContent').innerHTML = html;
    document.getElementById('allEntriesModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('allEntriesModal').style.display = 'none';
}

function exportDiaryAsHTML() {
    const diary = JSON.parse(localStorage.getItem('tacksamhetsdagbok')) || {};
    let htmlContent = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Tacksamhetsdagbok</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .entry { margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <h1>Min Tacksamhetsdagbok</h1>
    `;
    for (const date in diary) {
        const entry = diary[date];
        htmlContent += `
            <div class="entry">
                <h2>${date} - ${entry.day || ''}</h2>
                <p><strong>Tacksam för:</strong> ${entry.tacksam || ''}</p>
                <p><strong>Varför:</strong> ${entry.why || ''}</p>
                <p><strong>Tankar:</strong> ${entry.tankar || ''}</p>
            </div>
        `;
    }
    htmlContent += `</body></html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tacksamhetsdagbok.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportDiaryAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const diary = JSON.parse(localStorage.getItem('tacksamhetsdagbok')) || {};
    const entries = Object.entries(diary);
    // Sortera posterna på datum, nyaste först
    entries.sort((a, b) => new Date(b[0]) - new Date(a[0]));

    let y = 15;
    doc.setFontSize(16);
    doc.text("Min Tacksamhetsdagbok", 10, y);
    y += 10;
    doc.setFontSize(12);

    for (const [date, entry] of entries) {
        if (y > 270) { doc.addPage(); y = 15; }
        doc.text(`${date} - ${entry.day || ''}`, 10, y); y += 7;
        doc.text(`Tacksam för: ${entry.tacksam || ''}`, 10, y); y += 7;
        doc.text(`Varför: ${entry.why || ''}`, 10, y); y += 7;
        doc.text(`Tankar: ${entry.tankar || ''}`, 10, y); y += 10;
    }
    doc.save('tacksamhetsdagbok.pdf');
}

