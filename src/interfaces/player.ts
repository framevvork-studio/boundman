interface IPlayer {
  id: string;
  displayName: string;
  link: string;
  initialPositionX: number;
  particle: string | null;
  scale: number;
  speed: number;
}

export default IPlayer;
