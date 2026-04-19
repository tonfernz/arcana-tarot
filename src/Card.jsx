// Card components — image-based with artwork
const { useState, useEffect, useRef, useMemo } = React;

function getCardImg(card) {
  if (!card) return '';
  const folders = { Cups: '02_Cups', Pentacles: '03_Pentacles', Wands: '04_Wands', Swords: '05_Swords' };
  const folder = card.suit ? folders[card.suit] : '01_22Arcana';
  return `${folder}/${card.file}`;
}

function CardBack({ style = {}, className = "" }) {
  return (
    <div className={`card-back ${className}`} style={style}>
      <img src="BackCard.png" alt="Card back" className="card-back-img" draggable="false" />
    </div>
  );
}

function CardFace({ card, style = {}, className = "" }) {
  if (!card) return null;
  const imgSrc = getCardImg(card);
  return (
    <div className={`card-face ${className}`} style={style}>
      <img src={imgSrc} alt={card.name} className="card-face-img" draggable="false" />
    </div>
  );
}

Object.assign(window, { CardBack, CardFace });
