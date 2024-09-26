import { Character } from './character.js';

export class Assassin extends Character {
  constructor(name) {
    super(name, 6, 6, 20, 20, Assassin.shadowHit);
    this.isImmune = false;
    this.class = 'Assassin';
    this.specialAttackName = "Shadow Hit";
    this.shadowHit = false;
  }

  static shadowHit(attacker, target) {
    if (attacker.mana >= attacker.specialAttackCost) {
      attacker.mana -= attacker.specialAttackCost;
      console.log(`${attacker.name} utilise Shadow Hit, ne prenant pas de dégâts au prochain tour.`);

      attacker.isImmune = true;
      attacker.dealDamage(target, 7);

      if (target.hp > 0) {
        attacker.takeDamage(7);
        console.log(`${target.name} n'est pas mort, ${attacker.name} perd 7 points de vie.`);
      }
    } else {
      console.log(`${attacker.name} n'a pas assez de mana pour utiliser Shadow Hit!`);
    }
  }

  takeDamage(damage) {
    if (this.isImmune) {
      console.log(`${this.name} est immunisé aux dégâts pour ce tour.`);
      this.isImmune = false;
    } else {
      super.takeDamage(damage);
    }
  }
}

const carl = new Assassin('Carl');
