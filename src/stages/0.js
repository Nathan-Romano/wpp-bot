import { storage } from '../storage.js';

export const initialStage = {
  exec({ from }) {
    storage[from].stage = 1;

    return '👋 Olá, como vai? \n\nBem vindo a *Obadog*. \n*Por favor selecione abaixo uma opção* 🙋‍♂️ \n-----------------------------------\n1️⃣ - ```FAZER PEDIDO``` \n2️⃣ - ```VER CARDÁPIO```\n0️⃣ - ```FALAR COM ATENDENTE```';
  },
};
