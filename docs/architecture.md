# Project Architecture

This document provides an overview of the project's architecture and the usage of key classes and functions.

## High-Level Overview

The project is a game built using Phaser.js. The core game logic is located in the `src/game/` directory. The game consists of several scenes, including:

*   `World`: The main game scene where the gameplay takes place.
*   `Menu`: The main menu scene.
*   `Gameover`: The game over scene.

The `World` scene contains the following key components:

*   `Player`: The player character.
*   `Assistant`: The player's assistant.
*   `Level`: The game level.
*   `Wave`: The wave manager.
*   `Builder`: The building manager.
*   `FXManager`: The effects manager.
*   `Camera`: The camera manager.

## File Structure

The project's file structure is organized as follows:

*   `.github/`: Contains GitHub-related files, such as workflow configurations.
*   `docs/`: Contains project documentation, such as images and this architecture document.
*   `src/`: Contains the project's source code.
    *   `assets/`: Contains game assets, such as images, audio, and fonts.
    *   `const/`: Contains game constants, such as difficulty settings and language files.
    *   `game/`: Contains the core game logic.
        *   `scenes/`: Contains the game scenes.
            *   `world/`: Contains the `World` scene and its related components.
                *   `entities/`: Contains the game entities, such as the player, assistant, enemies, and buildings.
                *   `level/`: Contains the level generation logic.
                *   `wave/`: Contains the wave management logic.
            *   `menu/`: Contains the `Menu` scene.
            *   `gameover/`: Contains the `Gameover` scene.
        *   `types/`: Contains TypeScript type definitions.
    *   `lib/`: Contains utility libraries.
    *   `typings/`: Contains TypeScript typings.

## Key Classes and Functions

### `src/game/scenes/world/entities/player/index.ts`

This file contains the `Player` class, which represents the player character.

*   **`Player` class:**
    *   Extends the `Sprite` class.
    *   Implements the `IPlayer` interface.
    *   Responsible for handling player movement, health, resources, skills, and superskills.
    *   Contains the `moveAIPlayerRandomly()` and `pauseAIPlayer()` functions, which are responsible for the AI player's movement.
    *   `handleAIMovement()`: starts the AI movement loop by calling `moveAIPlayerRandomly()`
    *   `moveAIPlayerRandomly()`: Randomizes movement direction and schedules the next move or pause after a random duration.
    *   `pauseAIPlayer()`: Pauses the AI movement and schedules the next move after a pause. Also, builds a city if the AI player doesn't have one.
    *   `aiBuildCityCenter()`: Builds a city center at the specified position.

### `src/game/scenes/world/index.ts`

This file contains the `World` class, which represents the main game scene.

*   **`World` class:**
    *   Extends the `Scene` class.
    *   Implements the `IWorld` interface.
    *   Responsible for managing the game world, including the player, assistant, level, wave manager, builder, effects manager, and camera.
    *   Contains the `addAIPlayer()` function, which is responsible for adding AI players to the game.

### `src/const/ai_config.json`

This file contains the configuration for the AI players.

*   **`aiPlayers` array:**
    *   Contains an array of AI player objects.
    *   Each AI player object contains the following properties:
        *   `id`: The AI player's ID.
        *   `nation`: The AI player's nation.
            *   `name`: The AI player's nation name.
        *   `cities`: The AI player's cities.
            *   `name`: The city name.
            *   `position`: The city position.

## Next Steps

The next step is to further analyze the `moveAIPlayerRandomly()` and `pauseAIPlayer()` functions in `src/game/scenes/world/entities/player/index.ts` to understand how they control the AI player's movement.