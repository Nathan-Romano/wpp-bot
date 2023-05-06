import { create } from 'venom-bot';
import { stages, getStage } from './stages.js';

create({
  session: 'store',
  multidevice: true,
  headless: true,
})
  .then((client) => start(client))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
var clientes = new Array();
let userState = 0;
let pedido = '';
let endereco = '';
let troco = '';
let pagamento = '';
let bairro = '';

function start(client) {
  client.onMessage(async (message) => {
    const welcomeMessage = `Olá ${message.notifyName} 🙋‍♂️! \nBem vindo ao Obadog 🌭. Por favor, selecione uma das opções abaixo: \n\n 1️⃣ - 📝 Ver cardápio 📝\n 2️⃣ - 🗺 Ver localização 🗺\n 3️⃣ - 💭 Falar com um atendente 💭\n 4️⃣ - 🖊 Fazer pedido 🖊\n 5️⃣ - 💲 Pix 💲`;
    let menuDisplayed = false;
    //console.log(message)
    if ((!message.isGroupMsg) && (message.fromMe === false)) {
      var clienteNovo = { tel: message.from, nome: message.notifyName, end: '', bair: ''};
      //clientes.push(clienteNovo);
      const encontrado = clientes.find(element => element.tel === message.from);
      
      if (!encontrado){
        clientes.push(clienteNovo);
        console.log(`1 ${encontrado}`);
        console.log(`Pessoa ${clienteNovo.nome} adicionado.`);
        console.log(`Quantidade de pessoas registradas: ${clientes.length}`);
      }
      //console.log(`cliente ${clienteNovo.nome} telefone: ${clienteNovo.tel}`)
      await client.startTyping(message.from);
      if (userState === 0) { // se o usuário estiver fora do menu
        userState = 1; // atualiza o estado do usuário para dentro do menu
        setTimeout(() => {
          client.sendText(message.from, welcomeMessage);
        }, 1500);
      } else if (userState === 2) {
        pedido = message.body;
        console.log(pedido)
        client.sendText(message.from, 'Seu pedido é para: \n\n 1️⃣ - 🏪 Retirada 🏪 \n 2️⃣ - 🛵💨 Entrega 🛵💨');
        userState = 3; // atualiza o estado do usuário para aguardar opção de retirada ou entrega
      } else if (userState === 3) { // se o usuário está informando a opção de retirada ou entrega
        if (message.body === '2') {
          client.sendText(message.from, 'Por favor, informe seu endereço (rua, número):');
          userState = 4; // atualiza o estado do usuário para aguardar endereço de entrega
        } else if (message.body === '1') {
          client.sendText(message.from, `Pedido para retirada confirmado. Obrigado pela preferência! 20 a 30 minutos paara ficar pronto!\n\n Pedido: ${pedido}`);
          userState = 0;
        } else {
          client.sendText(message.from, 'Opção inválida. Por favor, selecione uma das opções abaixo: \n\n 1️⃣ - Retirada 🏪 \n 2️⃣ - Entrega 🛵💨');
          menuDisplayed = true;
          userState = 3;
        }
      } else if (userState === 4) { // envia para os bairros
        endereco = message.body;
        
        client.sendText(message.from, 'Informe qual bairro:\n\n 1️⃣ - Floresta (R$ 5,00) \n 2️⃣ - Boa Vista (R$ 5,00) \n 3️⃣ - Atiradores (R$ 5,00) \n 4️⃣ - Saguaçu (R$ 5,00) \n 5️⃣ - América (R$ 5,00) \n 6️⃣ - Costa e Silva (R$ 5,00) \n 7️⃣ - Glória (R$ 5,00) \n 8️⃣ - Bucarein (R$ 5,00) \n 9️⃣ - Iririú (R$ 5,00) \n 1️⃣0️⃣ - Anita Garibaldi (R$ 5,00) ');
        //clienteNovo.end = endereco;
        userState = 9;
        //userState = 5;
        console.log(userState)

      } else if (userState === 5) { //forma de pagamento
        console.log('user 5')
        //client.sendText(message.from, 'Nos informe qual sera a forma de pagamento. \n\n 1️⃣ - Cartão de crédito/débito \n  - Dinheiro \n 3️⃣ - Pix');
        if (message.body === '1') {
          client.sendText(message.from, 'Cartão de crédito/débito selecionado.');
          pagamento = 'Cartão de crédito/débito'
          client.sendText(message.from, `Obrigado! Seu pedido será entregue entre 40 e 50 minutos\n\nPedido: ${pedido.toString()} \nEndereço: ${endereco} \nBairro: ${bairro} \nForma de pagamento: ${pagamento}`);
          userState = 0;
        } else if (message.body === '2') {
          client.sendText(message.from, 'Dinheiro selecionado.');
          pagamento = 'Dinheiro';
          client.sendText(message.from, 'Por favor nos informe se precisara de troco. \n\n 1️⃣ - ✔ Sim ✔ \n 2️⃣ - ❌ Não ❌');
          userState = 6;
        } else if (message.body === '3') {
          client.sendText(message.from, 'Pix selecionado.');
          pagamento = 'Pix'
          client.sendImage(message.from, 'src/qr.jpg', 'pix', 'Pix CNPJ');
          client.sendText(message.from, '47.755.195.0001-43');
          client.sendText(message.from, 'Aleir Fernando - Banco: C6');
          client.sendText(message.from, `Obrigado! Seu pedido será entregue entre 40 e 50 minutos\n\nPedido: ${pedido.toString()} \nEndereço: ${endereco} \nBairro: ${bairro} \nForma de pagamento: ${pagamento}`);
          userState = 0;
        }
      } else if (userState === 6) {
        if (message.body === '1') {
          client.sendText(message.from, 'Por favor, informe o valor do troco:');
          userState = 7;
        } else if (message.body === '2') {
          client.sendText(message.from, `Obrigado! Seu pedido será entregue entre 40 e 50 minutos\n\nPedido: ${pedido.toString()} \nEndereço: ${endereco} \nBairro: ${bairro} \nForma de pagamento: ${pagamento}`);
          userState = 0;
        } else {
          client.sendText(message.from, 'Opção inválida. Por favor, selecione uma das opções abaixo: \n\n 1️⃣ - ✔ Sim ✔ \n 2️⃣ - ❌ Não ❌');
          menuDisplayed = true;
          userState = 5;
        }
      } else if (userState === 7) {// troco
        troco = message.body;
        client.sendText(message.from, `Obrigado! Seu pedido será entregue entre 40 e 50 minutos\n\nPedido: ${pedido.toString()} \nEndereço: ${endereco} \nBairro: ${bairro} \nForma de pagamento: ${pagamento} \nTroco para: ${troco}`);
        userState = 0;
      } else if (userState === 8) {
        // console.log(message.body)
        if (message.body === '0') {
          userState = 0;
          setTimeout(() => {
            client.sendText(message.from, 'Atendimento finalizado!!')
          }, 500);
        }
      } else if (userState === 9) { // bairros
        clienteNovo.end = endereco;
        switch (message.body) {
          case '1':
            bairro = 'Floresta'
            break;
          case '2':
            bairro = "Boa Vista";
            break;
          case '3':
            bairro = "Atiradores";
            break;
          case '4':
            bairro = "Saguaçu";
            break;
          case '5':
            bairro = "América";
            break;
          case '6':
            bairro = "Costa e Silva";
            break;
          case '7':
            bairro = "Glória";
            break;
          case '8':
            bairro = "Bucarein";
            break;
          case '9':
            bairro = "Iririú";
            break;
          case '10':
            bairro = "Anita Garibaldi";
            break;
          default:
            bairro = "Bairro não encontrado";

        }
        client.sendText(message.from, `O bairro selecionado foi: ${bairro}`);
        client.sendText(message.from, 'Nos informe qual sera a forma de pagamento. \n\n 1️⃣ - 💳 Cartão de crédito/débito 💳 \n 2️⃣ - 💸 Dinheiro 💸 \n 3️⃣ - 💲 Pix 💲');
        clienteNovo.bair = bairro;
        console.log(`end: ${clienteNovo.end} bairro: ${clienteNovo.bair}`);
        userState = 5;
      } else { // se o usuário já estiver no menu
        const option = message.body;
        switch (option) {
          case '1':
            client.sendImage(message.from, 'src/qr.jpg', 'pix', 'Cardápio Obadog');
            client.sendText(message.from, 'Para voltar ao menu principal, digite 0.');
            userState = 0; // atualiza o estado do usuário para fora do menu
            break;
          case '2':
            //sendLocation(chat);
            client.sendLocation(message.from, '-26.333577722354224', '-48.84772933290814', 'Av. Santa Catarina, 1250 - Floresta, Joinville/SC')
            client.sendText(message.from, 'Para voltar ao menu principal, digite 0.');
            userState = 0; // atualiza o estado do usuário para fora do menu
            break;
          case '3':
            client.sendText(message.from, 'Por favor, aguarde. Em breve um alguém irá atendê-lo.');
            //sendAtendente(chat);
            client.sendText(message.from, 'Para voltar ao menu principal, digite 0.');
            userState = 8;
            // if (message.body === 0) {
            //   userState = 0; // atualiza o estado do usuário para fora do menu
            //   client.sendText(message.from, 'Para voltar ao menu principal, digite 0.');
            // }
            break;
          case '4':
            client.sendText(message.from, 'Por favor, informe seu pedido (exemplo: Bacon sem cebola com adicional de frango) :');
            userState = 2; // atualiza o estado do usuário para aguardar pedido
            break;
          case '5':
            client.sendImage(message.from, 'src/qr.jpg', 'pix', 'Pix CNPJ');
            client.sendText(message.from, '47.755.195.0001-43');
            client.sendText(message.from, 'Aleir Fernando - Banco: C6');
            client.sendText(message.from, 'Para voltar ao menu principal, digite 0.');
            userState = 0;
            break;
          case '0':
            userState = 0; // atualiza o estado do usuário para fora do menu
            client.sendText(message.from, welcomeMessage);
            break;
          default:
            client.sendText(message.from, 'Opção inválida. Por favor, selecione uma das opções abaixo: \n\n 1️⃣ - 📝 Ver cardápio 📝\n 2️⃣ - 🗺 Ver localização 🗺\n 3️⃣ - 💭 Falar com um atendente 💭\n 4️⃣ - 🖊 Fazer pedido 🖊\n 5️⃣ - 💲 Pix 💲');
            menuDisplayed = true;
            break;
        }
      }
    }
  }
  )
};
