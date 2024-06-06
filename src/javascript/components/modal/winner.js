import showModal from './modal';
import { createFighterImage } from '../fighterPreview';

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
export default function showWinnerModal(fighter) {
    const { name } = fighter;

    showModal({
        title: `"${name}" is winner!`,
        bodyElement: createFighterImage(fighter),
        onClose: () => {
            document.location.reload();
        }
    });
}
