<template>
  <div id="passage-editor-container" v-if="display && current !== -1">
    <transition name="showEditor">
      <div id="passage-editor">
        <h3>Edit Passage</h3>
        <button class="close-editor" @click="hide">
          <font-awesome-icon :icon="['fas', 'times']" />
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
                  <font-awesome-icon :icon="['fas', 'times']" />
                </li>
              </ul>
            </template>
          </template>
        </div>

        <div id="child-editor">
          <label for="child-select">Choices</label>
          <select id="child-select" @change="connectChild">
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
                <font-awesome-icon :icon="['fas', 'times']" />
              </li>
            </template>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Digraph, Node } from "../lib/AdjacencyList";
export default {
  props: {
    display: Boolean,
    hide: Function,
    current: Number,
    passages: Digraph,
    passage: Node
  },
  methods: {
    connectChild(e) {
      if (e.target.value !== "") {
        const childId = parseInt(e.target.value);
        this.$emit("connect-child", childId, this.passage);
      }
    },
    removeChild(childId) {
      this.$emit("remove-child", childId);
    }
  }
};
</script>
