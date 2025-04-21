import { useMobilePlatform } from 'phaser-react-ui';
import React from 'react';

import { Character } from './character';
import { Experience } from './experience';
import { MenuButton } from './menu-button';
import { Resources } from './resources';
import { Score } from './score';
import { Aether } from './aether';
import { Silver } from './silver';
import { Research } from './research';
import { Lumber } from './lumber';
import { Stone } from './stone';

import { Section } from '~scene/system/interface/section';

export const PlayerHUD: React.FC = () => {
  const isMobile = useMobilePlatform();

  return (
    
      <Section direction='vertical' gap={6}>
      <Character />
        <Aether />
        <Silver/>
        <Research />
        <Lumber />
        <Stone />
      </Section>
    
  );
};
