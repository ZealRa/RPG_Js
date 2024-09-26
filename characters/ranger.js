import { Character } from './character.js';

export class Ranger extends Character {
  constructor(name) {
    super(name, 10, 4, 50, 20, Ranger.piercingArrow);
    this.class = 'Ranger';
    this.specialAttackName = "Piercing Arrow";
  }

  piercingArrow(player, target) {
    if (player.mana >= 20) {
      console.log(`${player.name} utilise ${this.specialAttackName} sur ${target.name}, perçant ses défenses !`);
      target.takeDamage(6, true);
      player.mana -= 20;
    } else {
      console.log(`${player.name} n'a pas assez de mana pour utiliser ${this.specialAttackName}.`);
    }
  }
}