let app = new Vue({
  el: "#main",
  data: {
    zoomLevel: false,
    passages: previous.data,
    title: previous.title,
    desc: previous.desc,
    isEditing: false,
    currentPassageEdit: 0
  },
  computed: {
    zoomClass: function() {
      return {
        "fa-search-plus": this.zoomLevel,
        "fa-search-minus": !this.zoomLevel
      };
    }
  },
  methods: {
    addPassage() {
      // Set the id of the new passage to one more than the biggest id
      const len = this.passages.vertices.length;
      let id = 0;
      if (this.passages.vertices[len - 1] !== undefined)
        id = this.passages.vertices[len - 1].data.id + 1;
      let newPassage = new Passage(
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
      this.currentPassageEdit = this.passages.getIndexOf(id);
      this.isEditing = true;
    },
    hideEditor() {
      //this.currentPassageEdit = -1;
      this.isEditing = false;
    },
    zoom() {
      this.zoomLevel = !this.zoomLevel;
      let psg = jQuery(".passage-item");
      let currWidth = psg.width();
      let currHeight = psg.height();
      if (this.zoomLevel) {
        psg.css("width", currWidth / 2);
        psg.css("height", currHeight / 2);
        this.drawArrows();
      } else {
        psg.css("width", currWidth * 2);
        psg.css("height", currHeight * 2);
      }
    },
    connect(from, to) {
      let conn;
      conn = jsPlumb.connect({
        source: from,
        target: to
      });
      return conn;
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
});
$(document).ready(function($) {
  let saved = false;
  $("#save-rpg").on("submit", function(e) {
    if (saved) {
      saved = false;
      return;
    }
    e.preventDefault();
    app.passages.compactToJSON(app.title, app.desc);
    saved = true;
    $(this).trigger("submit");
  });
});
