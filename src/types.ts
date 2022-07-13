import { ReactNode } from 'react';

export enum SnapPoint {
  Top = 'Top',
  Bottom = 'Bottom',
}

export type BottomModalScrollableRef = {
  open: () => void;
  close: () => void;
};

export interface AbsoluteFooter {
  component: ReactNode;
  position?: number;
  // Use this variable if the footer is covering the end of the content of your modal scroll view
  // Providing a height will make the scroll view of the content bigger
  height?: number;
}
