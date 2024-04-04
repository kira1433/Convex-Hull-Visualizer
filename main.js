var counter = 0;
canvas.addEventListener('click', async(event) => {
    await clear();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points.push({ x, y ,color:'black'});
    drawCurrent();
});

async function clear() {
    counter++;
    Step = 0;
    jarvisMarchRequested = false;
    kirkpatrickSeidelRequested = false;
    lines.length = 0;
    temp_lines.length = 0;
    for(let p of points)p.color = 'black';
    drawCurrent();
}


const AutoInput = document.getElementById('option2');
const FastInput = document.getElementById('option3');
AutoInput.addEventListener('click', function() {
  if(autoRequested){
    this.checked = false;
    autoRequested = false;
    return;
  }
  else if(fastRequested){
    fastRequested = false;
    clear();
    updateTextElement();
  }
  autoRequested = true;
  document.getElementById('nextBtn').click();
});
FastInput.addEventListener('click', function() {
  if(fastRequested){
    this.checked = false;
    fastRequested = false;
    clear();
    updateTextElement();
    return;
  }
  else if(autoRequested){
    autoRequested = false;
  }
  clear();
  updateTextElement();
  fastRequested = true;

});
// Add event listener for clear button
const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', async() => {
    points.length = 0;
    await clear();
    textElement.value = "Turn on the slider to automatically go through the steps. For manually observing the steps, click on the algorithm you want to visualize.";
  });

// Add event listener for rand button
const randBtn = document.getElementById('randBtn');
randBtn.addEventListener('click', async() => {
    points.length = 0;
    Step = 0;
    Step = 0;
    jarvisMarchRequested = false;
    kirkpatrickSeidelRequested = false;
    await clear();
    textElement.value = "Turn on the slider to automatically go through the steps. For manually observing the steps, click on the algorithm you want to visualize.";
    drawRandomPoints(10);
});

function updateTextElement() {
  // Step-by-step mode
  if(kirkpatrickSeidelRequested) {
    switch (Step) {
      case 0:
        textElement.value = "Convex Hull using the Kirkpatrick-Seidel Algorithm.";
        break;
      case 1:
        textElement.value = "Draw a line 'L' which divides the point set into 2 equal halves on either side. Mark the points: p_min and p_min in red colour.";
        break;
      case 2:
        textElement.value = "Mark the slopes between arbitrary points marked in blue";
        break;
      case 3:
        textElement.value = "Median slope of all - coloured in purple. Slopes higher than median - coloured in brown. Slopes lower than median - coloured in orange. Also, mark the unpaired points (if any) green to consider them for the next iteration.";
        break;
      case 4:
        textElement.value = "Draw the median slope line through all candidates";
        break;
      case 5:
        textElement.value = "Find the line with median slope, passing through one of the candidates and having: the maximum y-intercept - for upper bridge and the minimum y-intercept - for lower bridge.";
        break;
      case 6:
        textElement.value = "Mark those points green, which are to be considered for the next iteration in finding upper/lower bridge.";
        break;
      case 7:
        textElement.value = "Consider only the green points for finding this upper/lower bridge, ignore all the blue points from further consideration. Mark the slopes between only these points now.";
        break;
      case 8:
        textElement.value = "Draw the upper/lower bridge obtained.";
        break;
      case 9:
        textElement.value = "The Convex-Hull is constructed using Kirkpatrick-Seidel Algorithm.";
        break;
      default:
        textElement.value = "Unexpected step value reached.";
        break;
    }
  }
  else if (jarvisMarchRequested) {
    switch(Step) {
      case 0:
        textElement.value = "Convex Hull using the Jarvis-March Algorithm.";
        break;
      case 1:
        textElement.value = "Drawing lines to the potential next points in green colour";
        break;
      case 2:
        textElement.value = "Drawing lines to the potential next points in green colour";
        break;
      case 3:
        textElement.value = "Drawing lines to the points that are not selected as next point for the convex hull in blue colour";
        break;
      case 4:
        textElement.value = "Slopes from current left-most point to all other points have been marked";
        break;
      case 5:
        textElement.value = "From all the marked lines, pick the latest drawn green line as an edge in the convex hull";
        break;
      case 6:
        textElement.value = "Convex-Hull constructed using Jarvis-March Algorithm";
        break;
      default:
        break;
    }
  }
  else {
    textElement.value = "Click on the algorithm you want to visualize"
  }
}

const nextBtn = document.getElementById('nextBtn');
nextBtn.addEventListener('click', async () => {
    updateTextElement();
});

async function wait(time) {
    if(FastInput.checked) {
      await new Promise(resolve => setTimeout(resolve, time));
    } else
    if (AutoInput.checked) {
      await Promise.race([new Promise(resolve => setTimeout(resolve, 2500, updateTextElement())),new Promise(resolve => {document.getElementById('nextBtn').addEventListener('click', resolve);})  ]); 
    } else {
      await new Promise(resolve => {
        document.getElementById('nextBtn').addEventListener('click', resolve);
      });
    }
  } 

// Jarvis March Convex Hull algorithm
const jarvisMarchBtn = document.getElementById('jarvisMarchBtn');
jarvisMarchBtn.addEventListener('click', async () => {
    await clear();
    jarvisMarchRequested = true;
    updateTextElement();
    if(document.getElementById('option3').checked) jarvisMarch_fast(points, counter);
    else jarvisMarch(points, counter);
});

// Kirkpatrick-Seidel Convex Hull algorithm
const kirkpatrickSeidelBtn = document.getElementById('kirkpatrickSeidelBtn');
kirkpatrickSeidelBtn.addEventListener('click', async () => {
    await clear();
    kirkpatrickSeidelRequested = true;
    updateTextElement();
    if(document.getElementById('option3').checked) kirkpatrickSeidel_fast(points, counter);
    else kirkpatrickSeidel(points, counter);
});

setInterval(drawCurrent, 5);
takeTextInput();