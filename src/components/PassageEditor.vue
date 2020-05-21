<template>
  <div
    id="passage-editor-container"
    v-if="current < passages.size() && ~current"
    v-show="display"
  >
    <transition name="showEditor">
      <div id="passage-editor">
        <h3>Edit Passage</h3>
        <button class="close-editor" @click="hide">
          <i class="fa fa-times"></i>
        </button>
        <label for="title-input">Title</label>
        <br />
        <input type="text" id="title-input" maxlength="100" v-model="title" />
        <label for="text-input">Text</label>
        <br />
        <textarea
          id="text-input"
          v-model="text"
          placeholder="Write your text here..."
        ></textarea>
        <label for="weight-input">Value</label>
        <br />
        <input
          type="number"
          min="-99"
          max="99"
          id="weight-input"
          v-model="value"
        />
        <div id="parent-editor">
          <label>Passages leading to this one</label>
          <!--Display current parents-->
          <template v-for="(parent, pIndex) in passages.vertices">
            <template v-for="(child, cIndex) in parent.edges">
              <ul class="current-parents" v-if="child.id == id" :key="cIndex">
                <li class="remove-link">
                  {{ passages.vertices[pIndex].data.name }}
                  <i class="fa fa-times"></i>
                </li>
              </ul>
            </template>
          </template>
        </div>

        <div id="child-editor">
          <label for="child-select">Choices</label>
          <select id="child-select" @change="selectChild">
            <option value selected>Select A Child</option>
            <template v-for="passage in passages.vertices">
              <option
                v-if="passage.data.id != id"
                :key="passage.data.id"
                :value="passage.data.id"
                >{{ passage.data.name }}</option
              >
            </template>
          </select>
          <ul class="current-children">
            <template v-for="child in edges">
              <li
                :key="child.id"
                class="remove-link"
                @click="removeChild(child.id)"
              >
                {{
                  passages.vertices[passages.getIndexOf(child.id)]
                    ? passages.vertices[passages.getIndexOf(child.id)].data.name
                    : ""
                }}
                <i class="fa fa-times"></i>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Digraph } from "../lib/AdjacencyList";
export default {
  props: {
    display: Boolean,
    hide: Function,
    current: Number,
    passages: Digraph
  },
  computed: {
    edges: {
      get() {
        return this.passages.vertices[this.current].edges;
      }
    },
    id: {
      get() {
        return this.passages.vertices[this.current].data.id;
      }
    },
    title: {
      get() {
        return this.passages.vertices[this.current].data.name;
      },
      set(val) {
        this.passages.vertices[this.current].data.name = val;
      }
    },
    text: {
      get() {
        return this.passages.vertices[this.current].data.desc;
      },
      set(val) {
        this.passages.vertices[this.current].data.desc = val;
      }
    },
    value: {
      get() {
        return this.passages.vertices[this.current].data.weight;
      },
      set(val) {
        this.passages.vertices[this.current].data.weight = val;
      }
    }
  },
  methods: {
    selectChild(e) {
      // add selected edges
      if (e.target.value !== "") {
        let id = parseInt(e.target.value);
        let index = this.passages.getIndexOf(id);
        let childEl = this.passages.vertices[index].data.element;
        let parentEl = this.passages.vertices[this.current].data.element; // not defined
        // add the element as an edge
        this.passages.vertices[this.current].addChild(parentEl, childEl, id);
        // jQuery("#child-select").val("");
      }
    },
    removeChild(childId) {
      this.passages.vertices[this.current].removeChild(childId);
    },
    defined() {
      return this.passages.vertices[this.current] !== undefined;
    }
  }
};
</script>
