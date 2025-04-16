

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

const isUnitMetric = false

// const input = [
//     {
//         name: "Task One",
//         hand: "Right",

//         forceDirection: "Up",
//         isStanding: true,
//         verticalHeight: "1.5494", // meters
//         lateralDistanceFromShoulder: "0", // meters
//         lateralDirectionFromShoulder: "Centered",
//         horizontalDistanceFromShoulder: "0.4724", // meters

//         forceCount: "1",
//         forceMagnitude: "14.4482", // N
//         forceDuration: "1"
//     },
//     {
        
//         name: "Task Two",
//         hand: "Left",

//         forceDirection: "Away",
//         isStanding: false,
//         verticalHeight: "0.9",
//         lateralDistanceFromShoulder: ".1",
//         lateralDirectionFromShoulder: "Inside",
//         horizontalDistanceFromShoulder: "0.2",

//         forceCount: "2",
//         forceMagnitude: "10",
//         forceDuration: "2"
//     }
// ]



const input = [
    {
        name: "Task One (Imperial)",
        hand: "Right",

        forceDirection: "Up",
        isStanding: true,
        verticalHeight: "37.81", // inches - waist
        lateralDistanceFromShoulder: "7.05", // inches 
        lateralDirectionFromShoulder: "Outside",
        horizontalDistanceFromShoulder: "7.01", // inches

        forceCount: "1",
        forceMagnitude: "1", // lbs
        forceDuration: "1"
    },
    {
        name: "Task Two",
        hand: "Left",

        // forceDirection: "Superior ? Inferior ? Anterior ? Posterior ? Medial ? Lateral",
        forceDirection: "Away",
        isStanding: true,
        verticalHeight: "40.81",
        lateralDistanceFromShoulder: "0",
        lateralDirectionFromShoulder: "Centered",
        horizontalDistanceFromShoulder: "0.83",

        forceCount: "1",
        forceMagnitude: "1",
        forceDuration: "1"
    },
    {
        name: "Task Three",
        hand: "Right",

        // forceDirection: "Superior ? Inferior ? Anterior ? Posterior ? Medial ? Lateral",
        forceDirection: "In",
        isStanding: true,
        verticalHeight: "54",
        lateralDistanceFromShoulder: "9.06",
        lateralDirectionFromShoulder: "Outside",
        horizontalDistanceFromShoulder: "0",

        forceCount: "1",
        forceMagnitude: "1",
        forceDuration: "1"
    },
    {
        name: "Task Four",
        hand: "Left",

        // forceDirection: "Superior ? Inferior ? Anterior ? Posterior ? Medial ? Lateral",
        forceDirection: "Down",
        isStanding: true,
        verticalHeight: "61.1",
        lateralDistanceFromShoulder: "7.9",
        lateralDirectionFromShoulder: "Inside",
        horizontalDistanceFromShoulder: "15.28",

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

        The function can be conceptually broken down into 3 parts, a.) determining the h, v, and l
        coordinate values; b.) calculating the mean and standard deviation pairs; c.) creating 
        the output task array of objects.

        Most of the function runs within a loop that iterates through each input object
        of the input function.

        Part a: 
            h (horizontal position of the hand relative to the shoulder), 
            v (vertical), and 
            l (lateral)

            These three variables make up the coordinates of the hand RELATIVE TO THE SHOULDER.

            h is simply calculated by measuring the forward distance from the shoulder to the hand.
            This is notably different from the straight line distance from the shoulder, directly
            to the hand.
            Here we are determining how far in the anterior, or straight ahead, direction the
            hand is.
            Since the input distance that the user is measuring in this case is coming in
            as inches, we convert it to meters.     MUST BE IN METERS FOR PART B TO WORK.

            v is calculated one of two ways.
            Before asking the user for the hand height input, the user is prompted
            to answer whether they are standing or sitting.
            If the user is standing, then they will be asked for the height of their
            hand relative to the ground.
            To determine the v value in this case, we will calculate the difference between the
            hand height value and the height of the average female shoulder from the ground.
            If the user is sitting, then they will measure their hand height from
            the seat of the chair.
            v will be calculated as the difference between their hand height and the
            height of the average female shoulder from the seat of the chair.
            Either way, the v value is converted from inches to METERS.

            l is calculated as the lateral distance from the shoulder to where the hand is
            (side to side direction).
            The user will first enter whether their hand is centered in front of their
            shoulder, positioned on the inside (towards the opposit shoulder), or positioned
            on the outside (away from body).
            If the user selects Centered, then a value of 0 will be entered for l.
            Otherwise, the user will be prompted to enter the distance inward or outward 
            as a positive number either way.
            If the user entered Inside, then the number will be converted to negative.
            All non-zero results are converted to METERS.

        Part b: 

            This part mostly just involves a switch case that checks the force direction
            input for the task currently selected and runs a specific equation that uses
            predetermined coefficients and the variables calculated in part a.
            
            This gives a 'temp' value, which is used to determine the mean and standard
            deviation values.

        Part c:

            Finally, we create a task object.

            This contains all of the 'normal' task information (name, number, hand, count,
            magnitude, duration) as well as the new information (male and female mean and 
            standard deviation).

            This object is pushed to the output array, and then the loop loops.
        

        At the end (once the loop ends), the full output array is returned.

        */

function createTask(input) {

    let h
    let v
    let l

    let output = new Array()

    for(let i = 0; i < input.length; i++) {


        //---------------------------------------------------------------
        // Start log

        console.log("Task", i+1)
        console.log("...")
        console.log("Part a: processing task information from user input")
        console.log("________________________________")
        console.log("Task name:", input[i].name)
        console.log("Hand:", input[i].hand)
        console.log("Posture (is user standing):", input[i].isStanding)
        console.log("Force direction:", input[i].forceDirection)
        if(isUnitMetric){
            console.log("Vertical hand height from floor (meters):", input[i].verticalHeight)
        }else{
            console.log("Vertical hand height from floor (inches):", input[i].verticalHeight)
        }
        console.log("Lateral hand position:", input[i].lateralDirectionFromShoulder)
        if(isUnitMetric){
            console.log("Lateral hand distance from shoulder (meters):", input[i].lateralDistanceFromShoulder)
            console.log("Horizontal hand distance from shoulder (meters):", input[i].horizontalDistanceFromShoulder)
            console.log("Magnitude of force (Newtons):", input[i].forceMagnitude)
        }else{
            console.log("Lateral hand distance from shoulder (inches):", input[i].lateralDistanceFromShoulder)
            console.log("Horizontal hand distance from shoulder (meters):", input[i].horizontalDistanceFromShoulder)
            console.log("Magnitude of force (lbs):", input[i].forceMagnitude)
        }
        console.log("Duration of force application (sec):", input[i].forceDuration)
        console.log("Number of times the force is carried out:", input[i].forceCount)
        console.log("...")

        // End log
        //---------------------------------------------------------------

        if (!isUnitMetric){
            
            input[i].horizontalDistanceFromShoulder = input[i].horizontalDistanceFromShoulder*inchToMeterRatio
            input[i].verticalHeight = input[i].verticalHeight*inchToMeterRatio
            input[i].lateralDistanceFromShoulder = input[i].lateralDistanceFromShoulder*inchToMeterRatio

            input[i].forceMagnitude = input[i].forceMagnitude/newtonsToPoundsRatio
        }


        //---------------------------------------------------------------
        // Start log

        console.log("Part b: checking to see if any conversions are necessary")
        console.log("________________________________")
        if(!isUnitMetric){
            console.log("You entered input in imperial units (inches and lbs)")
            console.log("Converted horizontal hand distance from shoulder (=> meters):", input[i].horizontalDistanceFromShoulder)
            console.log("Converted vertical hand height from floor (=> meters):", input[i].verticalHeight)
            console.log("Converted lateral hand distance from shoulder (=> meters):", input[i].lateralDistanceFromShoulder)
            console.log("Converted the magnitude value forceMagnitude (=> Newtons):", input[i].forceMagnitude)
        }else{
            console.log("You entered input in metric units (meters and newtons)")
            console.log("No conversion necessary")
        }
        console.log("...")

        // End log
        //---------------------------------------------------------------


        h = 0
        v = 0
        l = 0
                
        h = input[i].horizontalDistanceFromShoulder // m

        if(input[i].isStanding) {
            v = ((input[i].verticalHeight) - (averageFemaleShoulderHeight)) // m
        } else {
            v = ((input[i].verticalHeight) - (averageFemaleTorsoLength)) // m
        }

        switch (input[i].lateralDirectionFromShoulder) {
            case 'Inside':
                l = ((-1)*(input[i].lateralDistanceFromShoulder)) // m
                break
            case 'Centered':
                l = 0
                break
            case 'Outside':
                l = input[i].lateralDistanceFromShoulder // m
                break
            default:
        }

        //---------------------------------------------------------------
        //  Start log

        console.log("Part c: calculating the hand coordinates h, v, and l")
        console.log("________________________________")
        console.log("Calculated horizontal hand position h (meters): ", h)
        console.log("Calculated vertical hand position v (meters): ", v)
        console.log("Calculated lateral hand position l (meters): ", l)

        //  End log
        //---------------------------------------------------------------

        

        const d = Math.sqrt(h**2 + v**2 + l**2) // m



        //---------------------------------------------------------------
        //  Start log

        console.log("Part d: calculating absolute hand distance from shoulder to see if this position is possible")
        console.log("________________________________")
        console.log("Absolute distance from shoulder to hand d (meters): sqrt(h^2 + v^2 + l^2) =", d)
        console.log("Absolute distance (inches) =", d/inchToMeterRatio)
        console.log("Percentage of AVERAGE arm length:", (d/averageFemaleArmLength)*100)
        if(d > maxFemaleArmLength) {
            console.log("Possible error, hand too far from body")
        }else{
            console.log("This hand position is reasonable")
        }
        console.log("...")

        //  End log
        //---------------------------------------------------------------

        let temp = 0

        switch (input[i].forceDirection) {
            case 'Up': //Superior
                temp = (100.7 + 91.93*(v**2) - 161.7*(h**2) - 179.03*(l**2) - 60.6*(h*v) + 58.21*(l*v))
                break
            case 'Down': //Inferior
                temp = (140.2 + 208.72*(v) - 32.47*(l) - 46.37*(v**2) - 187.06*(h**2) - 169.46*(l**2) - 604.21*(v**3) - 220.40*(h*v) - 127.77*(l*v))
                break
            case 'Away': //Anterior
                temp = (96.2 - 43.06*(v) - 31.34*(l) - 126.96*(v**2) + 181.93*(h**2) - 283.74*(l**2) + 147.23*(v**3) + 373.58*(l**3) + 32.08*(l*v))
                break
            case 'To': //Posterior
                temp = (98.9 - 36.73(l) - 139.18*(v**2) + 456.95*(h**2) - 391.98(l**2) - 496.04*(h**3) + 607.89*(l**3) - 171.07*(h*v) - 58.8*(l*v))
                break
            case 'In': //Medial
                temp = (95.1 - 123.58*(v**2) - 226.49*(h**3) + 347.73*(l**3) - 61.24*(h*v) - 179.04*(l*v))
                break
            case 'Out': //Lateral
                temp = (55.4 + 68.94*(h) + 87.23*(l) - 315.53*(h**3) - 293.33*(h*l) + 45.4*(h*v))
                break
            default:
                temp = 0
        }

        const femaleMean = temp // N
        const femaleStdDev = (temp*(0.3)) // N
        const maleMean = (temp*(1.5)) // N
        const maleStdDev = (maleMean*(0.3)) // N



        //---------------------------------------------------------------
        //  Start log

        console.log("Part e: using the formulas from the paper to calculate the mean and standard devaiation values")
        console.log("________________________________")

        console.log("Female mean (meters): ", femaleMean)
        console.log("Female sd (meters): ", femaleStdDev)
        console.log("Male mean (meters): ", maleMean)
        console.log("Male sd (meters): ", maleStdDev)
        console.log("...")

        console.log("Part f: creating the 'task' output object and pushing it to the output array")
        console.log("________________________________")
        
        //  End log
        //---------------------------------------------------------------


        let task = new Object()

        task.Task = (i + 1)
        task.TaskName = input[i].name
        task.Hand = input[i].hand
        task.ForceMagnitude = input[i].forceMagnitude // N
        task.ForceCount = input[i].forceCount
        task.ForceDuration = input[i].forceDuration // sec

        task.MaleMean = maleMean // N
        task.MaleStdDev = maleStdDev // N
        task.FemaleMean = femaleMean // N
        task.FemaleStdDev = femaleStdDev // N

        //---------------------------------------------------------------
        //  Start log

        console.log("Output:", task)
        console.log("...")
        console.log("...")
        console.log("...")

        //  End log
        //---------------------------------------------------------------

        output.push(task)
    }
    
    return output
}

/*  PART 3 - MAIN

    Contains constants that are used in part a of the 'createTasks' function.

    Creates a constant 'tasks' which is used by the calculator as the input array.
    This array is filled by the returning output array from the 'createTasks' function.

*/

const averageFemaleShoulderHeight = 1.3716 // meters = 54 inches
const averageFemaleTorsoLength = 0.5588 // Found on the internet? in meters = 22 inches
const maxFemaleArmLength = 0.762 // Suggested by Murray - in meters = 30 inches
const averageFemaleArmLength = 0.6

const inchToMeterRatio = 0.0254
const newtonsToPoundsRatio = 0.224809



const tasks = createTask(input)



/*  PART 4 - CONSOLE LOG

    Not for use in actual calculator.
*/

// console.log(`Input array:`, input)
// console.log(`Output array:`, tasks)