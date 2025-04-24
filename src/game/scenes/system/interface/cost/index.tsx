import { useEvent, useScene } from 'phaser-react-ui';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { GameScene } from '../../../../types';

import type { IWorld } from '~scene/world/types';

import { PlayerEvent } from '~scene/world/entities/player/types';

import * as styles from './styles';

type Props = {
  type: 'RESOURCES' | 'EXPERIENCE' | 'RESEARCH'
  check?: boolean
  value: number | string
};

export const Cost: React.FC<Props> = ({ type, value, check = true }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const refValue = useRef(value);

  const [haveAmount, setHaveAmount] = useState(() => {
    const field = type.toLowerCase() as 'resources' | 'experience' | 'research';

    return world.player[field];
  });

  const isEnough = useMemo(() => (
    (!check || typeof value !== 'number' || haveAmount >= value)
  ), [check, value, haveAmount]);

  useEvent(world.player, PlayerEvent[`UPDATE_${type}`], (amount: number) => {
    setHaveAmount(amount);
  }, []);

  useEffect(() => {
    refValue.current = value;
  }, [value]);

  return (
    <styles.Wrapper>
      <styles.Icon src={`assets/sprites/hud/${type.toLowerCase()}.png`} />
      <styles.Value $attention={!isEnough}>{value}</styles.Value>
    </styles.Wrapper>
  );
};
