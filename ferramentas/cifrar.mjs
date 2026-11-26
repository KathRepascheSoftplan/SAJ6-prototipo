// Gera o index.html publicado: uma tela de login com o protótipo cifrado dentro.
//
// Uso (na raiz do repositório):
//   node ferramentas/cifrar.mjs
//
// Lê o protótipo de _fonte/index.html (fora do Git) e a senha de
// %USERPROFILE%\SAJ6-prototipo-senha.txt, ou da variável PROTOTIPO_SENHA.
// O conteúdo é cifrado com AES-256-GCM; a chave sai da senha por PBKDF2-SHA256.
import { readFileSync, writeFileSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ITERACOES = 600_000;

const senha = (process.env.PROTOTIPO_SENHA ?? readFileSync(join(homedir(), 'SAJ6-prototipo-senha.txt'), 'utf8')).trim();
if (senha.length < 12) throw new Error('Senha curta demais (mínimo 12 caracteres).');

const fonte = readFileSync(join(raiz, '_fonte', 'index.html'), 'utf8');
const modelo = readFileSync(join(raiz, 'ferramentas', 'login.template.html'), 'utf8');

const sal = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveKey']);
const chave = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt: sal, iterations: ITERACOES, hash: 'SHA-256' },
  base,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);
const cifrado = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, chave, new TextEncoder().encode(fonte)));

const b64 = (u8) => Buffer.from(u8).toString('base64');
const pacote = JSON.stringify({ v: 1, it: ITERACOES, sal: b64(sal), iv: b64(iv), dados: b64(cifrado) });

const saida = modelo.replace('/*__PACOTE__*/null', () => pacote);
if (saida === modelo) throw new Error('Marcador /*__PACOTE__*/null não encontrado no modelo.');
writeFileSync(join(raiz, 'index.html'), saida);
console.log(`index.html gerado (${(saida.length / 1024).toFixed(0)} KB, protótipo cifrado).`);
