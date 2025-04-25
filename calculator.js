"use strict";
console.log("Hello OpenXcell!");
console.log('     ');

function rounder(x) {
    return Number.parseFloat(x).toFixed(2);
};

function rounder1(x) {
    return Number.parseFloat(x).toFixed(1);
};

// INNITIALIZED variables used in calculations
let percentMaleWorkers = 0;
let percentFemaleWorkers = 0;

let percentMalesFatigued_RH = 0;
let percentMalesFatigued_LH = 0;
let percentFemalesFatigued_RH = 0;
let percentFemalesFatigued_LH = 0;

let percentWorkersFatigued = 0;

let cycleTime = 0;

// TESTING MODIFIER used for testing purposes (i.e., increase force magnitude by 50%, 100%, etc.)
let testModifier = 0;

// USER INPUTS
percentFemaleWorkers = 50;
percentMaleWorkers = 50;
cycleTime = 100;



//  Constant to determine whether the user is entering data is metric form or not - CLS
const isUnitMetric = false



testModifier = 1.0;

// ARRAY of Z-Statistic values for p = 1-100.
const pValue = [
    -2.33, -2.05, -1.88, -1.75, -1.64, -1.55, -1.48, -1.41, -1.34, -1.28, -1.23, -1.18, -1.13, -1.08, -1.04, -0.99, -0.95, -0.92, -0.88, -0.84, -0.81, -0.77, -0.74, -0.71, -0.67, -0.64, -0.61, -0.58, -0.55, -0.52, -0.50, -0.47, -0.44, -0.41, -0.39, -0.36, -0.33, -0.31, -0.28, -0.25, -0.23, -0.20, -0.18, -0.15, -0.13, -0.10, -0.08, -0.05, -0.03, 0, 0.03, 0.05, 0.08, 0.10, 0.13, 0.15, 0.18, 0.20, 0.23, 0.25, 0.28, 0.31, 0.33, 0.36, 0.39, 0.41, 0.44, 0.47, 0.50, 0.52, 0.55, 0.58, 0.61, 0.64, 0.67, 0.71, 0.74, 0.77, 0.81, 0.84, 0.88, 0.92, 0.95, 0.99, 1.04, 1.08, 1.13, 1.18, 1.23, 1.28, 1.34, 1.41, 1.48, 1.55, 1.64, 1.75, 1.88, 2.05, 2.33, 3.09
];


/*  INPUT

    'input' array holds the user input in the form of objects (each object represents a task).

    Each task contains a number of input items that represent the things that
    a user would be entering on the task creation page of the real app.

    Some of these items are the same as the first two modules: name, hand,
    force count, magnitude, and duration.

    Additionally, there are some new items that are going to be used specifically
    in module 3 to calculate the mean and standard deviation values.

    This array will be used as a parameter for the 'createTask' function in part 2.
*/


const input = [
    {
        taskName: "Task One (Imperial)",
        hand: "Right",
        posture: "Standing",
        forceDirection: "Up",
        handPosition_verticalHeight: "37.81", // inches
        handPosition_horizontalDistance: "7.01", // inches
        handPosition_lateralDirection: "Outside", 
        handPosition_lateralDistance: "7.05", // inches 
        forceCount: "1",
        forceMagnitude: "1", // lbs
        forceDuration: "1"
    },
    {
        taskName: "Task Two",
        hand: "Left",
        posture: "Standing",
        forceDirection: "Away",
        handPosition_verticalHeight: "40.81",
        handPosition_horizontalDistance: "0.83",
        handPosition_lateralDirection: "Centered",
        handPosition_lateralDistance: "0",
        forceCount: "1",
        forceMagnitude: "1",
        forceDuration: "1"
    },
    {
        taskName: "Task Three",
        hand: "Right",
        posture: "Standing",
        forceDirection: "Inward",
        handPosition_verticalHeight: "54",
        handPosition_horizontalDistance: "0",
        handPosition_lateralDirection: "Outside",
        handPosition_lateralDistance: "9.29",
        forceCount: "1",
        forceMagnitude: "1",
        forceDuration: "1"
    },
    {
        taskName: "Task Four",
        hand: "Left",
        posture: "Standing",
        forceDirection: "Down",
        handPosition_verticalHeight: "61.1",
        handPosition_horizontalDistance: "15.28",
        handPosition_lateralDirection: "Inside",
        handPosition_lateralDistance: "7.9",
        forceCount: "1",
        forceMagnitude: "1",
        forceDuration: "1"
    }
]

/*  END INPUT - CLS
*/



// ******** TESTING FUNCTIONS & DATASETS *****************
// Add back and make transformer-compatible ????
// See Calculations 11-5-24 to get this code


// EDGE CASE 4 - NOT ENOUGH TIME IN CYCLE TO PERFORM TASKS
// As the user inputs tasks, total time to apply forces (i.e., sum of Count x Duration for all tasks) can't exceed Cycle Time)

function screenNotEnoughTimeInCycle(taskInputs, hand_s) {

    let timeToPerformTask = 0;
    let totalTime = 0;

    console.log(" ");
    console.log(" ");
    console.log(`${hand_s} Hand Values`);

    for (let w = 0; w < taskInputs.length; w++) {

        let forceName_Screen = taskInputs[w].TaskName;
        console.log(" ");
        console.log(forceName_Screen);
        timeToPerformTask = taskInputs[w].ForceCount * taskInputs[w].ForceDuration;
        console.log(`Task Duration = ${timeToPerformTask}`);
        totalTime = totalTime + timeToPerformTask;
        console.log(`totalTime = ${totalTime}`);

        if (totalTime > cycleTime) {
            console.log(`The Cycle Time is too short to complete all Tasks entered for the ${hand_s} hand. Try reducing this Task's Count and/or Duration, or increase the Cycle Time to ${totalTime} sec or greater.`)
        }
        // else {
        //     console.log(`Still enough time to perform remaining tasks for ${hand_s} hand!`)
        // }
    }
}

/*  FUNCTIONS 

    1.  createTask 

        This function is what takes in the input array, uses the values stored in each of the input
        objects to determine the appropriate mean and standard deviation values, and then creates
        an output array containing all of the information needed to perform the percent fatigued
        and metric contribution calculations.

        The function can be conceptually broken down into 3 parts, 
            a.) convert input units to metric (if necessary)
            b.) determining the horizontal, vertical, and lateral coordinate values; 
            c,) calculating the absolute distance of the hand to check if input is valid
            d.) calculating the mean and standard deviation values; 
            c.) creating the output task array of objects.

        Most of the function runs within a loop that iterates through each input object
        of the input function.  At the end (once the loop ends), the full output array is returned.

    2.  calculateMean
        
        This function is called by the createTask function to calculate the baseline mean strength
        in a given direction at the provided hand coordinates.

        The function was separated so that we could call it twice, once for the female mean value
        and once for the male, since their hand coordinates are different due to different average shoulder
        heights and torso lengths.

        It takes in parameters for the vertical coordinate (v), the horizontal coordinate (h),
        the lateral coordinate (l), and the direction in which the force is being applied (direction).

        Function returns the base FEMALE mean value at the given shoulder height.

*/

function createTask(input) {

    let verticalCoordinateFemale
    let verticalCoordinateMale
    let horizontalCoordinate
    let lateralCoordinate

    let output = new Array()

    for(let i = 0; i < input.length; i++) {

        if (!isUnitMetric){
            input[i].handPosition_verticalHeight = input[i].handPosition_verticalHeight*inchToMeterRatio
            input[i].handPosition_horizontalDistance = input[i].handPosition_horizontalDistance*inchToMeterRatio
            input[i].handPosition_lateralDistance = input[i].handPosition_lateralDistance*inchToMeterRatio

            input[i].forceMagnitude = input[i].forceMagnitude/newtonsToPoundsRatio
        }

        verticalCoordinateFemale = 0
        verticalCoordinateMale = 0
        horizontalCoordinate = 0
        lateralCoordinate = 0

        if(input[i].posture === "Standing") {
            verticalCoordinateFemale = ((input[i].handPosition_verticalHeight) - (averageFemaleShoulderHeight)) // m
            verticalCoordinateMale = ((input[i].handPosition_verticalHeight) - (averageMaleShoulderHeight))
        } else {
            verticalCoordinateFemale = ((input[i].handPosition_verticalHeight) - (averageFemaleTorsoLength))
            verticalCoordinateMale = ((input[i].handPosition_verticalHeight) - (averageMaleTorsoLength)) // m
        }

        horizontalCoordinate = input[i].handPosition_horizontalDistance // m

        switch (input[i].handPosition_lateralDirection) {
            case 'Inside':
                lateralCoordinate = ((-1)*(input[i].handPosition_lateralDistance)) // m
                break
            case 'Centered':
                lateralCoordinate = 0
                break
            case 'Outside':
                lateralCoordinate = input[i].handPosition_lateralDistance // m
                break
            default:
        }

        // if(Math.sqrt(verticalCoordinateFemale**2 + horizontalCoordinate**2 + lateralCoordinate**2)>maxFemaleArmLength || Math.sqrt(verticalCoordinateMale**2 + horizontalCoordinate**2 + lateralCoordinate**2)>maxMaleArmLength) {
        //     console.log(`Task ${i+1} - possible error: hand too far away from body`)
        // }

        const femaleMean = calculateMean(verticalCoordinateFemale, horizontalCoordinate, lateralCoordinate, input[i].forceDirection) // N
        const femaleStdDev = (femaleMean*(0.3)) // N
        const maleMean = (calculateMean(verticalCoordinateMale, horizontalCoordinate, lateralCoordinate, input[i].forceDirection)*(1.5)) // N
        const maleStdDev = (maleMean*(0.3)) // N

        let task = new Object()

        task.Task = (i + 1)
        task.TaskName = input[i].taskName
        task.Hand = input[i].hand
        task.ForceMagnitude = input[i].forceMagnitude // N
        task.ForceCount = input[i].forceCount
        task.ForceDuration = input[i].forceDuration // sec
        task.MaleMean = maleMean // N
        task.MaleStdDev = maleStdDev // N
        task.FemaleMean = femaleMean // N
        task.FemaleStdDev = femaleStdDev // N

        output.push(task)
    }
    
    return output
}

function calculateMean(v, h, l, direction) {
    let mean

    switch (direction) {
        case 'Up': //Superior
            mean = (100.7 + 91.93*(v**2) - 161.7*(h**2) - 179.03*(l**2) - 60.6*(h*v) + 58.21*(l*v))
            break
        case 'Down': //Inferior
            mean = (140.2 + 208.72*(v) - 32.47*(l) - 46.37*(v**2) - 187.06*(h**2) - 169.46*(l**2) - 604.21*(v**3) - 220.40*(h*v) - 127.77*(l*v))
            break
        case 'Away': //Anterior
            mean = (96.2 - 43.06*(v) - 31.34*(l) - 126.96*(v**2) + 181.93*(h**2) - 283.74*(l**2) + 147.23*(v**3) + 373.58*(l**3) + 32.08*(l*v))
            break
        case 'Toward': //Posterior
            mean = (98.9 - 36.73(l) - 139.18*(v**2) + 456.95*(h**2) - 391.98(l**2) - 496.04*(h**3) + 607.89*(l**3) - 171.07*(h*v) - 58.8*(l*v))
            break
        case 'Inward': //Medial
            mean = (95.1 - 123.58*(v**2) - 226.49*(h**3) + 347.73*(l**3) - 61.24*(h*v) - 179.04*(l*v))
            break
        case 'Outward': //Lateral
            mean = (55.4 + 68.94*(h) + 87.23*(l) - 315.53*(h**3) - 293.33*(h*l) + 45.4*(h*v))
            break
        default:
            mean = 0
    }

    return mean
}

/* END task creator functions - CLS
*/

/*  task creator MAIN

    Contains constants.

    Creates a constant 'tasks' which is used by the calculator as the input array.
    This array is filled by the returning output array from the 'createTasks' function.

*/

const averageFemaleShoulderHeight = 1.3550 // meters
const averageMaleShoulderHeight = 1.4300 // meters
const averageFemaleTorsoLength = 0.6150 // meters
const averageMaleTorsoLength = 0.6600 // meters
const maxFemaleArmLength = 0.762 // meters
const maxMaleArmLength = 0.9144 // meters
const averageFemaleArmLength = 0.6

const inchToMeterRatio = 0.0254
const newtonsToPoundsRatio = 0.224809

const tasks = createTask(input)

/*  END task creator MAIN - CLS
*/


const tasks_RH = tasks.filter(z => z.Hand === "Right" || z.Hand === "Both");
const tasks_LH = tasks.filter(z => z.Hand === "Left" || z.Hand === "Both");




// SET P-VALUE FLOOR (Prevent a negative population strength value)

function setPValueFloor(tasks_d, gender_d) {

    let floor = 0;

    for (let j = 0; j < tasks_d.length; j++) {

        let forceTypeCalc = tasks_d[j].ForceType;
        // console.log(forceTypeCalc);
        let mean = 0;
        let stdDev = 0;
        let tempFloor = 0;

        /*  Changed the following If-Else statement. 
            Previously it pulled the mean and standard dev values from the force type array.
            Now, it can look in the tasks_d parameter sent to this function and pull the values straight from
            named attributes there.
        */

        if (gender_d === "Male") {
            mean = tasks_d[j].MaleMean;
            stdDev = tasks_d[j].MaleStdDev;
        }
        else {
            mean = tasks_d[j].FemaleMean;
            stdDev = tasks_d[j].FemaleStdDev;
        }

        /*  End of changes.
        */


        for (let i = 0; i < pValue.length; i++) {
            let populationStrength = 0;
            populationStrength = mean + (pValue[i] * stdDev);
            // console.log(populationStrength);

            if (populationStrength >= 0) {
                tempFloor = i;
                break;
            }
        }
        if (tempFloor > floor) {
            floor = tempFloor;
        }
    }
    // console.log(`pValue Floor is ${floor}`);
    return floor;
}



// PERCENT FATIGUED FUNCTION
// Calculates the Percent Fatigued Metric using parameter inputs of RH or LH filtered tasks, and gender (male or female)
function percentFatigued(taskInputs, gender) {

    // If dataset is empty (i.e., no tasks for RH or LH) then function returns a value of 0 for Percent Fatigued
    let test = taskInputs.length;
    if (test === 0) {
        let i;
        return i = 0;
    }

    else {

        let iFloor = 0;
        iFloor = setPValueFloor(taskInputs, gender);
        // console.log(iFloor);

        // OUTER LOOP (pValues)
        for (let i = iFloor; i < pValue.length; i++) {

            let totalTaskRecovery = 0;
            let totalTaskDuration = 0;

            // INNER LOOP (Tasks)
            for (let j = 0; j < taskInputs.length; j++) {

                let forceTypeCalc = taskInputs[j].ForceType;
                let mean = 0;
                let stdDev = 0;



                /*  Changed the following If-Else statement. 
                    Previously it pulled the mean and standard dev values from the force type array.
                    Now, it can look in the taskInputs parameter sent to this function and pull the values straight from
                    named attributes there.
                */

                if (gender === "Male") {
                    mean = taskInputs[j].MaleMean;
                    stdDev = taskInputs[j].MaleStdDev;
                }
                else {
                    mean = taskInputs[j].FemaleMean;
                    stdDev = taskInputs[j].FemaleStdDev;
                }

                /*  End of changes.
                */  



                let populationStrength = 0;
                populationStrength = mean + (pValue[i] * stdDev);


                let taskDuration = taskInputs[j].ForceDuration * taskInputs[j].ForceCount;
                totalTaskDuration = totalTaskDuration + taskDuration;

                let forceMagnitude = taskInputs[j].ForceMagnitude;

                let taskRecovery = (taskDuration) / (1 - (forceMagnitude / (populationStrength))) ** (1 / 0.24) - (taskDuration);

                totalTaskRecovery = totalTaskRecovery + taskRecovery;
            }

            console.log(`${gender} pValue = ${i}, Solve Value = ${(cycleTime - totalTaskDuration) - totalTaskRecovery}`);

            if (totalTaskRecovery <= (cycleTime - totalTaskDuration) || i === 99) {
                // Returns i + 1, for the pValue at which totalTaskRecovery was <= cycleTime - totalTaskDuration. This is the Percent Fatigued metric used in subsequent Metrics display
                console.log(" ");
                console.log(`${gender} Total Task Recovery = ${totalTaskRecovery}\n${gender} Percent Fatigued = ${i + 1} %`);
                console.log(" ");
                return i + 1;
                break;
            }
        }
    }
}


// PERCENT CONTRIBUTION FUNCTION
// Calculates the Percent Contribution metric by task. If < 100% females are fatigued, use pValue corresponding to Female Percent Fatigued. If 100% of Females are fatigued, use pValue corresponding to the Male Percent Fatigued metric. The two arrays in the RETURN array are used in metrics calculation.
function percentContribution(taskInputs, percent, gender2) {

    let storeTaskNames = [];
    let storeRecoveryTimes = [];
    let storeMetricContribution = [];
    let storeResults = [];

    let totalTaskRecovery_MC = 0;
    let totalTaskDuration_MC = 0;
    let mean_MC = 0;
    let stdDev_MC = 0;

    for (let k = 0; k < taskInputs.length; k++) {

        let forceType_MC = taskInputs[k].ForceType;

        /*  Changed the following If-Else statement. 
            Previously it pulled the mean and standard dev values from the force type array.
            Now, it can look in the taskInputs parameter sent to this function and pull the values straight from
            named attributes there.
        */

        if (gender2 === "Male") {
            mean_MC = taskInputs[k].MaleMean;
            stdDev_MC = taskInputs[k].MaleStdDev;
        } else {
            mean_MC = taskInputs[k].FemaleMean;
            stdDev_MC = taskInputs[k].FemaleStdDev;
        }

        /*  End of changes.
        */  


        let populationStrength_MC = 0;
        // Note, "percent - 1" index used below. If used "percent", calculation would be 1 index off due to first slot in array being 0
        populationStrength_MC = mean_MC + (pValue[percent - 1] * stdDev_MC);



        /*  Changed the following section to remove the modifier variables.

            A modifier constant was created here that took all of the modifier values from the tasks
            array in module 1 (Hand and Finger) and multiplied them together. 
            Since modifiers are now being calculated and implemented in the very beginning of the code, 
            then there is no value in this part at all.

            Also removed the use of the modifier variable in the force magnitude equation and the
            task recovery equation below.
        */

        let taskDuration_MC = taskInputs[k].ForceDuration * taskInputs[k].ForceCount;
        let forceMagnitude_MC = taskInputs[k].ForceMagnitude;

        let taskRecovery_MC = (taskDuration_MC) / (1 - (forceMagnitude_MC / (populationStrength_MC))) ** (1 / 0.24) - (taskDuration_MC);

        /*  End of changes.
        */



        // CONSOLE TO SEE ---- DELETE
        // console.log(`For ${percent} PopStrength, ${taskInputs[k].TaskName}: ${taskRecovery_MC}`);

        totalTaskRecovery_MC = totalTaskRecovery_MC + taskRecovery_MC

        totalTaskDuration_MC = totalTaskDuration_MC + taskDuration_MC

        // PUSH Task Name and Task Recovery Time into array
        storeTaskNames.push(taskInputs[k].TaskName);
        storeRecoveryTimes.push(taskRecovery_MC);
    }

    for (let m = 0; m < taskInputs.length; m++) {
        storeMetricContribution.push(rounder(storeRecoveryTimes[m] / totalTaskRecovery_MC));
    }

    // CONSOLE RESULTS
    console.log(" ");
    console.log(`Cycle Time: ${cycleTime}`);
    console.log(`Available Recovery: ${cycleTime - totalTaskDuration_MC}`)
    console.log(`Total Task Duration = ${totalTaskDuration_MC}`);
    console.log(`${gender2} Total Task Recovery = ${totalTaskRecovery_MC}`);

    storeResults.push(storeTaskNames);
    storeResults.push(storeMetricContribution);

    return storeResults;
}


// METRICS CALCULATION FUNCTION

// Establish variables for metricsCalculation Function
console.log("LEFT HAND:");
console.log(" ");
percentFemalesFatigued_LH = percentFatigued(tasks_LH, "Female");
percentMalesFatigued_LH = percentFatigued(tasks_LH, "Male");
console.log("RIGHT HAND:");
console.log(" ");
percentFemalesFatigued_RH = percentFatigued(tasks_RH, "Female");
percentMalesFatigued_RH = percentFatigued(tasks_RH, "Male");

console.log(`Percent Female workers = ${percentFemaleWorkers} %`);
console.log(`Percent Male workers = ${percentMaleWorkers} %`);

// Function itself ...
function metricsCalculation(percentFatigued_Female, percentFatigued_Male, hand, handTasks) {
    console.log(" ");
    console.log(`RESULTS - ${hand} Hand:`);
    console.log(" ");
    console.log(`Females Percent Fatigued for ${hand} Hand = ${percentFatigued_Female} %`);
    console.log(`Male Percent Fatigued for ${hand} Hand = ${percentFatigued_Male} %`);

    percentWorkersFatigued = (percentFatigued_Female * percentFemaleWorkers / 100) + (percentFatigued_Male * percentMaleWorkers / 100);
    console.log(`Percent Workers Fatigued for ${hand} Hand = ${rounder1(percentWorkersFatigued)} %`);

    // CASE 1 - There is a feasible Female solution
    if (percentFatigued_Female < 100) {
        const logResultsArray = percentContribution(handTasks, percentFatigued_Female, "Female");
        console.log(" ");
        console.log(`FEMALE Metric Contribution Values`);
        for (let x = 0; x < handTasks.length; x++) {
            console.log(`Case 1: ${logResultsArray[0][x]} = ${logResultsArray[1][x]}`);
        }
    }

    // CASE 2 - No feasible Female solution (i.e., 100% Females Fatigued), but a feasible Male solution
    if (percentFatigued_Female === 100 && percentFatigued_Male < 100) {
        const logResultsArray = percentContribution(handTasks, percentFatigued_Male, "Male");
        console.log(" ");
        console.log(`MALE Metric Contribution Values`);
        for (let x = 0; x < handTasks.length; x++) {
            console.log(`Case 2: ${logResultsArray[0][x]} = ${logResultsArray[1][x]}`);
        }
    }

    // CASE 3 - No feasible Female or Male solution
    if (percentFatigued_Male === 100) {
        const logResultsArray = percentContribution(handTasks, percentFatigued_Male, "Male");
        console.log(" ");
        console.log(`MALE Metric Contribution Values`);
        for (let x = 0; x < handTasks.length; x++) {
            console.log(`Case 3: ${logResultsArray[0][x]} = ${logResultsArray[1][x]}`);
        }
    }
}

// RUN METRICS CALCULATION FUNCTION
metricsCalculation(percentFemalesFatigued_LH, percentMalesFatigued_LH, "Left", tasks_LH);
console.log(" ");
metricsCalculation(percentFemalesFatigued_RH, percentMalesFatigued_RH, "Right", tasks_RH);

