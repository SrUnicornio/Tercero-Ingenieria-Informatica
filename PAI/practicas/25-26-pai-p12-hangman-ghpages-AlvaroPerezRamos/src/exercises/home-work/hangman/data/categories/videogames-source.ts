/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file videogames-source.ts
 * @description Fuente de palabras para la categoría Videojuegos.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {WordCategory} from '../../interfaces/game-state.js';

/**
 * Fuente de palabras para la categoría Videojuegos.
 */
export class VideogamesSource extends WordCategory {
  override readonly label = 'Videojuegos';

  private readonly words: readonly string[] = [
    // --- AAA ---
    'The Last of Us', 'Red Dead Redemption', 'God of War', 'The Witcher', 'Cyberpunk',
    'Grand Theft Auto', 'Assassins Creed', 'Call of Duty', 'Halo', 'Uncharted',
    'Death Stranding', 'Horizon Zero Dawn', 'Ghost of Tsushima', 'Spider-Man', 'Elden Ring',
    'Mass Effect', 'BioShock', 'Far Cry', 'Bloodborne', 'Detroit Become Human',
    'Batman Arkham City', 'Gears of War', 'Tomb Raider', 'Watch Dogs', 'Infamous',
    'Control', 'Doom', 'Wolfenstein', 'Borderlands', 'Destiny',
    'Kingdom Hearts', 'Ratchet and Clank', 'Jak and Daxter', 'Sly Cooper', 'Metal Gear Solid',

    // --- SANDBOX / MUNDO ABIERTO ---
    'Minecraft', 'Terraria', 'No Mans Sky', 'Valheim', 'Subnautica',
    'Starfield', 'Skyrim', 'Fallout', 'Zelda', 'Breath of the Wild',
    'Tears of the Kingdom', 'Rust', 'The Forest', 'Ark Survival Evolved', 'Genshin Impact',
    'Don’t Starve', 'Garry’s Mod', 'State of Decay', 'Outer Wilds', 'Kenshi',
    'Saints Row', 'Just Cause', 'Sleeping Dogs', 'Project Zomboid', 'DayZ',

    // --- INDIE ---
    'Hollow Knight', 'Celeste', 'Undertale', 'Hades', 'Stardew Valley',
    'Cuphead', 'Ori and the Blind Forest', 'Dead Cells', 'Disco Elysium', 'Oxenfree',
    'Among Us', 'Fall Guys', 'Inscryption', 'Vampire Survivors', 'Dave the Diver',
    'Outer Wilds', 'Papers Please', 'Slay the Spire', 'The Binding of Isaac', 'Shovel Knight',
    'Blasphemous', 'Katana ZERO', 'Firewatch', 'Journey', 'Limbo',

    // --- DEPORTES / CARRERAS ---
    'FIFA', 'NBA', 'Rocket League', 'Gran Turismo', 'Forza Horizon',
    'Madden NFL', 'The Show', 'PGA Tour', 'Tony Hawk Pro Skater', 'Skate',
    'Need for Speed', 'Assetto Corsa', 'Dirt Rally', 'F1 23', 'Burnout Paradise',
    'Mario Kart', 'Crash Team Racing', 'Wipeout', 'Ridge Racer', 'WRC Generations',

    // --- TERROR ---
    'Resident Evil', 'Silent Hill', 'Outlast', 'Amnesia', 'Phasmophobia',
    'Dead Space', 'The Evil Within', 'Fatal Frame', 'P.T.', 'Alien Isolation',
    'Layers of Fear', 'Soma', 'Until Dawn', 'Five Nights at Freddys', 'Slender',
    'The Mortuary Assistant', 'Alan Wake', 'Condemned', 'Alone in the Dark', 'Dead by Daylight',

    // --- LUCHA / ACCIÓN / SHOOTERS ---
    'Street Fighter', 'Mortal Kombat', 'Devil May Cry', 'Sekiro', 'Doom Eternal',
    'Tekken', 'SoulCalibur', 'Super Smash Bros', 'Guilty Gear', 'Dragon Ball FighterZ',
    'Overwatch', 'Valorant', 'Counter-Strike', 'Apex Legends', 'Fortnite',
    'Quake', 'Unreal Tournament', 'Team Fortress', 'Rainbow Six Siege', 'Bayonetta',

    // --- ESTRATEGIA / ROL / CLÁSICOS ---
    'Civilization', 'Age of Empires', 'Baldurs Gate', 'Dark Souls', 'Final Fantasy',
    'StarCraft', 'Warcraft', 'League of Legends', 'Dota 2', 'World of Warcraft',
    'XCOM', 'Total War', 'Fire Emblem', 'Persona 5', 'Dragon Age',
    'Pac-Man', 'Tetris', 'Super Mario Bros', 'Space Invaders', 'Donkey Kong',
  ];

  override getWord(): string {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }
}

export const videogamesSource = new VideogamesSource();
