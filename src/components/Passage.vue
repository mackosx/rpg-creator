<template>
  <div
    class="passage-item connect"
    :class="{ dragged: moving && edit }"
    @mousedown="mouseDown"
    @mouseup="moving = false"
    @mouseleave="moving = edit = false"
    @mouseenter="edit = true"
    :data-i="passages.getIndexOf(index)"
    :style="{ top: passage.top, left: passage.left }"
    v-draggable
  >
    <div class="passage-identifier" v-show="passage.isStart === true">
      <i class="fa fa-rocket" aria-label="The starting passage"></i>
    </div>
    <div class="passage-identifier" v-if="passage.isEnd === true">
      <i class="fa fa-stop-circle-o" aria-label="The ending passage"></i>
    </div>
    <div class="passage-content">
      <h2>{{ passage.name }}</h2>
      <p v-show="!zoom">{{ passage.desc }}</p>
    </div>
    <div class="passage-value">
      {{ passage.weight > 0 ? "+" + passage.weight : passage.weight }}
    </div>
    <div
      class="passage-options"
      :style="{ display: edit && !moving ? 'block' : 'none' }"
    >
      <div class="edit-passage-button" @click="show(index)">
        <font-awesome-icon
          :icon="['fas', 'edit']"
          title="Edit"
          aria-label="Edit"
        />
      </div>
      <div class="designate-start-button" @click="setStart">
        <font-awesome-icon
          :icon="['fas', 'rocket']"
          title="Set as Start"
          aria-label="Set as Start"
        />
      </div>
      <div class="designate-end-button" @click="setEnd">
        <font-awesome-icon
          :icon="['fas', 'stop-circle']"
          title="Set as End"
          aria-label="Set as End"
        />
      </div>
      <div class="delete-passage-button" @click="remove">
        <font-awesome-icon
          :icon="['fas', 'trash']"
          title="Delete"
          aria-label="Delete"
        />
      </div>
    </div>
  </div>
</template>

<script>
// import { jsPlumb } from "jsplumb";
import { DraggableDirective } from "../lib/DraggableDirective";
import { Digraph } from "../lib/AdjacencyList";

export default {
  props: {
    passage: Object,
    show: Function,
    index: Number,
    zoom: Boolean,
    passages: Digraph
  },
  directives: {
    draggable: DraggableDirective
  },
  methods: {
    // Removes start designation from all other passages, then set this passage as start
    setStart: function() {
      for (let i = 0; i < this.passages.vertices.length; i++) {
        this.passages.vertices[i].data.isStart = false;
      }
      console.log(this.passage, this);
      this.passage.isEnd = false;
      this.passage.isStart = true;
    },
    setEnd: function() {
      for (let i = 0; i < this.passages.vertices.length; i++) {
        this.passages.vertices[i].data.isEnd = false;
      }
      this.passage.isStart = false;
      this.passage.isEnd = true;
    },
    // Deletes this passage from the list of vertices
    remove: function() {
      //e.stopPropagation();
      this.passages.removeVertex(this.passage.id);
      if (this.passages.size()) this.current = 0;
      else this.current = -1;
    },
    mouseDown: function() {
      this.moving = true;
      // jQuery(e.target).trigger("click");
    }
  },
  data: function() {
    return {
      edit: false,
      moving: false
    };
  },
  mounted() {
    // when rendered
    // jsPlumb.draggable(jQuery(this.$el), {
    //   containment: true
    // });
    this.passage.element = this.$el.id;
    // jsPlumb.ready(() => {
    // 	let incoming = this.$el;
    // 	jsPlumb.makeTarget(incoming, {
    // 		allowLoopback: false
    // 	});
    //
    // 	let outgoing = jQuery(this.$el).children('.passage-identifier.outgoing').get(0);
    // 	jsPlumb.makeSource(outgoing);
    // 	console.log(incoming, outgoing);
    // });
  }
};
</script>
