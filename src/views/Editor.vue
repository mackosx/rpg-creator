<template>
  <div>
    <h1>RPG Editor</h1>
    <div id="container">
      <div id="main">
        <svg
          id="svg-grid"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="smallGrid"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 16 0 L 0 0 0 16"
                fill="none"
                stroke="#00264c"
                stroke-width="0.75"
              />
            </pattern>
            <pattern
              id="grid"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <rect width="160" height="160" fill="url(#smallGrid)" />
              <path
                d="M 160 0 L 0 0 0 160"
                fill="none"
                stroke="#00264c"
                stroke-width="1"
              />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div class="toolbar">
          <div class="toolbar-tools">
            <button type="button" id="add-passage-btn" @click="addPassage">
              <font-awesome-icon
                :icon="['fas', 'plus']"
                aria-label="Add passage"
              />
            </button>
            <button type="button" id="zoom-btn" @click="zoom">
              <font-awesome-icon :icon="['fas', zoomClass]" aria-label="zoom" />
            </button>
          </div>
        </div>
        <div class="information-sidebar">
          <div class="info">
            <label for="title">Title</label>
            <br />
            <input id="title" v-model="title" />
            <label for="description">Description</label>
            <br />
            <textarea
              id="description"
              v-model="desc"
              placeholder="Story description..."
            ></textarea>
          </div>
        </div>
        <div class="passage-area">
          <template v-for="passage in passages.vertices">
            <Passage
              :passages="passages"
              :passage="passage.data"
              :zoom="zoomLevel"
              :show="showEditor"
              :index="passages.getIndexOf(passage.data.id)"
              :key="passage.data.id"
              @set-start="setStart"
              @set-end="setEnd"
              @remove="remove"
              :width="passageWidth"
              :height="passageHeight"
            />
          </template>
        </div>
        <PassageEditor
          :hide="hideEditor"
          :display="isEditing"
          :current="currentPassageEditIndex"
          :passages="passages"
          :passage="currentPassageEdit"
          @connect-child="connectChild"
          @remove-child="removeChild"
        ></PassageEditor>
        <template @heresData="listen"></template>
      </div>
    </div>
  </div>
</template>

<script>
import { Digraph } from "../lib/AdjacencyList";
import { PassageData } from "../lib/PassageData";
import { jsPlumb } from "jsplumb";
import PassageEditor from "@/components/PassageEditor";
import Passage from "@/components/Passage";

// imports story from localized data
// function checkStory(previousStory) {
//   if (!previousStory || previousStory === "") {
//     return
//   }
//   //parse json string
//   const s = JSON.parse(previousStory.data);
//   //create new digraph with object
//   p = new Digraph();
//   let data = p.importFromJSON(s);
//   return {
//     title: data.title,
//     desc: data.desc,
//     data: p
//   };
// }
const story = {
  title: "New Story",
  desc: "",
  data: new Digraph()
};

export default {
  data: function() {
    return {
      zoomLevel: false,
      passages: story.data,
      title: story.title,
      desc: story.desc,
      isEditing: false,
      currentPassageEditIndex: 0,
      passageWidth: 150,
      passageHeight: 150
    };
  },
  components: { PassageEditor, Passage },
  computed: {
    zoomClass: function() {
      return this.zoomLevel ? "search-plus" : "search-minus";
    },
    currentPassageEdit() {
      return this.passages.vertices[this.currentPassageEditIndex];
    }
  },
  methods: {
    removeChild(childId) {
      this.currentPassageEdit.removeChild(childId);
    },
    connectChild(childId, parentNode) {
      // add selected edges
      const index = this.passages.getIndexOf(childId);
      const childEl = this.passages.vertices[index].data.element;
      const parentEl = parentNode.data.element; // not defined
      console.log(parentNode);
      // add the element as an edge
      parentNode.addChild(parentEl, childEl, childId);
      document.querySelector("#child-select").value = "";
    },
    setEnd(passage) {
      for (let i = 0; i < this.passages.vertices.length; i++) {
        this.passages.vertices[i].data.isEnd = false;
      }
      passage.isStart = false;
      passage.isEnd = true;
    },
    // Deletes this passage from the list of vertices
    remove(passage) {
      //e.stopPropagation();
      this.passages.removeVertex(passage.id);
      if (this.passages.size()) this.current = 0;
      else this.current = -1;
    },
    setStart(passage) {
      this.passages.vertices.forEach((v) => {
        v.data.isStart = false;
      });

      passage.isEnd = false;
      passage.isStart = true;
    },
    addPassage() {
      // Set the id of the new passage to one more than the biggest id
      const len = this.passages.vertices.length;
      let id = 0;
      if (this.passages.vertices[len - 1] !== undefined)
        id = this.passages.vertices[len - 1].data.id + 1;
      let newPassage = new PassageData(
        "Untitled " + (id + 1),
        "",
        "80px",
        "80px",
        0,
        id
      );
      this.passages.addVertex(newPassage);
      //this.showEditor(newPassage.id);
    },
    showEditor(id) {
      this.currentPassageEditIndex = this.passages.getIndexOf(id);
      this.isEditing = true;
    },
    hideEditor() {
      //this.currentPassageEditIndex = -1;
      this.isEditing = false;
    },
    zoom() {
      this.zoomLevel = !this.zoomLevel;
      if (this.zoomLevel) {
        this.passageWidth = this.passageWidth / 2;
        this.passageHeight = this.passageHeight / 2;
        this.drawArrows();
      } else {
        this.passageWidth = this.passageWidth * 2;
        this.passageHeight = this.passageHeight * 2;
      }
    },
    connect(from, to) {
      return jsPlumb.connect({
        source: from,
        target: to
      });
    },
    drawArrows() {
      // resets endpoints and draws arrows from scratch based on edge array
      jsPlumb.ready(function() {
        jsPlumb.deleteEveryEndpoint();
      });
      for (let i = 0; i < this.passages.vertices.length; i++) {
        let el = this.passages.vertices[i].data.element;
        for (let j = 0; j < this.passages.vertices[i].edges.length; j++) {
          let edgeId = this.passages.vertices[i].edges[j].id;
          let connectingEdgeIndex = this.passages.getIndexOf(edgeId);
          let childEl = this.passages.vertices[connectingEdgeIndex].data
            .element;
          if (edgeId === this.passages.vertices[connectingEdgeIndex].data.id) {
            jsPlumb.ready(() => {
              this.passages.vertices[i].edges[j].connection = this.connect(
                el,
                childEl
              );
            });
          }
        }
      }
    }
  },
  created: function() {
    jsPlumb.ready(function() {
      // Set up defaults for nice arrows with mostly straight lines
      jsPlumb.importDefaults({
        Overlays: [
          ["Arrow", { location: 1, width: 15, height: 15, id: "arrow" }]
        ],
        Endpoints: ["Blank", "Blank"],
        Connector: ["Bezier", { curviness: 20 }],
        MaxConnections: 5,
        Anchor: ["Perimeter", { shape: "Square" }]
      });
      // jsPlumb.bind('connection', function (info, ev) {
      // 	// Check if not from mouse event, means initial setup connections
      // 	let sourceIndex = parseInt(info.source.parentElement.attributes['data-i'].value);
      // 	let targetIndex = parseInt(info.target.attributes['data-i'].value);
      // 	let targetId = app.passages.vertices[targetIndex].data.id;
      // 	app.passages.vertices[sourceIndex].addChildNode(targetId, info.connection);
      // });
      // jsPlumb.bind('connectionDetached', function (info, ev) {
      // 	let sourceIndex = parseInt(info.source.parentElement.attributes['data-i'].value);
      // 	let targetIndex = parseInt(info.target.attributes['data-i'].value);
      // 	let targetId = app.passages.vertices[targetIndex].data.id;
      // 	app.passages.vertices[sourceIndex].removeChild(targetId);
      // });
    });
  },
  mounted: function() {
    this.drawArrows();
  }
};
</script>
