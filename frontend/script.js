// =======================================
//     TRANSIÇÃO ENTRE LOGIN/CADASTRO
// =======================================
const card = document.querySelector(".card");
const loginButton = document.querySelector(".loginButton");
const cadastroButton = document.querySelector(".cadastroButton");

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


// =======================================
//                LOGIN
// =======================================
function criarLoginHandler(urlLogin) {
  return function ativarLogin() {
    const formLogin = document.getElementById("form-login");
    if (!formLogin) return;

    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = formLogin["login-username"].value.trim();
      const senha = formLogin["login-password"].value.trim();

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
          if (!data.sucesso) return alert(data.mensagem);

          usuarioLogado = data.usuario;

          localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
          localStorage.setItem("tipoUsuario", usuarioLogado.tipo);
          localStorage.setItem("instituicaoNome", usuarioLogado.nome);

          aposLogin();
        })
        .catch((err) => console.error("Erro no login:", err));
    });
  };
}


// =======================================
//                REGISTRO
// =======================================
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


// =======================================
//         REDIRECIONAR APÓS LOGIN
// =======================================
function aposLogin() {
  if (!usuarioLogado) return;

  const rotas = {
    instituicao: "instituicao.html",
    aluno: "aluno/aluno.html",
    mentor: "mentor/mentor.html"
  };

  window.location.href = rotas[usuarioLogado.tipo] || "login.html";
}


// =======================================
//         CADASTRAR PROJETOS
// =======================================
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
        data_inicio: form.data_inicio.value,
        data_termino: form.data_termino.value,
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
        .then((data) => {
          alert(data.mensagem);
          form.reset();
        })
        .catch((err) => console.error("Erro ao cadastrar projeto:", err));
    });
  };
}


// =======================================
//            CARREGAR PROJETOS
// =======================================
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
        tabela.innerHTML = `<tr><td colspan="7">Nenhum projeto encontrado.</td></tr>`;
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

          <td>
            <button class="btn-acao btn-editar" onclick="editarProjeto(${p.id})">
              Editar
            </button>

            <button class="btn-acao btn-excluir" onclick="excluirProjeto(${p.id})">
              Excluir
            </button>
          </td>
        </tr>`;
      });
    });
}


// =======================================
//            EDITAR PROJETO
// =======================================
function editarProjeto(id) {
  console.log("Abrindo modal para edição do projeto", id); // DEBUG

  // Abre o modal
  const modal = document.getElementById("modal-editar");
  modal.classList.remove("hidden");

  // Busca os dados do projeto
  fetch(`http://localhost:3000/api/projetos/${id}`)
    .then(res => res.json())
    .then(p => {
      // Preenche os campos
      document.getElementById("editId").value = p.id;
      document.getElementById("editTitulo").value = p.titulo;
      document.getElementById("editDescricao").value = p.descricao;
      document.getElementById("editStatus").value = p.status;
      document.getElementById("editDataInicio").value = p.data_inicio?.split("T")[0];
      document.getElementById("editDataTermino").value = p.data_termino?.split("T")[0];
    })
    .catch(err => console.error("Erro ao carregar dados:", err));
}

//          SALVAR EDIÇÃO DE PROJETO (PUT)
// =======================================
function salvarEdicao() {
  const id = document.getElementById("editId").value;

  const dados = {
    titulo: document.getElementById("editTitulo").value,
    descricao: document.getElementById("editDescricao").value,
    status: document.getElementById("editStatus").value,
    data_inicio: document.getElementById("editDataInicio").value,
    data_termino: document.getElementById("editDataTermino").value
  };
  

  fetch(`http://localhost:3000/api/projetos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  })
    .then(res => res.json())
    .then(() => {
      console.log("OBJETO RECEBIDO DO BACKEND:", p);
      alert("Projeto atualizado!");
      fecharModal();
      carregarProjetos();
    })
    .catch(() => alert("Erro ao atualizar"));
}


// =======================================
//          EXCLUIR PROJETO
// =======================================
function excluirProjeto(id) {
  if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

   console.log("ID ENVIADO NO PUT:", id);

  fetch(`http://localhost:3000/api/projetos/${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error();
      alert("Projeto excluído com sucesso!");
      carregarProjetos();
    })
    .catch(() => alert("Erro ao excluir."));
}


// =======================================
//           FECHAR MODAL
// =======================================
function fecharModal() {
  document.getElementById("modal-editar").classList.add("hidden");
}


// =======================================
//            MUDAR SEÇÕES
// =======================================
function mostrarSecao(secaoId) {
  document.querySelectorAll(".secao-dashboard")
    .forEach(s => s.classList.remove("active"));

  const secao = document.getElementById(secaoId);
  if (secao) secao.classList.add("active");

  if (secaoId === "listar-projetos") carregarProjetos();
  if (secaoId === "usuarios") carregarAlunos();
  if (secaoId === "solicitacoes") carregarSolicitacoes();
}


// =======================================
//        CARREGAR ALUNOS
// =======================================
function carregarAlunos() {
  const tabela = document.getElementById("listaAlunos");
  if (!tabela) return;

  fetch("http://localhost:3000/api/users")
    .then(res => res.json())
    .then(lista => {
      tabela.innerHTML = "";

      const alunos = lista.filter(u => u.tipo === "aluno");

      if (alunos.length === 0) {
        tabela.innerHTML = `<tr><td colspan="3">Nenhum aluno encontrado.</td></tr>`;
        return;
      }

      alunos.forEach((a) => {
        tabela.innerHTML += `
        <tr>
          <td>${a.id}</td>
          <td>${a.nome}</td>
          <td>${a.email}</td>
        </tr>`;
      });
    });
}


// =======================================
//        CARREGAR SOLICITAÇÕES
// =======================================
function carregarSolicitacoes() {
  const tabela = document.getElementById("tabela-solicitacoes");
  if (!tabela) return;

  fetch("http://localhost:3000/api/solicitacoes")
    .then((res) => res.json())
    .then((lista) => {
      tabela.innerHTML = "";

      if (!lista || lista.length === 0) {
        tabela.innerHTML = `<tr><td colspan="4">Nenhuma solicitação pendente.</td></tr>`;
        return;
      }

      lista.forEach((s) => {
        tabela.innerHTML += `
        <tr>
          <td>${s.nome_aluno}</td>
          <td>${s.titulo_projeto}</td>
          <td>${s.status}</td>
          <td>
            <button onclick="abrirResposta(${s.id}, '${s.nome_aluno}', '${s.titulo_projeto}')">
              Responder
            </button>
          </td>
        </tr>`;
      });
    });
}

/* ===========================
   ATUALIZAR TABELA
=========================== */
function atualizarTabela() {
  lista.innerHTML = "";
  alunos.forEach((aluno) => {
    lista.innerHTML += `
      <tr>
        <td>${aluno.id}</td>
        <td>${aluno.nome}</td>
        <td>${aluno.email}</td>
        <td>${aluno.curso || "-"}</td>
        <td>
          <button class="btn-acao editar" onclick="editar(${aluno.id})">Editar</button>
          <button class="btn-acao excluir" onclick="remover(${aluno.id})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

// =======================================
//        INICIALIZAÇÃO GLOBAL
// =======================================
document.addEventListener("DOMContentLoaded", () => {
  criarLoginHandler("http://localhost:3000/api/users/login")();
  criarRegistroHandler("http://localhost:3000/api/users")();
  criarCadastroProjetoHandler("http://localhost:3000/api/projetos")();
});

window.editarProjeto = editarProjeto;
window.salvarEdicao = salvarEdicao;
window.excluirProjeto = excluirProjeto;
window.fecharModal = fecharModal;


