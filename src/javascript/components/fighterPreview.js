import createElement from '../helpers/domHelper';

/**
 * @param {Map?} fighter
 * @param {string} position
 * @returns {HTMLDivElement}
 */
export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';

    /**
     * @type {HTMLDivElement}
     */
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter === undefined) return fighterElement;

    const { source, name, health, attack, defense } = Object.fromEntries(fighter.entries());
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    const nameElement = createElement({ tagName: 'h1' });
    nameElement.innerText = name;

    const healthElement = createElement({ tagName: 'span' });
    healthElement.innerText = `Health: ${health} | `;

    const attackElement = createElement({ tagName: 'span' });
    attackElement.innerText = `Attack: ${attack} | `;

    const defenseElement = createElement({ tagName: 'span' });
    defenseElement.innerText = `Defense: ${defense}`;

    const detailsContainer = createElement({
        tagName: 'div',
        className: 'fighter-preview___details-container'
    });

    detailsContainer.append(nameElement, healthElement, attackElement, defenseElement);

    fighterElement.append(imgElement, detailsContainer);

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
