import { ReactNode, FC } from 'react';

export interface ExternallyChangedProps {
  name: string;
  children: (externallyChanged: boolean) => ReactNode;
}

export interface OnBlurProps {
  name: string;
  children: () => void;
}

export interface OnChangeProps {
  name: string;
  children: (value: any, previous: any) => void;
}

export interface OnFocusProps {
  name: string;
  children: () => void;
}

export const OnBlur: FC<OnBlurProps>;

export const OnChange: FC<OnChangeProps>;

export const OnFocus: FC<OnFocusProps>;

export const ExternallyChanged: FC<ExternallyChangedProps>;
