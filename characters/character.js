export class Character {
  constructor(name, hp, dmg, mana, specialAttackCost, specialAttack) {
    this.name = name;
    this.hp = hp;
    this.dmg = dmg;
    this.mana = mana;
    this.specialAttackCost = specialAttackCost;
    this.isLoser = false;
    this.specialAttack = specialAttack;
    this.status = "playing";
  }

  takeDamage(damage) {
    if (this.status !== "playing") return;

    this.hp -= damage;
    console.log(`${this.name} reçoit ${damage} points de dégâts. Il lui reste ${this.hp} points de vie.`);

    if (this.hp <= 0) {
      this.hp = 0;
      this.status = "loser";
      console.log(`${this.name} est éliminé et devient un loser.`);
    }
  }

  dealDamage(victim) {
    if (this.status !== "playing") return;

    victim.takeDamage(this.dmg);

    if (victim.status === "loser") {
      this.mana += 20;
      console.log(`${this.name} a tué ${victim.name} et regagne 20 points de mana. Il a maintenant ${this.mana} points de mana.`);
    }
  }

  useSpecialAttack(target) {
    if (this.mana >= this.specialAttackCost) {
      this.specialAttack(this, target);
    } else {
      console.log(`${this.name} n'a pas assez de mana !`);
    }
  }
}