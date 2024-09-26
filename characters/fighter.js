import { Character } from './character.js';

export class Fighter extends Character {
  constructor(name) {
    super(name, 12, 4, 40, 20, Fighter.darkVision);
    this.class = 'Fighter';
    this.specialAttackName = "DarkVision";
    this.darkVisionActive = false;
  }

  static darkVision(attacker, target) {
    if (attacker.mana >= attacker.specialAttackCost) {
      attacker.dealDamage(target, 5);
      attacker.mana -= attacker.specialAttackCost;
      attacker.darkVisionActive = true;
      console.log(`${attacker.name} utilise Dark Vision, infligeant 5 points de dégâts et réduisant les dégâts reçus de 2 lors du prochain tour.`);
    } else {
      console.log(`${attacker.name} n'a pas assez de mana pour utiliser Dark Vision.`);
    }
  }

  takeDamage(damage, ignoreReduction = false) {
    if (this.reducedDamageNextTurn && !ignoreReduction) {
      damage = Math.max(0, damage - 2);
      console.log(`${this.name} réduit les dégâts reçus de 2 grâce à ${this.specialAttackName}.`);
    }
    this.hp -= damage;
    console.log(`${this.name} reçoit ${damage} dégâts. HP restants: ${this.hp}`);
    this.reducedDamageNextTurn = false;
  }
}


const grace = new Fighter('Grace');
