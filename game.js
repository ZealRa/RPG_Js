import { Character } from './characters/character.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export class Game {
  constructor(players) {
    this.players = players;
    this.turnLeft = 10;
  }

  startGame() {
    console.log("Le jeu commence !");
    this.showCharacterSummary();
    this.startTurn();
  }

  showCharacterSummary() {
    console.log("Résumé des personnages :");
    this.players.forEach(player => {
      console.log(`${player.name} - Class: ${player.class} - HP: ${player.hp}, Mana: ${player.mana}, Dmg: ${player.dmg}`);
    });
  }

  async startTurn() {
    console.log(`Tour ${11 - this.turnLeft}`);
    this.players = this.shufflePlayers(this.players);

    for (const player of this.players) {
      if (player.status === "playing") {
        console.log(`C'est au tour de ${player.name} de jouer.`);
        await this.promptAction(player);
      }
    }

    this.logRemainingPlayers();
    this.skipTurn();

    if (this.players.filter(p => p.status === "playing").length <= 1) {
      const winner = this.players.find(p => p.status === "playing");
      if (winner) {
        winner.status = "winner";
        console.log(`${winner.name} est le gagnant !`);
      }
    } else {
      this.startTurn();
    }
  }

  promptAction(player) {
    return new Promise((resolve) => {
      console.log(`Actions disponibles pour ${player.name}:`);
      console.log("1. Attaque simple");
      console.log("2. Utiliser attaque spéciale");

      rl.question("Choisissez une action (1 ou 2) : ", (answer) => {
        const target = this.getRandomTarget(player);
        if (answer === '1') {
          player.dealDamage(target);
          console.log(`${player.name} attaque ${target.name}.`);
        } else if (answer === '2') {
          if (player.specialAttack) {
            player.specialAttack(player, target);
            console.log(`${player.name} utilise son attaque spéciale contre ${target.name}.`);
          } else {
            console.log(`${player.name} n'a pas d'attaque spéciale disponible.`);
          }
        }
        resolve();
      });
    });
  }

  skipTurn() {
    this.turnLeft -= 1;
    console.log(`Tours restants : ${this.turnLeft}`);

    if (this.turnLeft === 0) {
      console.log("La partie est terminée !");
      this.players.forEach(player => {
        if (player.status === "playing") {
          player.status = "winner";
          console.log(`${player.name} est un gagnant par défaut !`);
        }
      });
    }
  }

  logRemainingPlayers() {
    console.log("Personnages restants :");
    this.players.forEach(player => {
      console.log(`${player.name} - HP: ${player.hp}, Status: ${player.status}`);
    });
  }

  getRandomTarget(currentPlayer) {
    const alivePlayers = this.players.filter(p => p !== currentPlayer && p.status === "playing");
    if (alivePlayers.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * alivePlayers.length);
    return alivePlayers[randomIndex];
  }

  shufflePlayers(players) {
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }
    return players;
  }

  watchStats() {
    this.players.forEach(player => {
      console.log(`${player.name} - HP: ${player.hp}, Mana: ${player.mana}, Status: ${player.status}`);
    });
  }
}
