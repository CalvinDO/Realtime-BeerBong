import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { shaderVariablesSingleton } from './ShaderVariables.js';

let CustomShader = {
	uniforms: {
		tDiffuse: { value: null },
        drunkStage: {type: 'float', value: shaderVariablesSingleton.drunkLevel },
        drunk: { type: 'bool', value: shaderVariablesSingleton.drunk },
        u_resolution: { type: 'vec2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        length_center_to_corner: { type: 'float', value: new THREE.Vector2(window.innerWidth, window.innerHeight).length() },
        amount: { value: 0.0}
	},

	vertexShader: `
		varying vec2 vUv;
        uniform bool drunk;
        uniform float drunkStage;
        uniform float amount;

		void main() {
			vUv = uv;
            if(drunk) {
                gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(position[0] + sin(amount) * drunkStage,position[1],position[2]), 1.0 );
            } else {
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
		}`,
	fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform float drunkStage;
        uniform bool drunk;
        uniform vec2 u_resolution;
        uniform float length_center_to_corner;
        
        
        void main()
        {
            vec4 tex = texture2D( tDiffuse, vUv );
            float rad = length_center_to_corner / 2.0;
            vec2 center = vec2(u_resolution.x * 0.5, u_resolution.y * 0.5);
            
            if(drunk) {
                //////////////////////////////////////////////
                float relPosX = abs(gl_FragCoord.x - center.x);
                float relPosY = abs(gl_FragCoord.y - center.y);
                float fragDist = sqrt((relPosX * relPosX) + (relPosY * relPosY));
                float circleInfo = (rad - fragDist)/rad;
                float value = smoothstep(0.0, 1.0, circleInfo/drunkStage);
                
                gl_FragColor = vec4(tex[0] * value, tex[1] * value, tex[2] * value, 1.0);
            } else {
                gl_FragColor = vec4(tex[0], tex[1], tex[2], 1.0);
            }  
        }`
};


//Reference: https://www.shadertoy.com/view/XdfGDH (mrharicot) 29.05.2022
let CustomShader2 = {
	uniforms: {
		tDiffuse: { value: null },
        drunkStage: {type: 'float', value: shaderVariablesSingleton.drunkLevel },
        drunk: { type: 'bool', value: shaderVariablesSingleton.drunk },
        u_resolution: { type: 'vec2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
	},

	vertexShader: `
		varying vec2 vUv;
        uniform bool drunk;
        uniform float drunkStage;
        uniform float amount;

		void main() {
			vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,
	fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform float drunkStage;
        uniform bool drunk;
        uniform vec2 u_resolution;

        float normpdf(in float x, in float sigma)
        {
        	return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
        }
        
        void main()
        {
            vec4 tex = texture2D( tDiffuse, vUv );

            if(drunk) {
                //declare stuff
		        const int mSize = 11;
		        const int kSize = (mSize-1)/2;
		        float kernel[mSize];
		        vec3 final_colour = vec3(0.0);


                //create the 1-D kernel
		        float sigma = 1.0 * (drunkStage * 10.0);
		        float Z = 0.0;
		        for (int j = 0; j <= kSize; ++j)
		        {
		        	kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);
		        }

                //get the normalization factor (as the gaussian has been clamped)
		        for (int j = 0; j < mSize; ++j)
		        {
		        	Z += kernel[j];
		        }

                //read out the texels
		        for (int i=-kSize; i <= kSize; ++i)
		        {
		        	for (int j=-kSize; j <= kSize; ++j)
		        	{
		        		final_colour += kernel[kSize+j]*kernel[kSize+i]*texture(tDiffuse, (gl_FragCoord.xy+vec2(float(i),float(j))) / u_resolution.xy).rgb;
		        	}
		        }
                gl_FragColor = vec4(final_colour /(Z*Z), 1.0);

            } else {
                gl_FragColor = vec4(tex[0], tex[1], tex[2], 1.0);
            }  
        }`
};

let CustomShader3 = {
    uniforms: {
        tDiffuse: { value: null },
        drunkStage: {type: 'float', value: shaderVariablesSingleton.drunkLevel },
        drunk: { type: 'bool', value: shaderVariablesSingleton.drunk },
        u_resolution: { type: 'vec2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        amount: { value: 0.0}
    },

    vertexShader: `
		varying vec2 vUv;
        uniform bool drunk;
        uniform float drunkStage;
        uniform float amount;

		void main() {
			vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,
        fragmentShader: `
        //Reference: https://www.shadertoy.com/view/MdSGRh (moskow23) 29.05.22

        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform float drunkStage;
        uniform bool drunk;
        uniform vec2 u_resolution;
        uniform float amount;

        void main() {
            float drunkNum = sin(amount*2.0)*6.0;
            float unitDrunk1 = (sin(amount*1.2)+1.0)/2.0;
            float unitDrunk2 = (sin(amount*1.8)+1.0)/2.0;
    
            vec2 normalizedCoord = mod((gl_FragCoord.xy + vec2(0, drunkNum)) / u_resolution.xy, 1.0);
            normalizedCoord.x = pow(normalizedCoord.x, mix(1.25, 0.85, unitDrunk1));
            normalizedCoord.y = pow(normalizedCoord.y, mix(0.85, 1.25, unitDrunk2));
            vec2 normalizedCoord2 = mod((gl_FragCoord.xy + vec2(drunkNum, 0)) / u_resolution.xy, 1.0);	
            normalizedCoord2.x = pow(normalizedCoord2.x, mix(0.95, 1.1, unitDrunk2));
            normalizedCoord2.y = pow(normalizedCoord2.y, mix(1.1, 0.95, unitDrunk1));
            vec2 normalizedCoord3 = gl_FragCoord.xy/u_resolution.xy;
            vec4 color = texture(tDiffuse, normalizedCoord);
            vec4 color2 = texture(tDiffuse, normalizedCoord2);
            vec4 color3 = texture(tDiffuse, normalizedCoord3);

            if(drunkStage > 0.7) {
                color.x = sqrt(color2.x);
                color2.x = sqrt(color2.x);
                vec4 finalColor = mix( mix(color, color2, mix(0.4, 0.6, unitDrunk1)), color3, 0.4);
                      
                if (length(finalColor) > 1.4)
                    finalColor.xy = mix(finalColor.xy, normalizedCoord3, 0.5);
                else if (length(finalColor) < 0.4)
                    finalColor.yz = mix(finalColor.yz, normalizedCoord3, 0.5);
        
                gl_FragColor = finalColor;
            } else {
                vec4 tex = texture2D( tDiffuse, vUv );

                gl_FragColor = vec4(tex[0], tex[1], tex[2], 1.0);
            }
            
        }
        `
}

export { CustomShader, CustomShader2 , CustomShader3 };