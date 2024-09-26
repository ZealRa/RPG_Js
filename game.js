import { Fighter } from './characters/fighter.js';
import { Paladin } from './characters/paladin.js';
import { Monk } from './characters/monk.js';
import { Berzerker } from './characters/berzerker.js';
import { Assassin } from './characters/assassin.js';
import { Wizard } from './characters/wizard.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export class Game {
  constructor() {
    this.players = this.generateRandomPlayers(5);
    this.turnLeft = 10;
    this.humanPlayer = null;
  }

  generateRandomPlayers(numberOfPlayers) {
    const classes = [Fighter, Paladin, Monk, Berzerker, Assassin, Wizard];
    const names = [
      'Arthas', 'Kael', 'Jaina', 'Tyrande', 'Gul\'dan',
      'Illidan', 'Thrall', 'Ragnaros', 'Muradin', 'Vol\'jin'
    ];
    const players = [];
    const usedNames = new Set();

    for (let i = 0; i < numberOfPlayers; i++) {
      const randomClassIndex = Math.floor(Math.random() * classes.length);
      const RandomClass = classes[randomClassIndex];

      let playerName;
      do {
        const randomNameIndex = Math.floor(Math.random() * names.length);
        playerName = names[randomNameIndex];
      } while (usedNames.has(playerName));

      usedNames.add(playerName);

      players.push(new RandomClass(playerName));
    }

    return players;
  }



  startGame() {
    console.log("Bienvenue dans l'Arène ! Etes-vous prêts à défier la MORT ? Que les jeux commencent !");
    this.showCharacterSummary();
    this.choosePlayerCharacter();
  }

  showCharacterSummary() {
    console.log("Résumé des personnages :");
    this.players.forEach((player, index) => {
      console.log(`${index + 1}. ${player.name} - Class: ${player.class} - HP: ${player.hp}, Mana: ${player.mana}, Dmg: ${player.dmg}`);
    });
  }

  choosePlayerCharacter() {
    rl.question("Choisissez votre personnage (entrez le numéro) : ", (answer) => {
      const chosenIndex = parseInt(answer) - 1;
      if (chosenIndex >= 0 && chosenIndex < this.players.length) {
        this.humanPlayer = this.players[chosenIndex];
        console.log(`Vous avez choisi ${this.humanPlayer.name} !`);
        this.startTurn();
      } else {
        console.log("Choix invalide, veuillez entrer un numéro valide.");
        this.choosePlayerCharacter();
      }
    });
  }

  async startTurn() {
    console.log(`Tour ${11 - this.turnLeft}`);
    this.players = this.shufflePlayers(this.players);

    for (const player of this.players) {
      if (player.status === "playing") {
        if (player === this.humanPlayer) {
          console.log(`C'est au tour de ${player.name} (vous) de jouer.`);
          await this.promptAction(player);
        } else {
          console.log(`C'est au tour de ${player.name} (contrôlé par l'ordinateur).`);
          this.computerAction(player);
        }
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

  computerAction(player) {
    const fatalTargets = this.getFatalTargets(player);

    if (fatalTargets.length > 0) {
      const target = fatalTargets[Math.floor(Math.random() * fatalTargets.length)];
      player.dealDamage(target);
    } else {
      const target = this.getRandomTarget(player);
      if (!target) return;

      const action = Math.random() < 0.5 ? 'attack' : 'special';

      if (action === 'attack') {
        player.dealDamage(target);
        console.log(`${player.name} (contrôlé par l'ordinateur) attaque ${target.name}.`);
      } else {
        if (player.specialAttack) {
          player.specialAttack(player, target);
          console.log(`${player.name} (contrôlé par l'ordinateur) utilise ${player.specialAttackName} sur ${target.name}.`);
        } else {
          console.log(`${player.name} n'a pas d'attaque spéciale disponible.`);
        }
      }
    }
  }

  getFatalTargets(player) {
    return this.players.filter(p => p !== player && p.status === "playing" && p.hp <= player.dmg);
  }



  promptAction(player) {
    return new Promise((resolve) => {
      console.log(`Actions disponibles pour ${player.name}:`);
      console.log("1. Attaque simple");
      console.log(`2. Utiliser ${player.specialAttackName}`);

      const askAction = () => {
        rl.question("Choisissez une action (1 ou 2) : ", (answer) => {
          if (answer === '1' || answer === '2') {
            this.promptTarget(player, answer, resolve);
          } else {
            console.log("Entrée invalide. Veuillez choisir 1 ou 2.");
            askAction();
          }
        });
      };

      askAction();
    });
  }

  promptTarget(player, action, resolve) {
    const targets = this.getAvailableTargets(player);

    console.log("Choisissez une cible :");
    targets.forEach((target, index) => {
      console.log(`${index + 1}. ${target.name} - HP: ${target.hp}`);
    });

    rl.question("Entrez le numéro de la cible : ", (answer) => {
      const targetIndex = parseInt(answer) - 1;
      if (targetIndex >= 0 && targetIndex < targets.length) {
        const target = targets[targetIndex];
        if (action === '1') {
          console.log(`${player.name} attaque ${target.name}.`);
          player.dealDamage(target);
        } else if (action === '2') {
          if (player.specialAttack) {
            console.log(`${player.name} utilise son attaque spéciale ${player.specialAttackName} contre ${target.name}.`);
            player.specialAttack(player, target);
          } else {
            console.log(`${player.name} n'a pas d'attaque spéciale disponible.`);
          }
        }
        resolve();
      } else {
        console.log("Choix de cible invalide.");
        this.promptTarget(player, action, resolve);
      }
    });
  }

  getAvailableTargets(currentPlayer) {
    return this.players.filter(p => p !== currentPlayer && p.status === "playing");
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
    console.log('- - - - -')
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
}
