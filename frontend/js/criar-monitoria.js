const form = document.getElementById('monitoriaForm');
const disciplinaSelect = document.getElementById('disciplina');

const usuario = JSON.parse(sessionStorage.getItem('usuario'));

if (!usuario) {
  alert('Você precisa estar logado para criar uma monitoria.');
  window.location.href = 'login.html';
} else if (usuario.tipo_usuario !== 'monitor') {
  alert('Apenas monitores podem criar monitorias.');
  window.location.href = 'monitorias.html';
}

async function carregarDisciplinas() {
  try {
    const resposta = await fetch('http://localhost:3000/disciplinas');
    const disciplinas = await resposta.json();

    disciplinas.forEach((disciplina) => {
      const option = document.createElement('option');
      option.value = disciplina.id;
      option.textContent = `${disciplina.nome} (${disciplina.codigo})`;
      disciplinaSelect.appendChild(option);
    });
  } catch (erro) {
    console.error('Erro ao carregar disciplinas:', erro);
    alert('Erro ao carregar disciplinas.');
  }
}

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const usuario = JSON.parse(sessionStorage.getItem('usuario'));

  if (!usuario) {
    alert('Você precisa estar logado para criar uma monitoria.');
    window.location.href = 'login.html';
    return;
  }

  const monitoria = {
    id_monitor: usuario.id,
    id_disciplina: disciplinaSelect.value,
    data: document.getElementById('data').value,
    hora_inicio: document.getElementById('horaInicio').value,
    hora_fim: document.getElementById('horaFim').value,
    modalidade: document.getElementById('modalidade').value,
    local_ou_link: document.getElementById('local').value.trim()
  };

  if (
    !monitoria.id_disciplina ||
    !monitoria.data ||
    !monitoria.hora_inicio ||
    !monitoria.hora_fim ||
    !monitoria.modalidade ||
    !monitoria.local_ou_link
  ) {
    alert('Preencha todos os campos.');
    return;
  }

  try {
    const resposta = await fetch('http://localhost:3000/monitorias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(monitoria)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || 'Erro ao criar monitoria.');
      return;
    }

    alert('Monitoria criada com sucesso!');
    window.location.href = 'monitorias.html';

  } catch (erro) {
    console.error('Erro ao criar monitoria:', erro);
    alert('Erro ao conectar com o servidor.');
  }
});

carregarDisciplinas();  