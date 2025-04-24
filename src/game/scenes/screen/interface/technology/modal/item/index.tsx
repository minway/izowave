import {
  Texture, useClick, useEvent, useScene,
} from 'phaser-react-ui';
import React, { useMemo, useRef, useState } from 'react';

import { GameScene } from '../../../../../../types';

import type {
  PlayerSkill, PlayerSkillData, 
  PlayerTechnology,
  PlayerTechnologyData} from '~scene/world/entities/player/types';
import type { IWorld } from '~scene/world/types';

import { phrase } from '~lib/lang';
import { Cost } from '~scene/system/interface/cost';
import { PLAYER_MAX_TECHNOLOGY_LEVEL } from '~scene/world/entities/player/const';
import { PlayerEvent, PlayerTechnologyIcon,
} from '~scene/world/entities/player/types';

import {
  Container, Info, Action, Label, Level, Button, Limit, Icon, Head,
} from './styles';

type Props = {
  type: PlayerTechnology
};

export const Item: React.FC<Props> = ({ type }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const refContainer = useRef<HTMLDivElement>(null);

  const getData = (): PlayerTechnologyData => ({
    type,
    research: world.player.getResearchToAdvance(type),
    currentLevel: world.player.techLevel[type],
  });

  const [data, setData] = useState<PlayerTechnologyData>(getData);

  const levels = useMemo(() => Array.from({
    length: PLAYER_MAX_TECHNOLOGY_LEVEL,
  }), []);

  useClick(refContainer, 'down', () => {
    world.player.advance(type);
  }, [type]);

  useEvent(world.player, PlayerEvent.ADVANCE_TECHNOLOGY, () => {
    setData(getData());
  }, []);

  return (
    <Container ref={refContainer} $active={data.currentLevel < PLAYER_MAX_TECHNOLOGY_LEVEL }>
      <Info>
        <Icon>
          <Texture name={PlayerTechnologyIcon[data.type]} />
        </Icon>
        <Head>
          <Label>{phrase(`TECHNOLOGY_LABEL_${data.type}`)}</Label>
          <Level>
            {levels.map((_, level) => (
              <Level.Progress
                key={level}
                $active={data.currentLevel && level < data.currentLevel}
              />
            ))}
          </Level>
        </Head>
      </Info>
      <Action>
        {data.currentLevel >= PLAYER_MAX_TECHNOLOGY_LEVEL ? (
          <Limit>
            {phrase('TECHNOLOGY_MAX_LEVEL')}
          </Limit>
        ) : (
          <>
            <Button>{phrase('TECHNOLOGY_ADVANCE')}</Button>
            <Cost type="RESEARCH" value={data.research} />
          </>
        )}
      </Action>
    </Container>
  );
};
