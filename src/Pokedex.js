import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]); // Lista completa de Pokémon
  const [filteredPokemonList, setFilteredPokemonList] = useState([]); // Lista filtrada de Pokémon
  const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [foundPokemon, setFoundPokemon] = useState(null); // Pokémon encontrado pela busca
  const [searching, setSearching] = useState(false); // Estado para verificar se está buscando um Pokémon

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

  // Função para carregar todos os Pokémons da API
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        setLoading(true); // Começa o carregamento
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000'); // Limite de 1000 Pokémons
        const pokemonData = response.data.results;

        // Requisição para pegar mais informações sobre cada Pokémon
        const pokemonDetails = await Promise.all(
          pokemonData.map(async (pokemon) => {
            const res = await axios.get(pokemon.url);
            return res.data;
          })
        );

        setPokemonList(pokemonDetails); // Atualiza a lista de Pokémon com os novos dados
        setFilteredPokemonList(pokemonDetails); // Define os Pokémon filtrados com todos os Pokémon
        setLoading(false); // Finaliza o carregamento
      } catch (error) {
        console.error('Erro ao buscar os dados dos Pokémon:', error);
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  // Função de filtragem que ocorre sempre que o searchTerm muda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredPokemonList(pokemonList);
    } else {
      const filteredList = pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemonList(filteredList);
    }
  }, [searchTerm, pokemonList]);

  // Função para buscar um Pokémon específico pelo nome
  const searchPokemon = async (name) => {
    setSearching(true); // Inicia a busca
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      setFoundPokemon(response.data); // Salva o Pokémon encontrado no estado
      setSearching(false); // Finaliza a busca
    } catch (error) {
      setSearching(false);
      setFoundPokemon(null); // Se não encontrar, limpa o estado
      console.error('Erro ao buscar o Pokémon:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      searchPokemon(searchTerm); // Busca o Pokémon pelo nome
    }
  };

  // Função para lidar com o clique no Pokémon
  const handlePokemonClick = (pokemon) => {
    setFoundPokemon(pokemon); // Exibe as informações detalhadas do Pokémon clicado
  };

  if (loading) {
    return <div>Carregando Pokémons...</div>;
  }

  return (
    <div className="pokedex">
      {/* Barra de pesquisa */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Pesquise um Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
          onKeyPress={handleKeyPress} // Detecta o pressionamento da tecla Enter
          className="search-bar"
        />
      </div>

      {/* Exibe as informações do Pokémon encontrado, se houver */}
      {foundPokemon ? (
        <div className="pokemon-info">
          <h3>{foundPokemon.name.toUpperCase()}</h3>
          <div className="sprite-container">
            <img src={foundPokemon.sprites.front_default} alt={`${foundPokemon.name} Front`} />
            <img src={foundPokemon.sprites.back_default} alt={`${foundPokemon.name} Back`} />
          </div>
          <p>ID: {foundPokemon.id}</p>
          <p>Altura: {foundPokemon.height} decímetros</p>
          <p>Peso: {foundPokemon.weight} hectogramas</p>

          <div>
            <h4>Tipos:</h4>
            <div className="types">
              {foundPokemon.types.map((type, index) => (
                <span
                  key={index}
                  className={`type-${type.type.name}`}
                  style={{ backgroundColor: typeColors[type.type.name] }}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4>Habilidades:</h4>
            <ul>
              {foundPokemon.abilities.map((ability, index) => (
                <li key={index}>{ability.ability.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        searchTerm && <div>Pokémon não encontrado!</div>
      )}

      {/* Exibe os Pokémon filtrados em uma grade 5x5 */}
      <div className="pokemon-grid">
        {filteredPokemonList.length > 0 ? (
          filteredPokemonList.map((pokemon) => (
            <div
              key={pokemon.id}
              className="pokemon-card"
              onClick={() => handlePokemonClick(pokemon)} // Quando clicar, exibe informações
              style={{ color: typeColors[pokemon.types[0].type.name] }} // Cor do nome do Pokémon com base no tipo
            >
              <h4>{pokemon.name.toUpperCase()}</h4>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            </div>
          ))
        ) : (
          <div>
            {searchTerm ? "Nenhum Pokémon encontrado!" : "Carregando Pokémons..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pokedex;
