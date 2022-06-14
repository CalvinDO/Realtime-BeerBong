let pCups = [
    // yours
    // 1. row
    {
        x: 0,
        y: 0.67,
        z: 0.85
    },
    // 2. row
    {
        x: 0.045,
        y: 0.67,
        z: 0.93
    },
    {
        x: -0.045,
        y: 0.67,
        z: 0.93
    },
    // 3. row
    {
        x: -0.09,
        y: 0.67,
        z: 1.01
    },
    {
        x: 0,
        y: 0.67,
        z: 1.01
    },
    {
        x: 0.09,
        y: 0.67,
        z: 1.01
    },
    // 4. row
    {
        x: 0.135,
        y: 0.67,
        z: 1.09
    },
    {
        x: 0.045,
        y: 0.67,
        z: 1.09
    },
    {
        x: -0.135,
        y: 0.67,
        z: 1.09
    },
    {
        x: -0.045,
        y: 0.67,
        z: 1.09
    },
    // water cup
    {
        x: 0.21,
        y: 0.67,
        z: 0.75
    },

    // enemies
    //1. row
    {
        x: 0,
        y: 0.67,
        z: -0.85
    },
    // 2. row
    {
        x: 0.045,
        y: 0.67,
        z: -0.93
    },
    {
        x: -0.045,
        y: 0.67,
        z: -0.93
    },
    // 3. row
    {
        x: -0.09,
        y: 0.67,
        z: -1.01
    },
    {
        x: 0,
        y: 0.67,
        z: -1.01
    },
    {
        x: 0.09,
        y: 0.67,
        z: -1.01
    },
    // 4. row
    {
        x: 0.135,
        y: 0.67,
        z: -1.09
    },
    {
        x: 0.045,
        y: 0.67,
        z: -1.09
    },
    {
        x: -0.135,
        y: 0.67,
        z: -1.09
    },
    {
        x: -0.045,
        y: 0.67,
        z: -1.09
    },
    // water cup
    {
        x: -0.21,
        y: 0.67,
        z: -0.75
    }
]

function init() {
    console.log("init");
    let aMarker = document.getElementById("a_Marker");
    for (let i = 0; i < pCups.length; i++) {
        if (i <= 10) {
            aMarker.innerHTML += "<a-entity position='" + pCups[i].x + " " + pCups[i].y + " " + pCups[i].z + "' scale='1.0 1.0 1.0' gltf-model='./Assets/RedCup.glb'></a-entity>"
        } else {
            aMarker.innerHTML += "<a-entity position='" + pCups[i].x + " " + pCups[i].y + " " + pCups[i].z + "' scale='1.0 1.0 1.0' gltf-model='./Assets/BlueCup.glb'></a-entity>"
        }
    }
}

init();