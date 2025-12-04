// script.js
// Responsável por: injetar o item 'Admin' no menu da index.html, e implementar a lógica da página admin.html

(function () {
    const STORAGE_KEY = 'usuarios';

    // --- Função para formatar data ---
    function dataAgora() {
        const d = new Date();
        return d.toLocaleString('pt-BR');
    }

    // --- Injetar link Admin no menu da index ---
    function injetaAdminNoMenu() {
        try {
            const nav = document.querySelector("header nav");
            if (!nav) return;

            if (document.getElementById("nav-admin-injetado")) return;

            const a = document.createElement("a");
            a.href = "admin.html";
            a.textContent = "Admin";
            a.id = "nav-admin-injetado";
            a.style.fontWeight = "bold";
            nav.appendChild(a);

        } catch (e) { }
    }

    // --- Utils LocalStorage ---
    function carregarUsuarios() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        try {
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch {
            return [];
        }
    }

    function salvarUsuarios(arr) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }

    // --- Render da lista ---
    function criarLiUsuario(usuario, index) {
        const li = document.createElement('li');
        li.dataset.index = index;
        li.style.padding = '8px';
        li.style.border = '1px solid #e0e0e0';
        li.style.borderRadius = '6px';
        li.style.marginBottom = '8px';
        li.style.background = '#fff';

        const info = document.createElement('div');
        info.innerHTML = `
            <strong>${usuario.nome}</strong> - <em>${usuario.email}</em>
            <div style="font-size:12px; color:#666">Cadastrado em: ${usuario.data}</div>
        `;

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = "Excluir";
        btnExcluir.style.background = "#dc3545";
        btnExcluir.style.color = "#fff";
        btnExcluir.style.padding = "6px 10px";
        btnExcluir.style.border = "none";
        btnExcluir.style.borderRadius = "4px";
        btnExcluir.style.marginTop = "6px";
        btnExcluir.onclick = () => excluirUsuario(index);

        li.appendChild(info);
        li.appendChild(btnExcluir);
        return li;
    }

    function renderizarLista(filtro = "") {
        const ul = document.getElementById("lista-usuarios");
        if (!ul) return;

        ul.innerHTML = "";
        const usuarios = carregarUsuarios();
        const filtroLower = filtro.trim().toLowerCase();

        usuarios.forEach((u, i) => {
            if (!filtro ||
                u.nome.toLowerCase().includes(filtroLower) ||
                u.email.toLowerCase().includes(filtroLower)) {
                ul.appendChild(criarLiUsuario(u, i));
            }
        });
    }

    // --- CRUD ---
    function cadastrarUsuario(nome, email) {
        const usuarios = carregarUsuarios();
        usuarios.push({
            id: Date.now(),
            nome: nome.trim(),
            email: email.trim(),
            data: dataAgora()
        });
        salvarUsuarios(usuarios);
        renderizarLista();
    }

    function excluirUsuario(index) {
        const usuarios = carregarUsuarios();
        usuarios.splice(index, 1);
        salvarUsuarios(usuarios);
        renderizarLista();
    }

    function excluirTodos() {
        if (confirm("Deseja excluir todos os registros?")) {
            localStorage.removeItem(STORAGE_KEY);
            renderizarLista();
        }
    }

    function limparCampos() {
        document.getElementById("nome").value = "";
        document.getElementById("email").value = "";
    }

    // --- Setup da página admin ---
    function setupAdminPage() {
        const btnCadastrar = document.getElementById("cadastrar");
        const btnLimpar = document.getElementById("limpar-campos");
        const btnExcluirTodos = document.getElementById("excluir-todos");
        const inputPesquisar = document.getElementById("pesquisar");

        if (btnCadastrar) {
            btnCadastrar.onclick = () => {
                const nome = document.getElementById("nome").value;
                const email = document.getElementById("email").value;

                if (!nome.trim() || !email.trim()) {
                    alert("Preencha os campos.");
                    return;
                }

                cadastrarUsuario(nome, email);
                limparCampos();
            };
        }

        if (btnLimpar) btnLimpar.onclick = limparCampos;
        if (btnExcluirTodos) btnExcluirTodos.onclick = excluirTodos;
        if (inputPesquisar) inputPesquisar.oninput = (e) => renderizarLista(e.target.value);

        renderizarLista();
    }

    // --- Inicialização ---
    document.addEventListener("DOMContentLoaded", () => {
        injetaAdminNoMenu();

        if (document.getElementById("admin-container")) {
            setupAdminPage();
        }
    });

})();
