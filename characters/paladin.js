import { Character } from "./character.js";

export class Paladin extends Character {
  constructor(name) {
    super(name, 16, 3, 160, 40, Paladin.healingLightning);
    this.class = 'Paladin';
    this.healingLightning = false;
  }

  static healingLightning(attacker, target) {
    attacker.dealDamage(target, 4);
    attacker.mana -= attacker.specialAttackCost;
    attacker.hp += 5;
    console.log(`${attacker.name} utilise Healing Lightning, infligeant 4 points de dégâts à ${target.name} et se soignant de 5 points de vie.`);
  }

  takeDamage(damage) {
    super.takeDamage(damage);
  }
}

const ulder = new Paladin('Ulder');
