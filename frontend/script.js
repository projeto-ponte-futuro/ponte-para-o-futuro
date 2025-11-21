// Arquivo script.js corrigido

// ====== TRANSIÇÃO ENTRE LOGIN/CADASTRO ======
let card = document.querySelector(".card");
let loginButton = document.querySelector(".loginButton");
let cadastroButton = document.querySelector(".cadastroButton");

if (loginButton && cadastroButton && card) {
  loginButton.onclick = () => {
    card.classList.remove("cadastroActive");
    card.classList.add("loginActive");
  };

  cadastroButton.onclick = () => {
    card.classList.remove("loginActive");
    card.classList.add("cadastroActive");
  };
}

let usuarioLogado = null;

// ====== LOGIN ======
function criarLoginHandler(urlLogin) {
  return function ativarLogin() {
    const formLogin = document.getElementById("form-login");
    if (!formLogin) return;

    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = formLogin.querySelector('[name="login-username"]').value.trim();
      const senha = formLogin.querySelector('[name="login-password"]').value.trim();

      if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
      }

      fetch(urlLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.sucesso) {
            usuarioLogado = data.usuario;

            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
            localStorage.setItem("tipoUsuario", usuarioLogado.tipo);
            localStorage.setItem("instituicaoNome", usuarioLogado.nome || "Instituição");

            aposLogin();
          } else {
            alert(data.mensagem || "Erro ao fazer login.");
          }
        })
        .catch((err) => {
          console.error("Erro no login:", err);
        });
    });
  };
}

// ====== REGISTRO ======
function criarRegistroHandler(urlRegistro) {
  return function ativarRegistro() {
    const formRegister = document.getElementById("form-register");
    if (!formRegister) return;

    formRegister.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = formRegister["register-username"].value.trim();
      const email = formRegister["register-email"].value.trim();
      const senha = formRegister["register-password"].value.trim();
      const tipo = formRegister["register-role"].value.trim();

      if (!nome || !email || !senha || !tipo) {
        alert("Preencha todos os campos.");
        return;
      }

      fetch(urlRegistro, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, tipo }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.mensagem);
          if (data.sucesso) formRegister.reset();
        })
        .catch((err) => console.error("Erro ao registrar:", err));
    });
  };
}

// ====== APÓS LOGIN ======
function aposLogin() {
  if (!usuarioLogado) return;

  switch (usuarioLogado.tipo) {
    case "instituicao":
      window.location.href = "instituicao.html";
      break;
    case "aluno":
      window.location.href = "aluno/aluno.html";
      break;
    case "mentor":
      window.location.href = "mentor/mentor.html";
      break;
    default:
      alert("Tipo de usuário desconhecido.");
  }
}

// ====== CADASTRAR PROJETO ======
function criarCadastroProjetoHandler(urlRegistroProjeto) {
  return function ativarCadastroProjeto() {
    const form = document.getElementById("form-projetos");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
      if (!usuario) return alert("Faça login novamente.");

      const dados = {
        titulo: form.titulo.value.trim(),
        descricao: form.descricao.value.trim(),
        data_inicio: form.data_inicio.value.trim(),
        data_termino: form.data_termino.value.trim(),
        status: "Em andamento",
        id_universidade: usuario.id,
      };

      if (!dados.titulo || !dados.descricao) {
        alert("Preencha todos os campos.");
        return;
      }

      fetch(urlRegistroProjeto, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      })
        .then((res) => res.json())
        .then((data) => alert(data.mensagem))
        .catch((err) => console.error("Erro ao cadastrar projeto:", err));
    });
  };
}

// ====== CARREGAR PROJETOS ======
function carregarProjetos() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  fetch("http://localhost:3000/api/projetos")
    .then((res) => res.json())
    .then((lista) => {
      const tabela = document.getElementById("tabela-projetos");
      if (!tabela) return;

      tabela.innerHTML = "";

      const meus = lista.filter((p) => p.id_universidade === usuario.id);

      if (meus.length === 0) {
        tabela.innerHTML = `<tr><td colspan="6">Nenhum projeto encontrado.</td></tr>`;
        return;
      }

      meus.forEach((p) => {
        tabela.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td>${p.titulo}</td>
          <td>${p.descricao}</td>
          <td>${p.status}</td>
          <td>${new Date(p.data_inicio).toLocaleDateString()}</td>
          <td>${new Date(p.data_termino).toLocaleDateString()}</td>
        </tr>`;
      });
    });
}

// ====== MOSTRAR SEÇÃO ======
function mostrarSecao(secaoId) {
  document.querySelectorAll('.secao-dashboard').forEach(s => s.classList.remove('active'));

  const secao = document.getElementById(secaoId);
  if (secao) secao.classList.add('active');

  if (secaoId === "listar-projetos") carregarProjetos();
  if (secaoId === "usuarios") carregarAlunos();
  if (secaoId === "painel") atualizarPainelResumo();
}

// ====== INICIALIZAÇÃO GERAL ======
document.addEventListener("DOMContentLoaded", () => {

  const ativarLogin = criarLoginHandler("http://localhost:3000/api/users/login");
  ativarLogin();

  const ativarRegistro = criarRegistroHandler("http://localhost:3000/api/users");
  ativarRegistro();

  const ativarCadastroProjeto = criarCadastroProjetoHandler("http://localhost:3000/api/projetos");
  ativarCadastroProjeto();

});