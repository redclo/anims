export default "uniform mat4 projectionMatrix;uniform mat4 modelViewMatrix;attribute vec3 position;attribute vec2 uv;varying vec2 v_uv;void main(){v_uv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}"