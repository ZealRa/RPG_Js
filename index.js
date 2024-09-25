import { Game } from './game.js';
import { Fighter } from './characters/fighter.js';
import { Paladin } from './characters/paladin.js';
import { Monk } from './characters/monk.js';
import { Berzerker } from './characters/berzerker.js';
import { Assassin } from './characters/assassin.js';

const grace = new Fighter('Grace');
const ulder = new Paladin('Ulder');
const moana = new Monk('Moana');
const draven = new Berzerker('Draven');
const carl = new Assassin('Carl');

const game = new Game([grace, ulder, moana, draven, carl]);

game.startGame();
