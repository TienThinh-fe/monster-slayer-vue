const getAttackValue = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getBattleLog = (who, type, value) => {
  return `${who} did ${type} with ${value} HP`;
};

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      battleLog: [],
    };
  },

  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },

  computed: {
    monsterBarStyle() {
      if (this.monsterHealth <= 0) {
        this.monsterHealth = 0;
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyle() {
      if (this.playerHealth <= 0) {
        this.playerHealth = 0;
      }
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
    mayHeal() {
      return this.currentRound % 2 !== 0;
    },
  },

  methods: {
    playerAttack() {
      this.currentRound++;
      const playerAttackValue = getAttackValue(5, 12);
      this.monsterHealth -= playerAttackValue;
      this.monsterAttack();
      this.battleLog.unshift(
        getBattleLog("Player", "attack", playerAttackValue)
      );
    },
    monsterAttack() {
      const monsterAttackValue = getAttackValue(3, 15);
      this.playerHealth -= monsterAttackValue;
      this.battleLog.unshift(
        getBattleLog("Monster", "attack", monsterAttackValue)
      );
    },
    specialAttack() {
      this.currentRound++;
      const playerSpecialAttack = getAttackValue(15, 35);
      const monsterSpecialAttack = getAttackValue(12, 40);
      this.playerHealth -= monsterSpecialAttack;
      this.monsterHealth -= playerSpecialAttack;
      this.battleLog.unshift(
        getBattleLog("Player", "special attack", playerSpecialAttack)
      );
      this.battleLog.unshift(
        getBattleLog("Monster", "special attack", monsterSpecialAttack)
      );
    },
    heal() {
      this.currentRound++;
      const playerHeal = getAttackValue(8, 15);
      const monsterHeal = getAttackValue(6, 20);

      if (this.playerHealth + playerHeal >= 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += playerHeal;
        this.battleLog.unshift(getBattleLog("Player", "heal", playerHeal));
      }

      if (this.monsterHealth + monsterHeal >= 100) {
        this.monsterHealth = 100;
      } else {
        this.monsterHealth += monsterHeal;
        this.battleLog.unshift(getBattleLog("Monster", "heal", monsterHeal));
      }
    },
    surrender() {
      this.playerHealth = 0;
    },
    restartGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.battleLog = [];
    },
  },
});

app.mount("#game");
