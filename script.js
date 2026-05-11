document.addEventListener('DOMContentLoaded', function() {
    const salario = document.getElementById('salario');
    const jornada = document.getElementById('jornada');
    const periodoPrueba = document.getElementById('periodoPrueba');
    const form = document.getElementById('contratoForm');

    // Validaciones realtime
    salario.addEventListener('input', validarSMLMV);
    jornada.addEventListener('input', validarJornada);
    periodoPrueba.addEventListener('input', validarPrueba);

    function validarSMLMV() {
        const val = parseInt(salario.value);
        if (val < 1750905) {
            salario.setCustomValidity('❌ Mínimo SMLMV 2026: $1.750.905 (Dec.1469/2025)');
            salario.style.borderColor = '#e74c3c';
        } else {
            salario.setCustomValidity('');
            salario.style.borderColor = '#27ae60';
        }
    }

    function validarJornada() {
        const val = parseInt(jornada.value);
        if (val > 47) jornada.setCustomValidity('❌ Máximo 47 horas semanales CST Art.161');
        else jornada.setCustomValidity('');
    }

    function validarPrueba() {
        if (parseInt(periodoPrueba.value) > 60) periodoPrueba.setCustomValidity('❌ Máx 2 meses CST');
        else periodoPrueba.setCustomValidity('');
    }

    // Accesibilidad: Enter en labels → focus input
    document.querySelectorAll('label').forEach(label => {
        label.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const targetId = label.getAttribute('for');
                document.getElementById(targetId)?.focus();
            }
        });
    });

    form.addEventListener('submit', e => e.preventDefault());
});

function generarContratoIndefinido() {
    const chks = ['chk1', 'chk2', 'chk3', 'chk4'];
    const todosSi = chks.every(id => document.getElementById(id).checked);
    const form = document.getElementById('contratoForm');
    const salario = parseInt(document.getElementById('salario').value);
    const jornada = parseInt(document.getElementById('jornada').value);

    if (!form.checkValidity() || !todosSi || salario < 1750905 || jornada > 47) {
        mostrarMensaje('❌ ERROR: Completa TODOS campos, Checklist 100% Sí, SMLMV $1.750.905+, Jornada ≤47h (Ley 2466/CST)', '#e74c3c');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // Header
    doc.setFillColor(52,152,219); doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255,255,255); doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    doc.text('CONTRATO INDEFINIDO - CAPITAL INVESTMENTS S.A.S. 2026', 20, 18);

    // Datos dinámicos
    doc.setFontSize(12); doc.setTextColor(40,40,40); doc.setFont('helvetica', 'normal');
    let y = 35;
    doc.text(`Empleador: ${document.getElementById('nomEmp').value} NIT ${document.getElementById('nitEmp').value}`, 20, y); y+=8;
    doc.text(`Trabajador: ${document.getElementById('nomTrab').value} - ${document.getElementById('ccTrab').value}`, 20, y); y+=8;
    doc.text(`Dirección: ${document.getElementById('dirTrab').value}`, 20, y); y+=8;
    doc.text(`Cargo: ${document.getElementById('cargo').value}`, 20, y); y+=8;
    doc.text(`Inicio: ${document.getElementById('fechaIni').value} | Prueba: ${document.getElementById('periodoPrueba').value} días`, 20, y); y+=8;
    doc.text(`Salario: $${document.getElementById('salario').value.toLocaleString()} (SMLMV OK) | Jornada: ${document.getElementById('jornada').value}h`, 20, y); y+=8;
    doc.text(`SS: EPS ${document.getElementById('eps').value} | Pensión ${document.getElementById('pension').value} | ARL ${document.getElementById('arl').value}`, 20, y); y+=12;
    
    doc.setFont('helvetica', 'bold'); doc.text('CHECKLIST: 100% CUMPLIDO | PRESTACIONES PLENAS | PREAVISO 30 DÍAS OK', 20, y); y+=10;
    doc.setFont('helvetica', 'normal'); doc.text('Firmas:', 20, y+=10);
    doc.text('Empleador: _______________________________ Fecha: _______________', 20, y+=8);
    doc.text('Trabajador: _______________________________ Fecha: _______________', 20, y+=8);
    doc.text('Testigo 1: ________________ CC: ___________ Testigo 2: ________________ CC: ___________', 20, y+=8);

    const nombreArchivo = `contrato-indefinido-${document.getElementById('nomTrab').value.replace(/[^a-zA-Z0-9]/g, '_')}_2026.pdf`;
    doc.save(nombreArchivo);

    mostrarMensaje('✅ ¡PDF Legal Generado! Firma electrónica, registra PILA y archiva en Drive HQ.', '#27ae60');
}

function mostrarMensaje(texto, color) {
    const msg = document.getElementById('mensaje');
    msg.textContent = texto;
    msg.style.background = color;
    msg.style.color = 'white';
    msg.style.display = 'block';
    msg.style.border = `3px solid ${color === '#27ae60' ? '#229954' : '#c0392b'}`;
    setTimeout(() => {
        msg.style.display = 'none';
    }, 6000);
}
