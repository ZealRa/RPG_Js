import { Character } from './character.js';

export class Berzerker extends Character {
  constructor(name) {
    super(name, 8, 4, 0, 0, Berzerker.rage);
    this.class = 'Berzerker';
    this.rage = false;
  }

  static rage(attacker) {
    attacker.dmg += 1;
    attacker.hp -= 1;
    console.log(`${attacker.name} utilise Rage, augmentant ses dégâts à ${attacker.dmg} mais perdant 1 point de vie. Il lui reste ${attacker.hp} points de vie.`);

    if (attacker.hp <= 0) {
      attacker.hp = 0;
      attacker.status = "loser";
      console.log(`${attacker.name} est devenu un loser après avoir utilisé Rage.`);
    }
  }

  takeDamage(damage) {
    super.takeDamage(damage);
  }
}

const draven = new Berzerker('Draven');
