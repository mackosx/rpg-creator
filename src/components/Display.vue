<template>
  <transition name="fade" :duration="1000">
    <div class="passage" v-show="!transition">
      <h3>{{ current.data.name }}</h3>
      <p>{{ current.data.desc }}</p>
      <ul class="options">
        <template v-for="child in current.edges">
          <li
            :key="child.id"
            @click="changePassage(passages.getIndexOf(child.id))"
          >
            <a>
              {{
                "Choose : " +
                  passages.vertices[passages.getIndexOf(child.id)].data.name
              }}
            </a>
          </li>
        </template>
      </ul>
      <div class="end" v-if="current.data.isEnd">
        {{ sendScoreToDatabase() }}
        <p>You have completed this section.</p>
        <p>You scored {{ score }} points.</p>
        <button type="button" @click="again">
          <p>Play Again</p>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
import { Digraph } from "../lib/AdjacencyList";
export default {
  props: {
    current: Number,
    change: Function,
    passages: Digraph,
    score: Number,
    again: Function,
    title: String
  },

  data: function() {
    return {
      transition: false
    };
  },
  methods: {
    changePassage(index) {
      this.transition = true;
      this.change(index);
      this.transition = false;
    },
    sendScoreToDatabase() {}
  }
};
</script>
