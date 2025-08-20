import { useGame, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState, useEffect } from 'react';

import { GameScene } from '../../../../types';
import { WorldEvent } from '~scene/world/types';

import type { IGame } from '../../../../types';
import type { IWorld } from '~scene/world/types';

import { Value } from './styles';

export const Debug: React.FC = () => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [frames, setFrames] = useState(0);
  const [memory, setMemory] = useState(0);

  useSceneUpdate(world, () => {
    setFrames(Math.round(game.loop.actualFps));

    // @ts-ignore
    const heapSize = performance?.memory?.usedJSHeapSize;

    if (heapSize) {
      setMemory(Math.round(heapSize / 1024 / 1024));
    }
  }, []);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    world.events.on(WorldEvent.PLAYER_COORDINATES, (x: number, y: number) => {
      setX(Math.round(x));
      setY(Math.round(y));
    });
  }, [world]);

  return (
    <Value>
      X: {x}, Y: {y} <br />
      {frames} FPS
      
      {Boolean(memory) && (
        <>
          <br />
          {memory} MB
        </>
      )}
    </Value>
  );
};
