import { useClick, useCurrentScene, useEvent } from 'phaser-react-ui';
import React, { useEffect, useRef } from 'react';

import { Item } from './item';

import { phrase } from '~lib/lang';
import { Tutorial } from '~lib/tutorial';
import { Utils } from '~lib/utils';
import { PLAYER_SKILLS, PLAYER_TECHNOLOGY } from '~scene/world/entities/player/const';
import { PlayerSkillTarget, PlayerTechnologyGroup, PlayerTechnologyIcon } from '~scene/world/entities/player/types';

import {
  Container, Groups, Group, Target, List, Backdrop, Overlay, Close,
} from './styles';

type Props = {
  onClose: () => void
};

export const Modal: React.FC<Props> = ({ onClose }) => {
  const scene = useCurrentScene();

  const refOverlay = useRef<HTMLDivElement>(null);
  const refContainer = useRef<HTMLDivElement>(null);
  const refClose = useRef<HTMLDivElement>(null);

  useClick(refContainer, 'down', () => {}, []);
  useClick(refClose, 'down', onClose, []);
  useClick(refOverlay, 'down', onClose, []);

  useEvent(scene.input.keyboard, 'keyup-ESC', onClose, []);

  useEffect(() => {
    Tutorial.ToggleHintsVisible(false);

    return () => {
      Tutorial.ToggleHintsVisible(true);
    };
  }, []);

  return (
    <>
      <Backdrop />
      <Overlay ref={refOverlay}>
        <Container ref={refContainer}>
          <Close ref={refClose}>{phrase('TECHNOLOGY_CLOSE')}</Close>
          <Groups>
            {Utils.MapObject(PlayerTechnologyGroup, (key, group) => (
              <Group key={key}>
                <Target>{phrase(`TECHNOLOGY_GROUP_${group}`)}</Target>
                <List>
                  {Utils.MapObject(PLAYER_TECHNOLOGY, (type, tech) => tech.group === group && (
                    <Item key={type} type={type} />
                  ))}
                </List>
              </Group>
            ))}
          </Groups>
        </Container>
      </Overlay>
    </>
  );
};
