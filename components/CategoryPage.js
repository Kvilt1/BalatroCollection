import React from 'react';

const CategoryPage = ({ category, items, imageFolder }) => {
  return (
    <div>
      <h1>{category}</h1>
      <div className="items-grid">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <h2>{item.name}</h2>
            <img src={`${imageFolder}${item.appearance}`} alt={item.name} />
            <p><strong>Effect:</strong> {item.effect}</p>
            <p><strong>Rarity:</strong> {item.rarity || 'N/A'}</p>
            <p><strong>Cost:</strong> {item.cost || 'N/A'}</p>
            <p><strong>Unlock Requirement:</strong> {item.unlock_requirement || 'N/A'}</p>
            {item.additional && <p><strong>Additional Info:</strong> {item.additional}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage; 