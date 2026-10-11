import { GameModel } from './Model.js';
import { GameView } from './View.js';
import { GameController } from './Controller.js';

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new GameController(new GameModel(), new GameView());
});