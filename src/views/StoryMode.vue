<template>
  <div>
    <!-- // Story must have starting point to begin -->
    <p v-if="!foundStart">No starting point was found for this story.</p>
    <template v-else>
      <p>{{ description }}</p>
      <passage
        :current="currentPassage"
        :change="changeCurrentPassage"
        :passages="passages"
        :score="score"
        :again="playAgain"
      />
    </template>
  </div>
</template>

<script>
//TODO: Add transition effect to story display
import { Digraph } from "../lib/AdjacencyList";

function importData(data) {
  let d = new Digraph();
  if (data != null) d.vertices = data["vertices"];
  return d;
}

export default {
  data: function() {
    return {
      foundStart: false,
      passages: importData(rpgData[2]),
      currentPassage: rpgData[1],
      score: 0
    };
  },
  methods: {
    changeCurrentPassage(indexToChangeTo) {
      this.currentPassage = this.passages.vertices[indexToChangeTo];
      this.addPoints();
    },
    addPoints() {
      this.score += parseInt(this.currentPassage.data.weight);
    },
    playAgain() {
      this.score = 0;
      this.currentPassage = rpgData[1];
    }
  }
};
</script>
