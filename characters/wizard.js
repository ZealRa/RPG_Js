import { Character } from "./character.js";

export class Wizard extends Character {
  constructor(name) {
    super(name, 10, 2, 200, 25, Wizard.fireBall);
    this.class = "Wizard";
    this.specialAttackName = "Fireball";
  }

  static fireBall(attacker, target) {
    if (attacker.mana >= attacker.specialAttackCost) {
      attacker.dealDamage(target, 7);
      attacker.mana -= attacker.specialAttackCost;
      console.log(`${attacker.name} utilise Fireball sur ${target.name}. Il lui reste ${attacker.mana} points de mana.`);
    } else {
      console.log(`${attacker.name} n'a pas assez de mana pour utiliser Fireball.`);
    }
  }

  takeDamage(damage) {
    super.takeDamage(damage);
  }
}
