// WebGL boilerplate helpers for the watercolor dissolve effect

export function createWebGLContext(
  canvas: HTMLCanvasElement
): WebGLRenderingContext | null {
  const gl =
    canvas.getContext("webgl") ||
    (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
  return gl;
}

export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }

  return shader;
}

export function linkProgram(
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${info}`);
  }

  return program;
}

export function createFullScreenQuad(
  gl: WebGLRenderingContext,
  program: WebGLProgram
): void {
  // Two triangles covering clip space, with UV coordinates
  // prettier-ignore
  const vertices = new Float32Array([
    // position (x,y)  texcoord (u,v)
    -1, -1,            0, 1,   // bottom-left  (UV flipped: v=1 at bottom)
     1, -1,            1, 1,   // bottom-right
    -1,  1,            0, 0,   // top-left
     1,  1,            1, 0,   // top-right
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const stride = 4 * Float32Array.BYTES_PER_ELEMENT;

  const posLoc = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, stride, 0);

  const uvLoc = gl.getAttribLocation(program, "a_texcoord");
  gl.enableVertexAttribArray(uvLoc);
  gl.vertexAttribPointer(
    uvLoc,
    2,
    gl.FLOAT,
    false,
    stride,
    2 * Float32Array.BYTES_PER_ELEMENT
  );
}

export interface TextureResult {
  texture: WebGLTexture;
  width: number;
  height: number;
}

export function loadTexture(
  gl: WebGLRenderingContext,
  src: string
): Promise<TextureResult> {
  return new Promise((resolve, reject) => {
    const tex = gl.createTexture();
    if (!tex) {
      reject(new Error("Failed to create texture"));
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        img
      );

      // Handle non-power-of-2 textures
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      resolve({ texture: tex, width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => reject(new Error(`Failed to load texture: ${src}`));
    img.src = src;
  });
}
