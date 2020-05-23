// Allows component to be dragged
export const Draggable = {
  bind: function(el) {
    el.style.position = "absolute";
    let startX, startY, initialMouseX, initialMouseY;

    function mousemove(e) {
      e.preventDefault();
      let dx = e.clientX - initialMouseX;
      let dy = e.clientY - initialMouseY;

      el.style.top = startY + dy + "px";
      el.style.left = startX + dx + "px";

      return false;
    }
    function mouseup() {
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    }

    el.addEventListener("mousedown", function(e) {
      e.preventDefault();
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
