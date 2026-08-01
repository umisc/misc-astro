import * as THREE from 'three';

export type AuroraMaterial = THREE.RawShaderMaterial & {
  uniforms: {
    uTime: THREE.IUniform<number>;
    uAmplitude: THREE.IUniform<number>;
    uColorStops: THREE.IUniform<THREE.Color[]>;
    uColorStops2: THREE.IUniform<THREE.Color[]>;
  };
};

export const vertexShader = `
in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

export const fragmentShader = `
precision highp float;
uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec3 uColorStops2[3];
in vec2 vUv;
out vec4 fragColor;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m * m * m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x*x0.x + h.x*x0.y;
  g.yz = a0.yz*x12.xz + h.yz*x12.yw;
  return 130.0 * dot(m, g);
}
vec3 ramp(vec3 c0, vec3 c1, vec3 c2, float t) {
  t = clamp(t, 0.0, 1.0);
  return t <= 0.5 ? mix(c0, c1, t * 2.0) : mix(c1, c2, (t - 0.5) * 2.0);
}
void main() {
  vec3 a = ramp(uColorStops[0], uColorStops[1], uColorStops[2], vUv.y);
  vec3 b = ramp(uColorStops2[0], uColorStops2[1], uColorStops2[2], vUv.y);
  float n1 = exp(snoise(vec2(vUv.y * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude);
  float n2 = exp(snoise(vec2(vUv.y * 2.0 - uTime * 0.15, uTime * 0.3)) * 0.5 * uAmplitude);
  float left = clamp(vUv.x * 2.0 - n1 + 0.2, 0.0, 1.0);
  float right = clamp((1.0 - vUv.x) * 2.0 - n2 + 0.2, 0.0, 1.0);
  vec3 l = 0.7 * left * a;
  vec3 r = 0.7 * right * b;
  vec3 additive = l + r;
  vec3 dominant = max(l, r);
  vec3 blend = mix(additive, dominant, 0.78);
  blend = mix(blend, dominant, 4.0 * vUv.x * (1.0 - vUv.x) * 0.35);
  fragColor = vec4(blend * 0.9 + vec3(0.1), 1.0);
}`;

export function createAuroraMaterial(
  colors: string[],
  secondaryColors: string[],
): AuroraMaterial {
  return new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: 1 },
      uColorStops: { value: colors.map((color) => new THREE.Color(color)) },
      uColorStops2: {
        value: secondaryColors.map((color) => new THREE.Color(color)),
      },
    },
    vertexShader,
    fragmentShader,
  }) as AuroraMaterial;
}
