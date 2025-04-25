import { useClick, useMobilePlatform } from 'phaser-react-ui';
import React, { useRef } from 'react';

import type { BuildingControl } from '~scene/world/entities/building/types';

import { phrase } from '~lib/lang';
import { Cost } from '~scene/system/interface/cost';

import {
  Container, Label, Addon, Main, Key,
} from './styles';

type Props = {
  control: BuildingControl
};

export const Action: React.FC<Props> = ({ control }) => {
  const isMobile = useMobilePlatform();

  const refContainer = useRef<HTMLDivElement>(null);

  useClick(refContainer, 'down', () => {
    control.onClick();
  }, [control.onClick]);

  return (
    <Container ref={refContainer} $disabled={control.disabled}>
      <Main>
        {!isMobile && (
          <Key>{control.hotkey}</Key>
        )}
        <Label>{phrase(control.label)}</Label>
      </Main>
      {!!control.cost && (
        <Addon>
          <Cost type={control.asset} value={control.cost} />

        </Addon>
      )}
    </Container>
  );
};
