import { Artist } from "../interfaces/artist";

export class ArtistCandidate {
  originalInput!: string;
  selected!: Artist | undefined;
  alternatives!: Artist[];

  constructor(originalInput: string, options: Artist[]){
    this.originalInput = originalInput;
    this.alternatives=options;

    let artist = options.filter(c=> c.name.toLowerCase().trim() == originalInput.toLowerCase().trim());
    if (artist.length == 1){
      this.selected = artist[0];
    }

  }
}
