const API_URL = "http://localhost/redesocial/back/api.php";

// Estado da aplicação
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    verificarAutenticacao();
});

function verificarAutenticacao() {
    const authSection = document.getElementById("auth-section");
    const feedSection = document.getElementById("feed-section");

    if (usuarioLogado) {
        authSection.classList.add("hidden");
        feedSection.classList.remove("hidden");
        document.getElementById("usuario-logado-nome").textContent = `@${usuarioLogado.username}`;
        carregarFeed();
    } else {
        authSection.classList.remove("hidden");
        feedSection.classList.add("hidden");
    }
}

function alternarAba(aba) {
    document.getElementById("auth-mensagem").textContent = "";
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".form").forEach(f => f.classList.remove("active"));

    if (aba === "login") {
        document.getElementById("tab-login").classList.add("active");
        document.getElementById("form-login").classList.add("active");
    } else {
        document.getElementById("tab-cadastro").classList.add("active");
        document.getElementById("form-cadastro").classList.add("active");
    }
}

// 1. CADASTRO DE USUÁRIO
document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById("auth-mensagem");
    msgEl.textContent = "";

    const dados = {
        nome: document.getElementById("cad-nome").value,
        username: document.getElementById("cad-username").value,
        email: document.getElementById("cad-email").value,
        senha: document.getElementById("cad-senha").value
    };

    try {
        const res = await fetch(`${API_URL}?rota=usuario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const resultado = await res.json();

        if (!res.ok) {
            msgEl.textContent = resultado.erro || "Erro ao cadastrar.";
            return;
        }

        // Faz login automático após cadastrar
        usuarioLogado = { id_usuario: resultado.id, ...dados };
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
        verificarAutenticacao();
    } catch (erro) {
        msgEl.textContent = "Erro de conexão com o servidor.";
        console.error(erro);
    }
});

// 2. LOGIN DE USUÁRIO
document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById("auth-mensagem");
    msgEl.textContent = "";

    const identificador = document.getElementById("login-identificador").value.trim();
    const senha = document.getElementById("login-senha").value;

    try {
        const res = await fetch(`${API_URL}?rota=usuario`);
        const usuarios = await res.json();

        const usuarioEncontrado = usuarios.find(
            u => (u.email === identificador || u.username === identificador) && u.senha === senha
        );

        if (usuarioEncontrado) {
            usuarioLogado = usuarioEncontrado;
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
            verificarAutenticacao();
        } else {
            msgEl.textContent = "E-mail/Username ou senha incorretos.";
        }
    } catch (erro) {
        msgEl.textContent = "Erro ao conectar com o servidor.";
        console.error(erro);
    }
});

function logout() {
    usuarioLogado = null;
    localStorage.removeItem("usuarioLogado");
    verificarAutenticacao();
}

// 3. CRIAR POSTAGEM
document.getElementById("form-post").addEventListener("submit", async (e) => {
    e.preventDefault();
    const textarea = document.getElementById("post-conteudo");
    const conteudo = textarea.value.trim();

    if (!conteudo) return;

    try {
        await fetch(`${API_URL}?rota=publicacao`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_usuario: usuarioLogado.id_usuario,
                conteudo: conteudo
            })
        });

        textarea.value = "";
        carregarFeed();
    } catch (erro) {
        alert("Erro ao publicar!");
        console.error(erro);
    }
});

// 4. CARREGAR FEED
async function carregarFeed() {
    const listaEl = document.getElementById("lista-publicacoes");

    try {
        const [resPosts, resUsuarios, resCurtidas] = await Promise.all([
            fetch(`${API_URL}?rota=publicacao`),
            fetch(`${API_URL}?rota=usuario`),
            fetch(`${API_URL}?rota=curtida`)
        ]);

        const publicacoes = await resPosts.json();
        const usuarios = await resUsuarios.json();
        const curtidas = await resCurtidas.json();

        if (!publicacoes.length) {
            listaEl.innerHTML = `<p class="loading">Nenhuma publicação ainda. Seja o primeiro a postar!</p>`;
            return;
        }

        publicacoes.sort((a, b) => b.id_publicacao - a.id_publicacao);
        listaEl.innerHTML = "";

        publicacoes.forEach(post => {
            const autor = usuarios.find(u => u.id_usuario == post.id_usuario) || {
                nome: "Usuário Desconhecido",
                username: "desconhecido"
            };

            const curtidasDoPost = curtidas.filter(c => c.id_publicacao == post.id_publicacao);
            const minhaCurtida = curtidasDoPost.find(c => c.id_usuario == usuarioLogado.id_usuario);

            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="post-header">
                    <span class="post-author">${escaparHTML(autor.nome)} <span class="post-username">@${escaparHTML(autor.username)}</span></span>
                </div>
                <div class="post-content">${escaparHTML(post.conteudo)}</div>
                <div class="post-footer">
                    <button class="btn-like ${minhaCurtida ? 'liked' : ''}" 
                            onclick="alternarCurtida(${post.id_publicacao}, ${minhaCurtida ? minhaCurtida.id_curtida : null})">
                        ${minhaCurtida ? '❤️ Curtido' : '🤍 Curtir'} (${curtidasDoPost.length})
                    </button>
                </div>
            `;
            listaEl.appendChild(card);
        });

    } catch (erro) {
        listaEl.innerHTML = `<p class="mensagem-erro">Erro ao carregar o feed.</p>`;
        console.error(erro);
    }
}

// 5. CURTIR / DESCURTIR PUBLICAÇÃO
async function alternarCurtida(idPublicacao, idCurtidaExistente) {
    try {
        if (idCurtidaExistente) {
            await fetch(`${API_URL}?rota=curtida&id=${idCurtidaExistente}`, {
                method: "DELETE"
            });
        } else {
            await fetch(`${API_URL}?rota=curtida`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_usuario: usuarioLogado.id_usuario,
                    id_publicacao: idPublicacao
                })
            });
        }

        carregarFeed();
    } catch (erro) {
        console.error("Erro ao curtir:", erro);
    }
}

function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}
const imagemInput = document.getElementById("post-imagem");
const imagem = imagemInput.value.trim();

// Dentro do fetch POST:
body: JSON.stringify({
    id_usuario: usuarioLogado.id_usuario,
    conteudo: conteudo,
    imagem: imagem || null
})

imagemInput.value = "R10.jpg";