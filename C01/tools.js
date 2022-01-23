// Text Wrap
function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
              lineHeight = 1.0, // ems
              x = text.attr("x"),
              y = text.attr("y"),
              dy = 0, 
              tspan = text.text(null)
              .append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", dy + "em");
              while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                  line.pop();
                  
                  tspan.text(line.join(" "));
                  line = [word];
                  tspan = text.append("tspan")
                  .attr("x", x)
                  .attr("y", y)
                  .attr("dy", ++lineNumber * lineHeight + dy + "em")
                  .text(word);
                }}})}
// Tooltip 
window.onload = () => {
                  tippy('[title]', {   
                    arrow: true,
                    placement: 'top',
                    delay: 5, 
                    followCursor: false,
                    allowHTML: true,
                    theme: 'custom',
                    ignoreAttributes: true,
                    content(reference) {
                      const title = reference.getAttribute('title');
                      const date = reference.getAttribute('date');
                      let fill = reference.getAttribute('fill');
                      return `<style>
                        .tippy-tooltip.custom-theme{
                          box-shadow: 1px 1px 1px 1px ${fill};
                          border: 1px solid ${fill};
                        }
                        .tippy-tooltip.custom-theme .tippy-arrow {
                          transform: translateY(2px);
                          border-top-color: ${fill};
                        
                          .tippy-arrow {
                            transform-style: preserve-3d;
                        }
                        .tippy-tooltip.custom-theme .tippy-arrow::after {
                          content: "";
                          position: absolute;
                          top: -8px;
                          transform: translateZ(-1px);
                          border-top: 8px solid transparent;
                          border-bottom: 8px solid transparent;
                          border-right: 8px solid red;
                        }
                      </style>
                
                      <p style="color: grey;">${date}</p> 
                      <p><span style="font-size: 18px;color: ${fill};"> ● </span>${companyName}: <strong>${title}</strong></p>`
                    }, 
                  });
};
  