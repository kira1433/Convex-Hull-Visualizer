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
    currentStep = 0;
    marchStep = 0;
    jarvisMarchRequested = false;
    kirkpatrickSeidelRequested = false;
    lines.length = 0;
    temp_lines.length = 0;
    drawCurrent();
}

// Add event listener for clear button
const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', async() => {
    points.length = 0;
    currentStep = 0;
    marchStep = 0;
    fastForwardRequested = false;
    jarvisMarchRequested = false;
    kirkpatrickSeidelRequested = false;
    textElement.value = "Turn on the slider to automatically go through the steps. For manually observing the steps, click on the algorithm you want to visualize.";
    await clear();
});

// Add event listener for rand button
const randBtn = document.getElementById('randBtn');
randBtn.addEventListener('click', async() => {
    points.length = 0;
    currentStep = 0;
    marchStep = 0;
    fastForwardRequested = false;
    jarvisMarchRequested = false;
    kirkpatrickSeidelRequested = false;
    textElement.value = "Turn on the slider to automatically go through the steps. For manually observing the steps, click on the algorithm you want to visualize.";
    await clear();
    drawRandomPoints(10);
});

document.getElementById('switchInput').addEventListener('change', function() {
        document.getElementById('nextBtn').click();
});

function updateTextElement() {
  // Step-by-step mode
  if(kirkpatrickSeidelRequested) {
    switch (currentStep) {
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
    switch(marchStep) {
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

// const fastForwardBtn = document.getElementById('fastForwardBtn');
// fastForwardBtn.addEventListener('click', async() => {
//   fastForwardRequested = true;

//   const targetMessage = "Convex-Hull constructed using Jarvis-March Algorithm";
//   const textElement = document.getElementById('textElement');

//   while (textElement.value !== targetMessage) {
//     document.getElementById('nextBtn').click();
//   }

//   fastForwardRequested = false;
// });

const nextBtn = document.getElementById('nextBtn');
nextBtn.addEventListener('click', async () => {
    updateTextElement();
});

const switchInput = document.getElementById('switchInput');
switchInput.addEventListener('change', function() {
  if(kirkpatrickSeidelRequested && switchInput.checked) {
    document.getElementById('kirkpatrickSeidelBtn').click();
  }
  if(jarvisMarchRequested && switchInput.checked) {
    document.getElementById('jarvisMarchBtn').click();
  }
});

async function wait(time = 2000) {
    const switchInput = document.getElementById('switchInput');

    // if(fastForwardRequested) {
    //   await new Promise(resolve => setTimeout(resolve, 100, document.getElementById('nextBtn').click()));
    // }

    if (switchInput.checked) {
      await new Promise(resolve => setTimeout(resolve, 5000, document.getElementById('nextBtn').click())); // Wait for 2 seconds
    } else {
      await new Promise(resolve => {
        document.getElementById('nextBtn').addEventListener('click', resolve);
      });
    }
  }

// Jarvis March Convex Hull algorithm
const jarvisMarchBtn = document.getElementById('jarvisMarchBtn');
jarvisMarchBtn.addEventListener('click', async () => {
    currentStep = 0;
    marchStep = 0;
    jarvisMarchRequested = true;
    document.getElementById('nextBtn').click();
    await clear();
    jarvisMarchRequested = true;
    jarvisMarch(points, counter);
});

// Kirkpatrick-Seidel Convex Hull algorithm
const kirkpatrickSeidelBtn = document.getElementById('kirkpatrickSeidelBtn');
kirkpatrickSeidelBtn.addEventListener('click', async () => {
    currentStep = 0;
    marchStep = 0;
    kirkpatrickSeidelRequested = true;
    document.getElementById('nextBtn').click();
    await clear();
    kirkpatrickSeidelRequested = true;
    kirkpatrickSeidel(points, counter);
});

setInterval(drawCurrent, 5);
drawRandomPoints(10);