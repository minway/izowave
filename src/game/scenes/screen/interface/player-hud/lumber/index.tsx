import { useEvent, useScene } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene } from '../../../../../types';

import type { IWorld } from '~scene/world/types';

import { Amount } from '~scene/system/interface/amount';
import { PlayerEvent } from '~scene/world/entities/player/types';

export const Lumber: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [amount, setAmount] = useState(world.player.lumber);

  useEvent(world.player, PlayerEvent.UPDATE_LUMBER, (lumber: number) => {
    setAmount(lumber);
  }, []);

  return <Amount type="LUMBER" placeholder={true}>{amount}</Amount>;
};
