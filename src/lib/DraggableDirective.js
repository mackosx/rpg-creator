// Allows component to be dragged
export const Draggable = {
  bind: function(el) {
    el.style.position = "absolute";
    // index of selected passage
    let startX, startY, initialMouseX, initialMouseY;
    let index = el.attributes["data-i"].value;

    function mousemove(e) {
      e.preventDefault();
      let dx = e.clientX - initialMouseX;
      let dy = e.clientY - initialMouseY;
      dx;
      dy;
      startX;
      startY;
      index;

      // app.passages.vertices[index].data.top = startY + dy + "px";
      // app.passages.vertices[index].data.left = startX + dx + "px";

      return false;
    }
    function mouseup() {
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    }

    el.addEventListener("mousedown", function(e) {
      e.preventDefault();
      index = el.attributes["data-i"].value;
      startX = el.offsetLeft;
      startY = el.offsetTop;
      initialMouseX = e.clientX;
      initialMouseY = e.clientY;
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
      return false;
    });
  }
};
