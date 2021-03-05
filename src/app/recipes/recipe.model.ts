export class Recipe {

  constructor(name: string, description: string, imagePath: string) {
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
  }

  public name: string;
  public description: string;
  public imagePath: string;
}
