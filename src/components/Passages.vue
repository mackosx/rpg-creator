<template>
  <div class="passage-area">
    <template v-for="passage in passages.vertices">
      <Passage
        :passages="passages"
        :passage="passage.data"
        :zoom="zoom"
        :show="show"
        :index="passage.data.id"
        :key="passage.data.id"
      />
    </template>
  </div>
</template>

<script>
import Passage from "./Passage";
import { Digraph } from "../lib/AdjacencyList";

export default {
  components: { Passage },
  props: {
    passages: Digraph,
    show: Function,
    zoom: Boolean
  }
};
</script>
