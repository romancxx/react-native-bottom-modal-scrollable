import {View} from 'react-native';
import styled from 'styled-components';
export const SCROLLABLE_INDICATOR_HEIGHT = 25;

export const ContainerNonClickable = styled(View)`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  /* z-index: 9999999; z-index higher than Container component of @components */
`;

export const ContainerClickable = styled(View)`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 0px;
`;

export const BackgroundOpacity = styled(View)`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: black;
`;

interface ContainerModalProps {
  backgroundColor: string;
  height: number;
}

export const ContainerModal = styled(View)<ContainerModalProps>`
  overflow: hidden;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background-color: ${props => props.backgroundColor};
  height: ${props => props.height}px;
`;

interface BgColorProps {
  backgroundColor: string;
}

export const ContainerScrollIndicator = styled(View)<BgColorProps>`
  height: ${SCROLLABLE_INDICATOR_HEIGHT}px;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background-color: ${props => props.backgroundColor};
  z-index: 2;
`;

export const ScrollIndicator = styled(View)`
  background-color: #6d6d6d;
  width: ${55}px;
  height: ${5}px;
  border-radius: ${15}px;
`;

interface ContainerFooterProps {
  bottom: number;
}

export const ContainerFooter = styled(View)<ContainerFooterProps>`
  position: absolute;
  right: 0px;
  bottom: ${props => props.bottom}px;
`;
