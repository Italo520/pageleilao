# PWA: Captura, Upload e Exclusão de Fotos no ERP

Este guia foca especificamente no desenvolvimento front-end (PWA) de como interagir com a câmera do dispositivo, converter o arquivo resultante para o formato Base64 e gerenciar o upload/exclusão na API do ERP.

---

## 1. Captura da Foto (HTML5 + PWA)

No escopo de Progressive Web Apps, a forma nativa mais simples de acessar a câmera do celular é utilizando a tag padrão `<input>` do HTML com atributos específicos:

```html
<!-- O atributo 'capture="environment"' tenta abrir a câmera traseira do celular -->
<!-- O atributo 'accept="image/*"' restringe para selecionar apenas fotos -->
<input type="file" id="inputCamera" accept="image/*" capture="environment" />
```

Quando o usuário toca nesse botão no celular, o sistema operacional abre o aplicativo da câmera para que a foto seja tirada, ou a galeria (fallback).

---

## 2. Conversão da Foto para Base64 (JavaScript)

Assim que o usuário tira a foto e confirma, precisamos ler o arquivo na memória do navegador e convertê-lo em uma string `Base64`. Isso é feito usando a API nativa `FileReader`.

### Função JavaScript:
```javascript
/**
 * Lê um objeto File e retorna uma Promise que resolve com a string Base64.
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Quando terminar de ler o arquivo com sucesso
    reader.onload = () => {
      resolve(reader.result); // Resultado será algo como: "data:image/jpeg;base64,/9j/4AAQSn..."
    };

    // Caso ocorra algum problema de leitura
    reader.onerror = (error) => reject(error);

    // Inicia a leitura do arquivo em formato Data URL (Base64 + MIME type)
    reader.readAsDataURL(file);
  });
}
```

---

## 3. Realizando o Upload para a API

Agora, unimos o HTML e a função de conversão para processar o clique, converter o dado e engatilhar o fetch de upload (`POST`).

```javascript
document.getElementById('inputCamera').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  
  if (!file) return; // Se o usuário cancelou a câmera

  try {
    // 1. Converter a foto em String Base64
    const base64String = await fileToBase64(file);
    
    // Configurações do Leilão
    const idBem = 37557; // Pego dinamicamente da sua tela
    const urlUpload = `https://api.suporteleiloes.com.br/api/bens/${idBem}/arquivos`;

    // 2. Montar o payload requerido pelo ERP
    const payload = {
      data: base64String,
      filename: `foto_${Date.now()}.jpg`, // Gera um nome único para o arquivo
      tipo: 1, // '1' usualmente se refere a fotos para a galeria pública do lote
      permissao: 0,
      file: {}, // Conforme documentação, enviar objeto vazio
      done: true,
      copying: false,
      progress: 100,
      fail: false,
      success: true
    };

    // 3. Fazer a requisição HTTP POST
    const response = await fetch(urlUpload, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SEU_TOKEN_AQUI'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Foto enviada com sucesso!");
      // IMPORTANTE: Opcional, mas você deve atualizar sua lista de imagens com o JSON retornado (que conterá o ID da imagem gerada)
    } else {
      alert("Falha no upload");
    }

  } catch (error) {
    console.error("Erro no processamento da imagem", error);
  }
});
```

---

## 4. Como Excluir uma Foto

Para excluir, você precisa saber não apenas o ID do bem (veículo/sucata), mas também o **ID Único do Arquivo (Foto)** que foi atribuído pelo banco de dados do ERP (no parametro que mapeamos: `{id2}`).

### Obtendo o ID da Foto
Para saber quais são os IDs das fotos salvas em um determinado bem, você deverá olhar os dados que vem da rota de obter detalhes do leilão ou do bem (`GET /api/bens/{id}`).
Ela retorna um array no campo `"arquivos"`. Cada imagem virá em um formato semelhante a este:

```json
{
  "id": 784160,          // <-- ESSE É O {id2} NECESSÁRIO PARA A EXCLUSÃO
  "nome": "IMG_2026.jpg",
  "url": "https://..."
}
```

### Código para Deletar a Imagem (JavaScript)

Ao renderizar a grade de fotos na tela do PWA, suponhamos que você coloque um ícone de lixeira (🗑️) em cada uma, com uma ação contendo o `idFile` (no caso, 784160).

```javascript
/**
 * Deleta a foto de um bem usando o Endpoint: DELETE /api/bens/{id}/arquivos/{id2}
 * @param {number} idBem - O ID numérico do carro/imóvel/etc
 * @param {number} idArquivo - O ID específico do arquivo a ser excluído
 */
async function excluirFotoBem(idBem, idArquivo) {
  // Exibindo alerta de confirmação no PWA (boa prática)
  const isConfirmed = confirm("Tem certeza que deseja apagar essa foto permanentemente?");
  if (!isConfirmed) return;

  const urlDelete = `https://api.suporteleiloes.com.br/api/bens/${idBem}/arquivos/${idArquivo}`;

  try {
    const response = await fetch(urlDelete, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SEU_TOKEN_AQUI'
      }
    });

    if (response.ok) {
      alert("Apagado com sucesso!");
      // Aqui você removeria visualmente a foto da DOM (div da UI) para refletir a mudança
    } else {
      alert("Falha ao apagar: " + response.statusText);
    }
  } catch (error) {
    console.error("Erro na request HTTP", error);
  }
}
```
