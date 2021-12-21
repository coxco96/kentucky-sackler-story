var container = document.querySelector("#scroll");
var text = container.querySelector(".scroll__text");
var steps = text.querySelectorAll(".step");


// initiate scrollama
const scroller = scrollama();
scrollerStepClass();

// set up the instance, pass callback functions
function scrollerStepClass(){
scroller
    .setup({
        step: ".step", // HTML elements with class "step" .... required
        offset: 0.6, // how far from top of viewport to trigger step. default is 0.5 ... optional
        progress: false, // whether to fire step progress updates or not .... default false, optional
        threshold: 4, // granularity of progress interval in pixels (smaller = more  granular), default is 4, optional
        order: true, // fire previous step triggers if they were jumped // optional, default is true
        once: false, // only trigger the step to enter once then remove listener... optional, default is false
        debug: false, // whether to show visual debuggin tools or not.... optional, default is false
        parent: undefined // parent elemtn for step seletor (use if in shadow DOM), optional, default is undefined
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
    //.onStepProgress(handleStepProgress);
}




// set up resize event
window.addEventListener("resize", scroller.resize);


// event listeners

function handleStepEnter(response) {
    // response = { element, direction, index }
    console.log("enter", response);
    // add to color to current step
    response.element.classList.add("is-active");
    response.element.style.opacity = 1;
    response.element.style.animation = "fadeIn 1.25s";
}


function handleStepExit(response) {
    // response = { console, direction, index }
    console.log("exit", response);
    // remove color from current step
    response.element.classList.remove("is-active");
    if (response.direction === 'up') {
    response.element.style.opacity = 0;
    response.element.style.animation = "fadeOut 1.25s"
    }

}



// { element, index, direction }
// element: the step element that triggered
// index: the index of the step of all steps
// direction: 'up' or 'down'


