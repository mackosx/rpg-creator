<template>
  <div
    class="passage-item connect"
    :class="{ dragged: moving && edit }"
    @mousedown="mouseDown"
    @mouseup="moving = false"
    @mouseleave="moving = edit = false"
    @mouseenter="edit = true"
    :data-i="index"
    :style="style"
    v-draggable
  >
    <div class="passage-identifier" v-if="passage.isStart === true">
      <font-awesome-icon
        :icon="['fas', 'rocket']"
        title="starting passage"
        aria-label="starting passage"
      />
    </div>
    <div class="passage-identifier" v-if="passage.isEnd === true">
      <font-awesome-icon
        :icon="['fas', 'stop-circle']"
        aria-label="The ending passage"
      />
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
import { Draggable } from "../lib/DraggableDirective";
import { PassageData } from "../lib/PassageData";
import { jsPlumb } from "jsplumb";

export default {
  props: {
    passage: PassageData,
    show: Function,
    index: Number,
    zoom: Boolean,
    width: Number,
    height: Number
  },
  directives: {
    draggable: Draggable
  },
  computed: {
    style() {
      return {
        top: this.passage.top,
        left: this.passage.left,
        width: `${this.width}px`,
        height: `${this.height}px`
      };
    }
  },
  methods: {
    setStart() {
      this.$emit("set-start", this.passage);
    },
    setEnd() {
      this.$emit("set-end", this.passage);
    },
    remove() {
      this.$emit("remove", this.passage);
    },
    mouseDown(e) {
      this.moving = true;
      e.target.dispatchEvent(new Event("click", { bubbles: true }));
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
    jsPlumb.draggable(this.$el, {
      containment: true
    });
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
