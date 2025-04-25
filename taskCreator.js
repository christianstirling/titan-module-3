/*  PART 0 - Unit Toggle

    Set 'true' to make input units metric
    Set 'false' to make input units imperial (this will lead to a conversion
        from the imperial units to metric units before any calculation happens)
*/

const isUnitMetric = false

/*  PART 1 - INPUT

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

/* PART 2 - FUNCTIONS

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

/*  PART 3 - MAIN

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

/*  PART 4 - CONSOLE LOG

    Not for use in actual calculator.
*/

console.log(...tasks)