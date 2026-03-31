// proteger.js - VERSIÓN SEGURA
import { verificarAccesoAdmin } from './admin_auth.js';

// Ejecutar y ESPERAR antes de continuar
(async () => {
    const accesoPermitido = await verificarAccesoAdmin();
    if (!accesoPermitido) {
        // Detener carga de la página
        document.body.innerHTML = '';
        return;
    }
    // Si llega acá, puede continuar cargando el resto
})();
