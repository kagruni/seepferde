// Vertex + Fragment shader sources for watercolor dissolve effect
// Fragment shader uses 2D simplex noise (Ashima MIT license) for organic transition boundary

export const vertexShaderSource = `
attribute vec2 a_position;
attribute vec2 a_texcoord;
varying vec2 v_uv;

void main() {
  v_uv = a_texcoord;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const fragmentShaderSource = `
precision mediump float;

uniform sampler2D u_photo;
uniform sampler2D u_watercolor;
uniform float u_progress;
uniform vec2 u_resolution;
uniform vec2 u_image_resolution;
uniform float u_noise_scale;

varying vec2 v_uv;

// --- 2D Simplex Noise (Ashima Arts, MIT License) ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,   // (3.0-sqrt(3.0))/6.0
    0.366025403784439,   // 0.5*(sqrt(3.0)-1.0)
   -0.577350269189626,   // -1.0 + 2.0 * C.x
    0.024390243902439    // 1.0 / 41.0
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(
    dot(x0, x0),
    dot(x12.xy, x12.xy),
    dot(x12.zw, x12.zw)
  ), 0.0);

  m = m * m;
  m = m * m;

  vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x_) - 0.5;
  vec3 ox = floor(x_ + 0.5);
  vec3 a0 = x_ - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}
// --- End Simplex Noise ---

// object-cover UV: crop image to fill container while preserving aspect ratio
vec2 coverUV(vec2 uv, vec2 containerRes, vec2 imageRes) {
  float containerAspect = containerRes.x / containerRes.y;
  float imageAspect = imageRes.x / imageRes.y;
  vec2 result = uv;
  if (containerAspect > imageAspect) {
    float scale = containerAspect / imageAspect;
    result.y = (uv.y - 0.5) / scale + 0.5;
  } else {
    float scale = imageAspect / containerAspect;
    result.x = (uv.x - 0.5) / scale + 0.5;
  }
  return result;
}

void main() {
  vec2 cuv = coverUV(v_uv, u_resolution, u_image_resolution);
  vec4 photoColor = texture2D(u_photo, cuv);
  vec4 watercolorColor = texture2D(u_watercolor, cuv);

  // Primary noise for organic boundary
  float noise = snoise(v_uv * u_noise_scale);
  // Secondary noise octave stretched vertically for paint-drip feel
  float drip = snoise(vec2(v_uv.x * u_noise_scale * 2.0, v_uv.y * u_noise_scale * 0.5)) * 0.3;
  float combined = (noise + drip) * 0.5 + 0.5; // remap to 0-1

  // Transition mask with smooth edge
  float mask = smoothstep(u_progress - 0.15, u_progress + 0.15, combined);

  // Blend: mask=1 means photo, mask=0 means watercolor
  vec3 color = mix(watercolorColor.rgb, photoColor.rgb, mask);

  // Baked gradient overlays (matching existing CSS gradients)
  // Bottom-to-top: from rgba(42,63,40,0.80) at bottom, via rgba(42,63,40,0.25) at 25%, to transparent
  vec3 gradientColor = vec3(42.0/255.0, 63.0/255.0, 40.0/255.0);
  float vertGrad;
  if (v_uv.y > 0.75) {
    // Bottom 25%: lerp from 0.25 alpha to 0.80 alpha
    vertGrad = mix(0.25, 0.80, (v_uv.y - 0.75) / 0.25);
  } else {
    // Top 75%: lerp from 0.0 to 0.25
    vertGrad = mix(0.0, 0.25, v_uv.y / 0.75);
  }

  // Left-to-right: from rgba(42,63,40,0.30) at left to transparent at right
  float horizGrad = 0.30 * (1.0 - v_uv.x);

  // Combine gradients (additive blend, clamped)
  float gradAlpha = min(vertGrad + horizGrad, 1.0);
  color = mix(color, gradientColor, gradAlpha);

  gl_FragColor = vec4(color, 1.0);
}
`;
