import { Character } from "./character.js";

export class Monk extends Character {
  constructor(name) {
    super(name, 8, 2, 200, 25, Monk.heal);
    this.class = 'Monk';
    this.specialAttackName = "Heal";
    this.heal = false;
  }

  static heal(attacker) {
    attacker.hp += 8;
    attacker.mana -= attacker.specialAttackCost;
    console.log(`${attacker.name} utilise Heal et se soigne de 8 points de vie.`);
  }

  takeDamage(damage) {
    super.takeDamage(damage)
  }
}

const moana = new Monk('Moana');
