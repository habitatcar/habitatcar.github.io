import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function verificarAccesoAdmin() {
    return new Promise((resolve) => {
        const loader = document.createElement('div');
        loader.id = 'auth-loader';
        loader.innerHTML = `
            <div style="position:fixed; top:0; left:0; width:100%; height:100%; 
                        background:#0a192f; display:flex; justify-content:center; 
                        align-items:center; z-index:99999; flex-direction:column; gap:20px;">
                <div class="spinner" style="width:50px; height:50px; border:4px solid #334766; 
                            border-top-color:#d4af37; border-radius:50%; animation:spin 1s linear infinite;"></div>
                <p style="color:#e6f1ff;">🔐 Verificando acceso...</p>
                <style>@keyframes spin{to{transform:rotate(360deg);}}</style>
            </div>
        `;
        document.body.appendChild(loader);
        
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = "index.html";
                return;
            }
            
            try {
                const userDoc = await getDoc(doc(db, "usuarios", user.uid));
                const userData = userDoc.data();
                
                if (userData && userData.rol === "admin") {
                    loader.remove();
                    resolve(true);
                } else {
                    window.location.href = "index.html";
                }
            } catch (error) {
                console.error("Error verificando admin:", error);
                window.location.href = "index.html";
            }
        });
    });
}
