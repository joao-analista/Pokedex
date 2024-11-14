import React from 'react';

const PokemonCard = ({ pokemon }) => {
  // Mapeia os tipos do Pokémon
  const types = pokemon.types.map(type => type.type.name);
  
  // Função para retornar a cor do tipo
  const getTypeColor = (type) => {
    const typeColors = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC"
    };
    return typeColors[type] || "#000"; // Retorna preto se o tipo não for encontrado
  };

  return (
    <div className={`pokemon-card ${types.join(' ')}`}>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h4 style={{ color: getTypeColor(types[0]) }}>
        {pokemon.name}
      </h4>
      <p>ID: {pokemon.id}</p>
      <p>Tipo(s): {types.join(', ')}</p>
    </div>
  );
};

export default PokemonCard;
