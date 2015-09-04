uniform vec3 color;
uniform vec2 mousePosition;

void main() {
	float length = (1.0 / distance(mousePosition, gl_FragCoord.xy)) * 60.0;
	gl_FragColor = vec4(color, length * length);
}