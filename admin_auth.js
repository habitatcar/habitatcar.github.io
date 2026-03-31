// admin_auth.js - VERSIÓN SEGURA
import { auth, db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function verificarAccesoAdmin() {
    // Mostrar loader
    const loader = document.createElement('div');
    loader.id = 'auth-loader';
    loader.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                    background:#0a192f;display:flex;justify-content:center;
                    align-items:center;z-index:99999;flex-direction:column;gap:20px;">
            <div class="spinner" style="width:50px;height:50px;border:4px solid #334766;
                        border-top-color:#d4af37;border-radius:50%;animation:spin 1s linear infinite;"></div>
            <p style="color:#e6f1ff;">🔐 Verificando sesión...</p>
            <style>@keyframes spin{to{transform:rotate(360deg);}}</style>
        </div>`;
    document.body.appendChild(loader);

    try {
        // Esperar a que Firebase inicialice el estado de auth
        await new Promise(resolve => {
            if (auth.currentUser) {
                resolve();
            } else {
                const unsubscribe = auth.onAuthStateChanged(() => {
                    unsubscribe();
                    resolve();
                });
            }
        });

        const user = auth.currentUser;
        
        // ❌ Si no hay usuario logueado → fuera
        if (!user) {
            loader.remove();
            window.location.href = "index.html";
            return false;
        }

        // ✅ Verificar rol en Firestore (SIEMPRE del lado del servidor vía rules)
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        
        if (!userDoc.exists() || userDoc.data().rol !== "admin") {
            await auth.signOut();
            loader.remove();
            window.location.href = "index.html";
            return false;
        }

        // ✅ Todo ok
        loader.remove();
        return true;
        
    } catch (error) {
        console.error("Error de autenticación:", error);
        await auth.signOut();
        loader.remove();
        window.location.href = "index.html";
        return false;
    }
}
