import axios from "axios";
import React, { useEffect, useState } from "react";

const PokemonListing = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  const pokemonListing = async () => {
    try {
      const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=12");

      const result = res.data.results?.map((item) => {
        return axios.get(item.url).then((res) => res.data);
      });

      Promise.all(result).then((res) => {
        setPokemonList(res);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    pokemonListing();
  }, []);

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white/60 backdrop-blur-md shadow-lg rounded-3xl p-6 animate-pulse">
      <div className="w-32 h-32 bg-gray-300 rounded-2xl mx-auto mb-4"></div>
      <div className="h-5 bg-gray-300 rounded w-24 mx-auto mb-3"></div>
      <div className="h-3 bg-gray-300 rounded w-20 mx-auto mb-6"></div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        <div className="h-3 bg-gray-300 rounded w-4/6"></div>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900 tracking-wide drop-shadow-lg">
        Pokédex
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : pokemonList.map((pokemon) => (
              <div
                key={pokemon.id}
                className="relative bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-6 flex flex-col items-center border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {/* Pokémon ID */}
                <span className="absolute top-4 right-4 text-xs font-bold text-gray-400">
                  #{pokemon.id}
                </span>

                {/* Pokémon Image */}
                <div className="bg-gradient-to-r from-yellow-100 via-pink-100 to-red-100 rounded-2xl p-4 mb-4 shadow-inner">
                  <img
                    src={pokemon.sprites.other["official-artwork"].front_default}
                    alt={pokemon.name}
                    className="w-32 h-32 object-contain drop-shadow-md"
                  />
                </div>

                {/* Pokémon Name */}
                <h2 className="text-2xl font-extrabold capitalize text-gray-800">
                  {pokemon.name}
                </h2>

                {/* Types */}
                <div className="flex gap-2 mt-3 flex-wrap justify-center">
                  {pokemon.types.map((typeObj) => (
                    <span
                      key={typeObj.slot}
                      className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 text-white shadow-md"
                    >
                      {typeObj.type.name}
                    </span>
                  ))}
                </div>

                {/* Stats (Attack, Defense, Speed) */}
                <div className="mt-6 w-full space-y-4">
                  {pokemon.stats
                    .filter((stat) =>
                      ["attack", "defense", "speed"].includes(stat.stat.name)
                    )
                    .map((stat) => (
                      <div key={stat.stat.name}>
                        <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                          <span className="capitalize">{stat.stat.name}</span>
                          <span>{stat.base_stat}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              stat.stat.name === "attack"
                                ? "bg-red-500"
                                : stat.stat.name === "defense"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                            style={{
                              width: `${
                                stat.base_stat > 100 ? 100 : stat.base_stat
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default PokemonListing;
