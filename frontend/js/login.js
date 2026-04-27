const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!email || !senha) {
    alert('Preencha email e senha.');
    return;
  }

  const login = {
    email,
    senha
  };

  try {
    const resposta = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(login)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || 'Erro ao fazer login.');
      return;
    }

    sessionStorage.setItem('usuario', JSON.stringify(dados.usuario));

    alert('Login realizado com sucesso!');
    window.location.href = 'monitorias.html';

  } catch (erro) {
    console.error('Erro no login:', erro);
    alert('Erro ao conectar com o servidor.');
  }
});