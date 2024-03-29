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
    jarvisMarchRequested = false;
    kirkpatrickSeidelRequested = false;
    textElement.value = "Information will be displayed here...";
    await clear();
});

// Add event listener for rand button
const randBtn = document.getElementById('randBtn');
randBtn.addEventListener('click', async() => {
    points.length = 0;
    currentStep = 0;
    marchStep = 0;
    jarvisMarchRequested = false;
    kirkpatrickSeidelRequested = false;
    textElement.value = "Information will be displayed here...";
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
        textElement.value = "Draw a line 'L' which divides the point set into 2 equal halves on either side";
        break;
      case 2:
        textElement.value = "Mark the slopes between arbitrary points";
        break;
      case 3:
        textElement.value = "Find median slope, changing colours of points, different colours of slopes";
        break;
      case 4:
        textElement.value = "Draw the median slope line through all candidates";
        break;
      case 5:
        textElement.value = "Find the line with median slope, passing through one of the candidates and having the maximum y-intercept";
        break;
      case 6:
        textElement.value = "Prune the blue points from further consideration in this upper-bridge";
        break;
      case 7:
        textElement.value = "Consider only the green points for finding this upper-bridge, ignore all the blue points from further consideration. Mark the slopes between only these points now.";
        break;
      case 8:
        textElement.value = "Draw the upper-bridge obtained";
        break;
      case 9:
        textElement.value = "The Convex-Hull is constructed";
        break;
      default:
        textElement.value = "No more steps to perform.";
        break;
    }
  }
  else if (jarvisMarchRequested) {
    switch(marchStep) {
      case 1:
        textElement.value = "Convex-Hull constructed using Jarvis-March Algorithm";
        break;
      case 2:
        textElement.value = "Convex-Hull constructed using Jarvis-March Algorithm";
        break;
      case 3:
        textElement.value = "Convex-Hull constructed using Jarvis-March Algorithm";
        break;
      case 4:
        textElement.value = "Convex-Hull constructed using Jarvis-March Algorithm";
        break;
      case 5:
        textElement.value = "Draw the bridge line - change to lingo of Jarvis March";
        break;
      case 6:
        textElement.value = "Convex-Hull constructed using Jarvis-March Algorithm";
        break;
      default:
        
        break;
    }
  }
  else {
    textElement.value = "Click on the algorithm you want to visualize first!"
  }
}

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