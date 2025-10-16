//Transição entre a tela de login/cadastro

let card = document.querySelector(".card")
let loginButton = document.querySelector(".loginButton")
let cadastroButton = document.querySelector(".cadastroButton")

loginButton.onclick = () => {
  card.classList.remove("cadastroActive")
  card.classList.add("loginActive")
}

cadastroButton.onclick = () => {
  card.classList.remove("loginActive")
  card.classList.add("cadastroActive")
}

let usuarioLogado = null;// define global

//Function para criar login
function criarLoginHandler(urlLogin) {
  return function ativarLogin() {
    const formLogin = document.getElementById("form-login");
    if (!formLogin) return;

    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Formulário enviado");

      const email = formLogin["login-username"].value.trim();
      const senha = formLogin["login-password"].value;

      fetch(urlLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "login-username": email,
          "login-password": senha,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.mensagem === "Login realizado com sucesso") {
            usuarioLogado = data.usuario;
            //// Salva no localStorage para acesso em outras páginas
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado)); 
            localStorage.setItem("instituicaoNome", usuarioLogado.nome);
            localStorage.setItem("tipoUsuario", usuarioLogado.tipo);


            alert(`Bem-vindo(a), ${usuarioLogado.nome}!`);
            aposLogin (); //chama aposLogin após definir usuarioLogado
            formLogin.reset();
            // Chame aqui qualquer função que você queira após login
            // Exemplo: aposLogin();
          } else {
            alert(data.mensagem || "Erro ao realizar login.");
          }
        })
        .catch((error) => {
          console.error("Erro ao realizar login:", error);
          alert("Erro ao conectar com o servidor.");
        });
    });
  };
}

// Factory para criar handler de registro
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

      console.log("Username:", nome);
      console.log("Email:", email);
      console.log("Password:", senha);
      console.log("Role:", tipo);

      // Verificando se algum campo está vazio
      if (!nome || !email || !senha || !tipo) {
        alert("Preencha todos os campos.");
        return;
      }

      fetch(urlRegistro, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          tipo,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.mensagem);
          if (data.sucesso) {
            formRegister.reset();
            mostrarSecao("login"); // só funciona se você tiver essa função definida no seu script
          }
        })
        .catch((error) => {
          console.error("Erro ao registrar usuário:", error);
          alert("Erro ao registrar usuário.");
        });
    });
  };
}

// -----------------------
  // Após login
  
      function aposLogin() {
  if (typeof btnLogin !== "undefined" && btnLogin) btnLogin.style.display = "none";
  if (typeof btnRegister !== "undefined" && btnRegister) btnRegister.style.display = "none";
  if (typeof btnLogout !== "undefined" && btnLogout) btnLogout.style.display = "inline-block";

  if (usuarioLogado.tipo === "instituicao") {
    window.location.href = "instituicao.html";
  } else if (usuarioLogado.tipo === "aluno") {
    window.location.href = "/aluno/aluno.html";
  } else if (usuarioLogado.tipo === "mentor") {
    window.location.href = "/mentor/mentor.html"
  }
}
//Tive que modificar essa function pois como esse botões não existem no login.html, tava quebrando antes de redirecionar pra outra página.

// Factory para cadastrar projetos direto no Banco de Dados.
function criarCadastroProjetoHandler(urlRegistroProjeto) {
  return function ativarCadastroProjeto() {
    const form = document.getElementById("form-projetos");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const titulo = form.titulo.value.trim();
      const descricao = form.descricao.value.trim();
      const data_inicio = form.data_inicio.value.trim();
      const data_termino = form.data_termino.value.trim();

      // Campos fixos (exemplo: status e datas para teste)
      const status = "Em andamento";
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")); // Dados do usuário que foram salvos no LocalStorage ao logar.
      const id_universidade = usuarioLogado.id; // Adiciona o Id do usuário para associa-lo a criação do projeto. 

      // Validação
      if (!titulo || !status || !descricao || !data_inicio || !data_termino || !id_universidade) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }

      fetch(urlRegistroProjeto, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          descricao,
          status,
          data_inicio,
          data_termino,
          id_universidade,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.mensagem || "Projeto cadastrado.");
          form.reset();
        })
        .catch((error) => {
          console.error("Erro ao cadastrar projeto:", error);
          alert("Erro ao conectar com o servidor.");
        });
    });
  };
}

// Function para carregar os projetos
function carregarProjetos() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const usuarioId = usuarioLogado?.id;

  // Verifica se o usuário está logado e tem um ID
  if (!usuarioId) {
    console.error('Erro: Usuário não logado ou ID não encontrado.');
    alert('Por favor, faça login novamente.');
    window.location.href = 'login.html';
    return;
  }

  fetch('http://localhost:3000/api/projetos')
    .then(res => {
      if (!res.ok) {
        throw new Error('Erro ao buscar projetos: ' + res.status);
      }
      return res.json();
    })
    .then(projetos => {
      const tabela = document.getElementById('tabela-projetos');
      tabela.innerHTML = ''; // Limpa a tabela

      // Filtra os projetos para exibir apenas os que têm id_universidade igual ao id do usuário
      const projetosFiltrados = projetos.filter(p => p.id_universidade === usuarioId);

      if (projetosFiltrados.length === 0) {
        tabela.innerHTML = `<tr><td colspan="6">Nenhum projeto encontrado para sua universidade.</td></tr>`;
        return;
      }

      projetosFiltrados.forEach(p => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${p.id}</td>
          <td>${p.titulo}</td>
          <td>${p.descricao}</td>
          <td>${p.status}</td>
          <td>${new Date(p.data_inicio).toLocaleDateString()}</td>
          <td>${new Date(p.data_termino).toLocaleDateString()}</td>
        `;
        tabela.appendChild(linha);
      });
    })
    .catch(erro => {
      console.error('Erro ao buscar projetos:', erro);
      alert('Erro ao carregar projetos. Tente novamente.');
    });
}

function carregarAlunos() {
  fetch('http://localhost:3000/api/users') // ajuste a rota se necessário
    .then(response => response.json())
    .then(usuarios => {
      const tabela = document.getElementById('corpo-tabela-alunos');
      tabela.innerHTML = ''; // limpa a tabela antes de inserir

      // Filtra apenas os usuários do tipo aluno
      const alunos = usuarios.filter(usuario => usuario.tipo === 'aluno');

      alunos.forEach(aluno => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${aluno.id}</td>
          <td>${aluno.nome}</td>
          <td>${aluno.email}</td>
        `;
        tabela.appendChild(linha);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar alunos:', error);
    });
}

function atualizarPainelResumo() {
  // Atualiza contagem de alunos
  fetch('http://localhost:3000/api/users')
    .then(res => res.json())
    .then(usuarios => {
      const alunos = usuarios.filter(u => u.tipo === 'aluno');
      document.getElementById('count-alunos').textContent = alunos.length;

      if (alunos.length > 0) {
        const ultimoAluno = alunos[alunos.length - 1];
        const nome = ultimoAluno.nome;
        const data = new Date().toLocaleDateString(); // ou usar campo de data se tiver
        document.getElementById('last-cadastro').textContent = `${nome} - ${data}`;
      } else {
        document.getElementById('last-cadastro').textContent = 'Nenhum aluno cadastrado';
      }
    })
    .catch(err => console.error('Erro ao buscar usuários:', err));

  // Atualiza contagem de projetos
  fetch('http://localhost:3000/api/projetos')
    .then(res => res.json())
    .then(projetos => {
      document.getElementById('count-projetos').textContent = projetos.length;
    })
    .catch(err => console.error('Erro ao buscar projetos:', err));
}

function mostrarSecao(secaoId) {
  const secoes = document.querySelectorAll('.secao-dashboard');
  secoes.forEach(secao => secao.classList.remove('active'));

  const secaoSelecionada = document.getElementById(secaoId);
  secaoSelecionada?.classList.add('active');

  if (secaoId === 'listar-projetos') {
    carregarProjetos();
  }

  if (secaoId === 'usuarios') {
    carregarAlunos();
  }

  if (secaoId === 'painel') {
    atualizarPainelResumo(); // <- chama a função ao abrir o painel
  }

 if (secaoId === 'solicitacoes') {
    const carregarSolicitacoes = criarCarregadorSolicitacoes("https://ponte-para-o-futuro-production.up.railway.app/api/solicitacoes/pendentes");
    const responderSolicitacao = criarResponderSolicitacao("https://ponte-para-o-futuro-production.up.railway.app/api/solicitacoes");
    carregarSolicitacoes(responderSolicitacao); // <- chama ao abrir a seção de solicitações
  }

}

document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  const previewImg = document.getElementById('previewImg');

  if (previewImg) {
    if (usuario && usuario.fotoPerfil) {
      previewImg.src = `/uploads/${usuario.fotoPerfil}`;
    } else {
      previewImg.src = 'caminho/atual.jpg'; // foto padrão
    }
  }
});

//script para calendário na página mentoria.aluno
const calendar = document.getElementById('calendar');
if (calendar) {
  const diasDoMes = 30; // Exemplo de mês com 30 dias
  let selecionado = null;

  for (let i = 1; i <= diasDoMes; i++) {
    const dia = document.createElement('div');
    dia.textContent = i;
    dia.addEventListener('click', () => {
      if (selecionado) {
        selecionado.classList.remove('selecionado');
      }
      dia.classList.add('selecionado');
      selecionado = dia;
      alert(`Você selecionou o dia ${i} para agendar uma reunião.`);
    });
    calendar.appendChild(dia);
  }
}
// Factory para carregar e exibir a tabela de solicitações
function criarCarregadorSolicitacoes(apiUrl) {
  return function carregarSolicitacoes(responderFunc) {
    fetch(apiUrl)
      .then(res => res.json())
      .then(solicitacoes => {
        const tabela = document.getElementById("tabela-solicitacoes");
        tabela.innerHTML = "";

        solicitacoes.forEach(s => {
          const linha = document.createElement("tr");
          linha.innerHTML = `
            <td>${s.nome_aluno}</td>
            <td>${s.titulo_projeto}</td>
            <td>${s.status}</td>
            <td><button class="btn-responder" data-id="${s.id}" data-aluno="${s.nome_aluno}" data-projeto="${s.titulo_projeto}">Responder</button></td>
          `;
          tabela.appendChild(linha);
        });

        document.querySelectorAll(".btn-responder").forEach(btn => {
          btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const aluno = btn.dataset.aluno;
            const projeto = btn.dataset.projeto;

            document.getElementById("aluno-nome").textContent = aluno;
            document.getElementById("projeto-titulo").textContent = projeto;
            document.getElementById("resposta-solicitacao").style.display = "block";

            document.getElementById("btn-aprovar").onclick = () => {
              const msg = document.getElementById("mensagem-resposta").value;
              responderFunc(id, "aprovado", msg, carregarSolicitacoes(responderFunc));
            };

            document.getElementById("btn-negar").onclick = () => {
              const msg = document.getElementById("mensagem-resposta").value;
              responderFunc(id, "negado", msg, carregarSolicitacoes(responderFunc));
            };
          });
        });
      })
      .catch(erro => {
        console.error("Erro ao carregar solicitações:", erro);
      });
  };
}

// Factory para responder (PUT) uma solicitação
function criarResponderSolicitacao(baseUrl) {
  return function responderSolicitacao(id, status, mensagem, callbackRecarregar) {
    fetch(`${baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, mensagem }),
    })
      .then(res => res.json())
      .then(() => {
        alert(`Solicitação ${status === "aprovado" ? "aprovada" : "negada"} com sucesso!`);
        document.getElementById("resposta-solicitacao").style.display = "none";
        document.getElementById("mensagem-resposta").value = "";
        callbackRecarregar(); // recarrega a tabela
      })
      .catch(erro => {
        console.error("Erro ao enviar resposta:", erro);
      });
  };
}

document.addEventListener("DOMContentLoaded", () => {

 const ativarLogin = criarLoginHandler("http://localhost:3000/api/users/login"); 
 ativarLogin();

 const ativarRegistro = criarRegistroHandler("http://localhost:3000/api/users");
  ativarRegistro();

 const ativarCadastroProjeto = criarCadastroProjetoHandler("http://localhost:3000/api/projetos");
  ativarCadastroProjeto();

 const carregarSolicitacoes = criarCarregadorSolicitacoes("http://localhost:3000/api/solicitacoes/pendentes");
 const responderSolicitacao = criarResponderSolicitacao("http://localhost:3000/api/solicitacoes");

  carregarSolicitacoes(responderSolicitacao); // carrega ao iniciar
});