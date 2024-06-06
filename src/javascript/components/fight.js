import controls from '../../constants/controls';

/**
 * @typedef {object} FighterDetail
 * @property {_id} name
 * @property {string} name
 * @property {number} health
 * @property {number} attack
 * @property {number} defense
 * @property {string} source
 *
 * @param {FighterDetail} fighter
 */
function getHitPower(fighter) {
    const { attack } = fighter;
    const criticalHitChance = Math.random() + 1;

    return attack * criticalHitChance;
}

/**
 * @param {FighterDetail} fighter
 */
function getBlockPower(fighter) {
    const { defense } = fighter;
    const dodgeChance = Math.random() + 1;

    return defense * dodgeChance;
}

/**
 * @param {FighterDetail} attacker
 * @param {FighterDetail} defender
 */
function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);

    if (damage <= 0) return 0;

    return damage;
}

class FigtherStatus {
    #initialHp;

    #hp;

    #hpIndicatorRef;

    /**
     * @type {Date | undefined}
     */
    #recentCriticalCdTime;

    /**
     * @param {number} initialHp
     * @param {boolean | undefined} isPlayerOne
     */
    constructor(initialHp, isPlayerOne) {
        this.#initialHp = initialHp;
        this.#hp = initialHp;
        this.#hpIndicatorRef = document.querySelector(`#${isPlayerOne ? 'left' : 'right'}-fighter-indicator`);
        this.isBlock = false;
    }

    /**
     * Current health point.
     */
    get hp() {
        return this.#hp;
    }

    get #hpPercent() {
        const result = (this.#hp / this.#initialHp) * 100;
        return result > 0 ? result : 0;
    }

    /**
     * Reduce `hp` by `damage`.
     *
     * @param {number} damage
     */
    damageHp(damage) {
        this.#hp -= damage;
        this.#hpIndicatorRef.style.width = `${this.#hpPercent}%`;
    }

    /**
     * Indicate critical hit is on cooldown.
     *
     * This getter also reset the cooldown if returned `false`.
     */
    get isCriticalHitCooldown() {
        if (this.#recentCriticalCdTime === undefined) {
            this.#recentCriticalCdTime = new Date();
            return false;
        }

        const now = new Date();
        const diff = now - this.#recentCriticalCdTime;

        // 10000 ms / 10 sec cooldown
        if (diff >= 10000) {
            this.#recentCriticalCdTime = now;
            return false;
        }

        return true;
    }
}

/**
 * @param {FighterDetail} firstFighter
 * @param {FighterDetail} secondFighter
 * @returns {Promise<FighterDetail>} winner
 */
export default async function fight(firstFighter, secondFighter) {
    let keydownListener;
    let keyupListener;

    return new Promise(resolve => {
        const {
            PlayerOneAttack,
            PlayerOneBlock,
            PlayerOneCriticalHitCombination,
            PlayerTwoAttack,
            PlayerTwoBlock,
            PlayerTwoCriticalHitCombination
        } = controls;
        const pressedKeys = new Set();

        const p1 = new FigtherStatus(firstFighter.health, true);
        const p2 = new FigtherStatus(secondFighter.health);

        function getP1DamagePower() {
            return getDamage(firstFighter, secondFighter);
        }

        function getP2DamagePower() {
            return getDamage(firstFighter, secondFighter);
        }

        function fightAction() {
            // assign block status
            p1.isBlock = pressedKeys.has(PlayerOneBlock);
            p2.isBlock = pressedKeys.has(PlayerTwoBlock);

            // do attack action
            // prevent attack if block is active

            if (pressedKeys.has(PlayerOneAttack) && !p1.isBlock) {
                if (!p2.isBlock) p2.damageHp(getP1DamagePower());
            }

            if (pressedKeys.has(PlayerTwoAttack) && !p2.isBlock) {
                if (!p1.isBlock) p1.damageHp(getP2DamagePower());
            }

            // do critical attack action
            // block won't prevent critical hit
            // instead it has cooldown for 10 sec

            if (PlayerOneCriticalHitCombination.every(key => pressedKeys.has(key))) {
                if (!p1.isCriticalHitCooldown) p2.damageHp(getP1DamagePower() * 2);
            }

            if (PlayerTwoCriticalHitCombination.every(key => pressedKeys.has(key))) {
                if (!p2.isCriticalHitCooldown) p1.damageHp(getP2DamagePower() * 2);
            }

            // check winner
            if (p1.hp <= 0 || p2.hp <= 0) {
                document.removeEventListener('keydown', keydownListener);
                document.removeEventListener('keyup', keyupListener);
                resolve(p1.hp <= 0 ? secondFighter : firstFighter);
            }
        }

        keydownListener = event => {
            pressedKeys.add(event.code);
            fightAction();
        };

        keyupListener = event => {
            pressedKeys.delete(event.code);
            fightAction();
        };

        document.addEventListener('keydown', keydownListener);
        document.addEventListener('keyup', keyupListener);
    });
}
