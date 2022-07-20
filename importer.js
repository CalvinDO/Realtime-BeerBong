// used to import GLBS in the past, when ThreeJS had some bugs in our project

class Importer {
    static async import(path) {
        let str = await (await fetch(path)).text();

        let withoutVT = str.split('\r\nvt ');

        let splittedRows = withoutVT[0].split('\r\nv ');
        splittedRows.shift();




        let singleValues = [];

        for (let outerIndex = 0; outerIndex < splittedRows.length; outerIndex++) {
            let threesingles = splittedRows[outerIndex].split(" ");
            for (let innerIndex = 0; innerIndex < threesingles.length; innerIndex++) {
                singleValues.push(threesingles[innerIndex]);
            }
        }

        //newArray.forEach(row => singleValues.concat(row.split(' ')))

        //console.log(singleValues.);

        //console.log(singleValues); 

        const geometry = new THREE.BufferGeometry();
        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.

        const vertices = Float32Array.from(singleValues);
        /*
                const vertices = new Float32Array([
                    -1.0, -1.0, 1.0,
                    1.0, -1.0, 1.0,
                    1.0, 1.0, 1.0,
        
                    1.0, 1.0, 1.0,
                    -1.0, 1.0, 1.0,
                    -1.0, -1.0, 1.0
                ]);
        */
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const material = new THREE.MeshBasicMaterial({ wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }
}