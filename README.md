# Protótipo SAJ6

Protótipo interno da Softplan, de acesso restrito.

## Como abrir

Acesse a URL do GitHub Pages do repositório e entre com seu **e-mail `@softplan.com.br` ou de um Ministério Público
de qualquer UF (`@mp[UF].mp.br`, como `@mpce.mp.br`; o DF usa `@mpdft.mp.br`) e a senha do protótipo**. Peça a senha a quem compartilhou o link.

O protótipo está cifrado dentro da página (AES-256-GCM, chave derivada da senha com PBKDF2-SHA256, 600 mil iterações):
sem a senha, o código publicado não mostra o conteúdo. Depois de entrar, recarregar a aba não pede login de novo; fechar
a aba pede. O e-mail só confere o domínio (a lista de UFs está em `ferramentas/login.template.html`); não há cadastro
de usuários.

## O que o protótipo simula

Painel de Tarefas (visão clássica) com dados fictícios. O menu lateral reproduz o do Painel Judicial: abas A Fazer,
Aguardando e Finalizadas; organizadores e etiquetas que filtram a lista (com o estado "filtrado" quando os dois estão
ativos); grupos recolhíveis; menu recolhido em 44px com cópia flutuante no hover; pesquisar, reordenar e filtrar por
múltiplas etiquetas; criar e editar etiqueta; editar a visão dos responsáveis; menu do sistema (☰) e Minha conta.
Nada é gravado: tudo volta ao estado inicial ao recarregar, menos o menu recolhido e os grupos abertos.

## Design system

A tela de login segue o **Bayon Design System** (`@bayon/commons` 6.0.12): tokens de cor e espaçamento, Input e
Button medidos nos componentes reais, canto reto e sombra só de contorno. A fonte é a Segoe UI no Windows e, fora
dele, a **Selawik** (`fontes/`, SIL OFL 1.1), clone métrico da Segoe UI que o próprio Bayon declara como fallback.

## Como atualizar o protótipo

O conteúdo sem cifra (HTML, prints, patch e a documentação completa) fica só na máquina de quem edita, em `_fonte/`
(ignorada pelo Git). Nada dessa pasta pode ser publicado.

1. Edite `_fonte/index.html`.
2. Gere a página publicada: `node ferramentas/cifrar.mjs` (lê a senha de `%USERPROFILE%\SAJ6-prototipo-senha.txt` ou da
   variável `PROTOTIPO_SENHA`).
3. Faça commit do `index.html` gerado.

Para trocar a senha, mude o arquivo da senha (mínimo 12 caracteres), rode o passo 2 e publique. A senha antiga deixa de
abrir a versão nova.
