fs=`


precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main(void)
{

    vec2 uv = gl_FragCoord.xy / resolution.xy - .5;
    uv.y *= resolution.y / resolution.x;
    vec3 dir = vec3(uv * 1.4, 1.);
    float a2 = time * 0.001 + .5;
    float a1 = a2;
    mat2 rot1 = mat2(cos(a1), sin(a1), - sin(a1), cos(a1));
    dir.xz *= rot1;
    dir.xy *= rot1;
    vec3 from = vec3(0., 0., 0.);
    
    from += vec3(1.25 * mouse.x * 0.5,  -1.03 * mouse.y * 0.7, - 2.);
    from.xz *= rot1;
    from.xy *= rot1;
    float s = .1, fade = .07;
    vec3 v = vec3(0.4);
    for(int r = 0; r < 9; r ++) 
    {
        vec3 p = from + s * dir * 1.5;
        p = abs(0.75 - mod(p, 1.5));
        p.x += float(r * r) * 0.01;
        p.y += float(r) * 0.02;
        float pa, a = pa = 0.;
        for(int i = 0; i < 16; i++)
        {
            p = abs(p) / dot(p, p) - 0.34;
            a += abs(length(p) - pa * 0.2);

            pa = length(p);
        }
        a *= a * a * 2.;
        v += vec3(s, s * s, s * s * s * s) * a * 0.0017 * fade;
        fade *= 0.96;
        s += 0.11;
    }
    v = mix(vec3(length(v)), v, 0.8);

    v = v * .01;

    //hdr adjustment
    vec3 mappedColor = v * 0.1; //exposure 0.1

    // Apply gamma correction
    mappedColor = pow(mappedColor, vec3(1.0 / 1.5)); //gamma 1.5

    gl_FragColor = vec4(mappedColor, 1.);
}


`