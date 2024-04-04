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
    textElement.value = "Mark the points you want to perform Convex Hull on, or use the 'Random' feature for random points. Then, use 'Next' or 'Auto' or 'Fast' depending on whether you want to manually or automatically go through the steps or fast forward through all steps.";
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
    textElement.value = "Select the algorithm you want to visualize and then, click on 'Next' to manually go through the steps. Select option 'Auto' for automatically moving using time spaced steps, and option 'Fast' to fast forward through all the steps.";
    drawRandomPoints(10);
});

function updateTextElement() {
  // Step-by-step mode
  if(kirkpatrickSeidelRequested) {
    switch (Step) {
      case 0:
        textElement.value = "The Kirkpatrick-Seidel Algorithm is a efficient method for finding the convex hull of a set of points in the plane. It is a divide-and-conquer algorithm that recursively divides the set of points into smaller subsets, finds the convex hulls of these subsets, and then merges them to obtain the final convex hull.";
        break;
      case 1:
        textElement.value = "To begin, we draw a line 'L' that divides the point set into two roughly equal halves, with points on either side of the line. We also mark the points p_min and p_max, which have the minimum and maximum x-coordinates, respectively, in red color. These points are guaranteed to be part of the convex hull.";
        break;
      case 2:
        textElement.value = "Next, we calculate the slopes between arbitrary pairs of points and mark them in blue color. These slopes will be used to determine the median slope, which is a crucial step in the algorithm.";
        break;
      case 3:
        textElement.value = "We now find the median slope among all the calculated slopes and color it in purple. Slopes higher than the median slope are colored in brown, while slopes lower than the median slope are colored in orange. Any unpaired points (points not part of a calculated slope) are marked in green color to be considered for the next iteration of the algorithm.";
        break;
      case 4:
        textElement.value = "Using the median slope, we draw a line through all the candidate points. This line will be used to divide the point set into two subsets, which will be processed separately in the next steps.";
        break;
      case 5:
        textElement.value = "We now find the line with the median slope that passes through one of the candidate points and has the maximum y-intercept (for the upper bridge) or the minimum y-intercept (for the lower bridge). These lines will form the 'bridges' that connect the convex hulls of the two subsets.";
        break;
      case 6:
        textElement.value = "Mark those points green, which are to be considered for the next iteration in finding upper/lower bridge. Use the 3 lemmata that use the median slope to mark the points green. These help prune away the points that cannot be the end points of the upper/lower bridge.";
        break;
      case 7:
        textElement.value = "In this step, we focus only on the green points that were marked in the previous step. We prune all the blue points (previously calculated slopes) and calculate new slopes between the green points. These slopes will be used to find the convex hull of each subset recursively.";
        break;
      case 8:
        textElement.value = "Draw the upper/lower bridge between those points that are left unpruned after all the pruning steps. This red-lined bridge is part of the Convex Hull.";
        break;
      case 9:
        textElement.value = "The Convex Hull of the given set of points has been successfully constructed using the Kirkpatrick-Seidel Algorithm. This efficient divide-and-conquer approach allows us to find the convex hull in O(n log h) time, where n is the number of points and h is number of points in upper hull.";
        break;
      default:
        textElement.value = "An unexpected step value has been reached. Please check the implementation.";
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
        textElement.value = "Drawing lines to the points that are not 'potential next points' for the convex hull in blue colour";
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