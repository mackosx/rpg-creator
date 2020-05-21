export class Passage {
  constructor(name, desc, top, left, weight, id) {
    this.name = name;
    this.desc = desc;
    this.top = top;
    this.left = left;
    this.weight = weight;
    this.isStart = false;
    this.id = id;
    this.isEnd = false;
  }
}
