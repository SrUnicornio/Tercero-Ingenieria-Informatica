export class Robot {
  constructor() {
    this.nameRobot = Robot.assignNewName();
  }

  public get name(): string {
    return this.nameRobot;
  }

  public resetName(): void {
    this.nameRobot = Robot.assignNewName();
  }

  public static releaseNames(): void {
    Robot.usedNames.clear();
  }

  private nameRobot: string = '';
  private static usedNames: Set<string> = new Set();
  
  private static assignNewName(): string {
    let name;
    do {
      name = Robot.generateRandomName();
    } while (Robot.usedNames.has(name));

    Robot.usedNames.add(name);
    return name
  }

  private static generateRandomName(): string {
    const letters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers: string = '0123456789';

    return (
      letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)] +
      numbers[Math.floor(Math.random() * 10)] +
      numbers[Math.floor(Math.random() * 10)] +
      numbers[Math.floor(Math.random() * 10)]
    ); 
  }
}


