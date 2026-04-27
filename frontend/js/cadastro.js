const cadastroForm = document.getElementById('cadastroForm');

cadastroForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const tipo_usuario = document.getElementById('tipo').value;

  if (!nome || !email || !senha || !tipo_usuario) {
    alert('Preencha todos os campos.');
    return;
  }

  const usuario = {
    nome,
    email,
    senha,
    tipo_usuario
  };

  try {
    const resposta = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || 'Erro ao cadastrar usuário.');
      return;
    }

    alert('Usuário cadastrado com sucesso!');
    window.location.href = 'login.html';

  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    alert('Erro ao conectar com o servidor.');
  }
});     