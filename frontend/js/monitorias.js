const usuario = JSON.parse(sessionStorage.getItem('usuario'));

if (!usuario) {
  alert('Você precisa estar logado para acessar as monitorias.');
  window.location.href = 'login.html';
} else {
  const lista = document.getElementById('listaMonitorias');
  const botaoCriarMonitoria = document.getElementById('linkCriarMonitoria');
  const btnSair = document.getElementById('btnSair');
  const usuarioLogado = document.getElementById('usuarioLogado');

usuarioLogado.textContent = `Olá, ${usuario.nome} (${usuario.tipo_usuario})`;

  btnSair.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'login.html';
  });

  if (usuario.tipo_usuario !== 'monitor') {
    botaoCriarMonitoria.style.display = 'none';
  }

  async function carregarInscricoesDoAluno() {
    if (usuario.tipo_usuario !== 'aluno') {
      return [];
    }

    const resposta = await fetch(`http://localhost:3000/inscricoes/aluno/${usuario.id}`);
    const inscricoes = await resposta.json();

    return inscricoes.map((inscricao) => inscricao.id_monitoria);
  }

  async function carregarMonitorias() {
    try {
      const resposta = await fetch('http://localhost:3000/monitorias');
      const monitorias = await resposta.json();

      const inscricoesDoAluno = await carregarInscricoesDoAluno();

      lista.innerHTML = '';

      if (monitorias.length === 0) {
        lista.innerHTML = '<li>Nenhuma monitoria cadastrada.</li>';
        return;
      }

      monitorias.forEach((monitoria) => {
        const item = document.createElement('li');
        item.classList.add('monitoria-card');

        const dataFormatada = new Date(monitoria.data).toLocaleDateString('pt-BR');
        const alunoInscrito = inscricoesDoAluno.includes(monitoria.id);

        item.innerHTML = `
          <h3>${monitoria.disciplina}</h3>
          <p><strong>Monitor:</strong> ${monitoria.monitor}</p>
          <p><strong>Data:</strong> ${dataFormatada}</p>
          <p><strong>Horário:</strong> ${monitoria.hora_inicio.slice(0, 5)} às ${monitoria.hora_fim.slice(0, 5)}</p>
          <p><strong>Modalidade:</strong> ${monitoria.modalidade}</p>
          <p><strong>Local:</strong> ${monitoria.local_ou_link}</p>
        `;

        if (usuario.tipo_usuario === 'aluno') {
          const botaoInscricao = document.createElement('button');

          if (alunoInscrito) {
            botaoInscricao.textContent = 'Cancelar inscrição';
            botaoInscricao.classList.add('btn-cancelar-inscricao');

            botaoInscricao.addEventListener('click', () => {
              cancelarInscricao(monitoria.id);
            });
          } else {
            botaoInscricao.textContent = 'Inscrever-se';
            botaoInscricao.classList.add('btn-inscricao');

            botaoInscricao.addEventListener('click', () => {
              realizarInscricao(monitoria.id);
            });
          }

          item.appendChild(botaoInscricao);
        }

        lista.appendChild(item);
      });
    } catch (erro) {
      console.error('Erro ao carregar monitorias:', erro);
      lista.innerHTML = '<li>Erro ao carregar monitorias.</li>';
    }
  }

  async function realizarInscricao(idMonitoria) {
    try {
      const resposta = await fetch('http://localhost:3000/inscricoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_aluno: usuario.id,
          id_monitoria: idMonitoria
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro || 'Erro ao realizar inscrição.');
        return;
      }

      alert('Inscrição realizada com sucesso!');
      carregarMonitorias();
    } catch (erro) {
      console.error('Erro ao realizar inscrição:', erro);
      alert('Erro ao conectar com o servidor.');
    }
  }

  async function cancelarInscricao(idMonitoria) {
    try {
      const resposta = await fetch('http://localhost:3000/inscricoes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_aluno: usuario.id,
          id_monitoria: idMonitoria
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro || 'Erro ao cancelar inscrição.');
        return;
      }

      alert('Inscrição cancelada com sucesso!');
      carregarMonitorias();
    } catch (erro) {
      console.error('Erro ao cancelar inscrição:', erro);
      alert('Erro ao conectar com o servidor.');
    }
  }

  carregarMonitorias();
}