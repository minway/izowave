import { useEvent, useScene } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene } from '../../../../../types';

import type { IWorld } from '~scene/world/types';

import { Amount } from '~scene/system/interface/amount';
import { PlayerEvent } from '~scene/world/entities/player/types';

export const Silver: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [amount, setAmount] = useState(world.player.silver);

  useEvent(world.player, PlayerEvent.UPDATE_SILVER, (silver: number) => {
    setAmount(silver);
  }, []);

  return <Amount type="SILVER" placeholder={true}>{Math.floor(amount)}</Amount>;
};
