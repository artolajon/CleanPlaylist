import { ArtistCandidate } from './artist-candidate';
import { Artist } from 'src/app/interfaces/artist';

describe('ArtistCandidate', () => {
  it('should create an instance', () => {
    let list: Artist[] = []
    expect(new ArtistCandidate("", list)).toBeTruthy();
  });

  it('should choose first artist (Same input)', () => {
    let fakeNames = ["Sum41", "Rammstein ","Linkin Park","Disturbed"];
    let input = "Sum41";
    let expectedId = "0";

    let list = createFakeList(fakeNames);
    let candidate = new ArtistCandidate(input, list)

    expect(candidate.selected?.id).toEqual(expectedId);

  });

  it('should choose second artist (Same input)', () => {
    let fakeNames = ["Sum41", "Rammstein ","Linkin Park","Disturbed"];
    let input = "Rammstein ";
    let expectedId = "1";

    let list = createFakeList(fakeNames);
    let candidate = new ArtistCandidate(input, list)

    expect(candidate.selected?.id).toEqual(expectedId);

  });

  it('should choose artist (Same input width spaces [trim])', () => {
    let fakeNames = ["Sum41", "Rammstein ","Linkin Park","Disturbed"];
    let input = "  Rammstein     ";
    let expectedId = "1";

    let list = createFakeList(fakeNames);
    let candidate = new ArtistCandidate(input, list)

    expect(candidate.selected?.id).toEqual(expectedId);
  });

  it('should choose artist (Same input, original width spaces)', () => {
    let fakeNames = ["Sum41", "Rammstein ","Linkin Park","Disturbed"];
    let input = "Rammstein";
    let expectedId = "1";

    let list = createFakeList(fakeNames);
    let candidate = new ArtistCandidate(input, list)

    expect(candidate.selected?.id).toEqual(expectedId);
  });

  it('should choose artist (lowercase input, original width spaces)', () => {
    let fakeNames = ["Sum41", "Rammstein ","Linkin Park","Disturbed"];
    let input = "rammstein";
    let expectedId = "1";

    let list = createFakeList(fakeNames);
    let candidate = new ArtistCandidate(input, list)

    expect(candidate.selected?.id).toEqual(expectedId);
  });

  it('should not choose artist (wrong input)', () => {
    let fakeNames = ["Sum41", "Rammstein ","Linkin Park","Disturbed"];
    let input = "Eminem";

    let list = createFakeList(fakeNames);
    let candidate = new ArtistCandidate(input, list)

    expect(candidate.selected).toEqual(undefined);

  });

  it('should not choose artist (Same input, space removed)', () => {
    let fakeNames = ["Sum41", "Rammstein ","Linkin Park","Disturbed"];
    let input = "LinkinPark";

    let list = createFakeList(fakeNames);
    let candidate = new ArtistCandidate(input, list)

    expect(candidate.selected).toEqual(undefined);

  });

  it('should not choose artist (two elements with same value)', () => {
    let fakeNames = ["Sum41", "Sum41", "Rammstein ","Linkin Park","Disturbed"];
    let input = "Sum41";


    let list = createFakeList(fakeNames);
    let candidate = new ArtistCandidate(input, list)

    expect(candidate.selected).toEqual(undefined);

  });

  it('should choose artist (especial characters)', () => {
    let fakeNames = ["Måneskin", "Sum41", "Rammstein ","Linkin Park","Disturbed"];
    let input = "Måneskin";
    let expectedId = "0";

    let list = createFakeList(fakeNames);
    let candidate = new ArtistCandidate(input, list)

    expect(candidate.selected?.id).toEqual(expectedId);

  });

  it('should not choose artist (especial characters)', () => {
    let fakeNames = ["Måneskin", "Sum41", "Rammstein ","Linkin Park","Disturbed"];
    let input = "Maneskin";


    let list = createFakeList(fakeNames);
    let candidate = new ArtistCandidate(input, list)

    expect(candidate.selected).toEqual(undefined);

  });

});

function createFakeList(fakeNames: string[]) : Artist[]{

  return fakeNames.map((name: string, index: number) =>{
    return {
      "name": name,
      "externalUrls": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      },
      "followers": {
        "href": "string",
        "total": 0
      },
      "genres": [
        "string"
      ],
      "href": "string",
      "id": index.toString(),
      "images": [
        {
          "height": 0,
          "width": 0,
          "url": "string"
        }
      ],
      "popularity": 0,
      "type": "string",
      "uri": "string"
    };
  });
}

