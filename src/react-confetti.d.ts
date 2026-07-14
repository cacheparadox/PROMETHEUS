declare module 'react-confetti' {
  import { Component } from 'react';

  export interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    friction?: number;
    wind?: number;
    gravity?: number;
    colors?: string[];
    opacity?: number;
    recycle?: boolean;
    run?: boolean;
    initialVelocityX?: number;
    initialVelocityY?: number;
    tweenDuration?: number;
    onConfettiComplete?: (confetti: any) => void;
  }

  export default class Confetti extends Component<ConfettiProps> {}
}
